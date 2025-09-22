import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabase";
// Import types from shared types
import { decode as atob } from "base-64"; // install with: npm install base-64
import { CommunityReport, PersonalReport } from "../types/api";
// Removed invalid File.fromUri usage

export interface CreateReportData {
  title: string;
  description: string;
  type: PersonalReport["type"];
  imageUri?: string;
  location?: PersonalReport["location"];
  isAnonymous?: boolean;
}

export interface ReportFilters {
  type?: string;
  status?: string;
  area?: string;
  limit?: number;
  offset?: number;
}

export class ReportsService {
  // Personal Reports
  static async getPersonalReports(): Promise<PersonalReport[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("reports")
      .select(
        `
        *,
        report_timeline (*)
      `
      )
      .eq("reporter_id", user.id)
      .eq("is_personal", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async createPersonalReport(
    reportData: CreateReportData
  ): Promise<PersonalReport> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    // Upload image if provided
    let imageUrl = null;
    if (reportData.imageUri) {
      imageUrl = await this.uploadImage(reportData.imageUri);
    }

    const { data, error } = await supabase
      .from("reports")
      .insert({
        title: reportData.title,
        description: reportData.description,
        type: reportData.type,
        image_url: imageUrl,
        location: reportData.location,
        is_anonymous: reportData.isAnonymous || false,
        is_personal: true,
        reporter_id: user.id,
        status: "submitted",
      })
      .select(
        `
        *,
        report_timeline (*)
      `
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Create initial timeline entry
    await supabase.from("report_timeline").insert({
      report_id: data.id,
      status: "submitted",
      description: reportData.isAnonymous
        ? "Report submitted anonymously"
        : "Report submitted by user",
    });

    return data;
  }

  static async updateReport(
    id: string,
    updates: Partial<PersonalReport>
  ): Promise<PersonalReport> {
    const { data, error } = await supabase
      .from("reports")
      .update({
        title: updates.title,
        description: updates.description,
        type: updates.type,
        status: updates.status,
        location: updates.location,
      })
      .eq("id", id)
      .select(
        `
        *,
        report_timeline (*)
      `
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteReport(id: string): Promise<void> {
    const { error } = await supabase.from("reports").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // Community Reports
  static async getCommunityReports(
    filters?: ReportFilters
  ): Promise<CommunityReport[]> {
    // First, get the reports without joins
    let query = supabase
      .from("reports")
      .select("*")
      .eq("is_personal", false)
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.type) {
      query = query.eq("type", filters.type);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.area && filters.area !== "all") {
      query = query.eq("location->>area", filters.area);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data: reports, error: reportsError } = await query;

    if (reportsError) {
      throw new Error(reportsError.message);
    }

    if (!reports || reports.length === 0) {
      return [];
    }

    // Get unique reporter IDs
    const reporterIds = [
      ...new Set(reports.map((r) => r.reporter_id).filter((id) => id)),
    ];

    // Fetch profiles for these reporters
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", reporterIds);

    if (profilesError) {
      console.warn("Failed to fetch profiles:", profilesError.message);
    }

    // Create profiles map
    const profilesMap = new Map();
    if (profiles) {
      profiles.forEach((profile) => {
        profilesMap.set(profile.id, profile);
      });
    }

    // Get report IDs for upvotes and timeline
    const reportIds = reports.map((r) => r.id);

    // Fetch upvotes
    const { data: upvotes, error: upvotesError } = await supabase
      .from("report_upvotes")
      .select("report_id, user_id")
      .in("report_id", reportIds);

    if (upvotesError) {
      console.warn("Failed to fetch upvotes:", upvotesError.message);
    }

    // Create upvotes map
    const upvotesMap = new Map();
    if (upvotes) {
      upvotes.forEach((upvote) => {
        if (!upvotesMap.has(upvote.report_id)) {
          upvotesMap.set(upvote.report_id, []);
        }
        upvotesMap.get(upvote.report_id).push(upvote);
      });
    }

    // Fetch timeline
    const { data: timeline, error: timelineError } = await supabase
      .from("report_timeline")
      .select("*")
      .in("report_id", reportIds)
      .order("created_at", { ascending: true });

    if (timelineError) {
      console.warn("Failed to fetch timeline:", timelineError.message);
    }

    // Create timeline map
    const timelineMap = new Map();
    if (timeline) {
      timeline.forEach((entry) => {
        if (!timelineMap.has(entry.report_id)) {
          timelineMap.set(entry.report_id, []);
        }
        timelineMap.get(entry.report_id).push(entry);
      });
    }

    // Transform data to match our interface
    return reports.map((report) => {
      const profile = profilesMap.get(report.reporter_id);
      const reportUpvotes = upvotesMap.get(report.id) || [];
      const reportTimeline = timelineMap.get(report.id) || [];

      return {
        ...report,
        reporter: profile
          ? {
              name: profile.username || "Anonymous",
              avatar: profile.avatar_url,
            }
          : { name: "Anonymous", avatar: undefined },
        upvotes: reportUpvotes.length,
        hasUserUpvoted: false, // We'll check this separately if needed
        timeline: reportTimeline,
      };
    });
  }

  static async createCommunityReport(
    reportData: CreateReportData
  ): Promise<CommunityReport> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    // Upload image if provided
    let imageUrl = null;
    if (reportData.imageUri) {
      imageUrl = await this.uploadImage(reportData.imageUri);
    }

    const { data, error } = await supabase
      .from("reports")
      .insert({
        title: reportData.title,
        description: reportData.description,
        type: reportData.type,
        image_url: imageUrl,
        location: reportData.location,
        is_anonymous: reportData.isAnonymous || false,
        is_personal: false,
        reporter_id: user.id,
        status: "submitted",
      })
      .select(
        `
        *,
        profiles:reporter_id (
          username,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Create initial timeline entry
    await supabase.from("report_timeline").insert({
      report_id: data.id,
      status: "submitted",
      description: reportData.isAnonymous
        ? "Report submitted anonymously"
        : "Report submitted by user",
    });

    return {
      ...data,
      reporter: data.profiles
        ? {
            name: data.profiles.username,
            avatar: data.profiles.avatar_url,
          }
        : { name: "Anonymous", avatar: undefined },
      upvotes: 0,
      hasUserUpvoted: false,
      timeline: [],
    };
  }

  static async upvoteReport(
    id: string
  ): Promise<{ upvotes: number; hasUserUpvoted: boolean }> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    // Check if user already upvoted
    const { data: existingUpvote, error: checkError } = await supabase
      .from("report_upvotes")
      .select("*")
      .eq("report_id", id)
      .eq("user_id", user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw new Error(checkError.message);
    }

    if (existingUpvote) {
      // Remove upvote
      const { error: deleteError } = await supabase
        .from("report_upvotes")
        .delete()
        .eq("report_id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }
    } else {
      // Add upvote
      const { error: insertError } = await supabase
        .from("report_upvotes")
        .insert({
          report_id: id,
          user_id: user.id,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    // Get updated upvote count
    const { count, error: countError } = await supabase
      .from("report_upvotes")
      .select("*", { count: "exact", head: true })
      .eq("report_id", id);

    if (countError) {
      throw new Error(countError.message);
    }

    return {
      upvotes: count || 0,
      hasUserUpvoted: !existingUpvote,
    };
  }

  static async searchReports(
    query: string,
    filters?: ReportFilters
  ): Promise<CommunityReport[]> {
    // For now, we'll filter client-side. For better performance, implement server-side search
    const reports = await this.getCommunityReports(filters);
    return reports.filter(
      (report) =>
        report.title.toLowerCase().includes(query.toLowerCase()) ||
        report.description.toLowerCase().includes(query.toLowerCase()) ||
        report.location?.address?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // File Upload
  // File Upload
  static async uploadImage(imageUri: string): Promise<string> {
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64", // ✅ use string literal, not EncodingType
      });

      const fileName = `report_${Date.now()}.jpg`;

      // Convert base64 -> byte array
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("report-images")
        .upload(fileName, byteArray, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("report-images").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  }
}
