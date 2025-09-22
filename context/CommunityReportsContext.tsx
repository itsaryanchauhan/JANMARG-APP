import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { mockAreas } from "../data/mock";
import { ReportsService } from "../services/reportsService";
import { CommunityReport } from "../types/api";
import { logger } from "../utils/logger";

interface CommunityReportsContextType {
  reports: CommunityReport[];
  selectedArea: string;
  areas: string[];
  setSelectedArea: (area: string) => void;
  toggleUpvote: (reportId: string) => Promise<void>;
  getReportsForArea: (area: string) => CommunityReport[];
  searchReports: (query: string) => CommunityReport[];
  addCommunityReport: (
    report: Omit<
      CommunityReport,
      | "id"
      | "timestamp"
      | "status"
      | "timeline"
      | "upvotes"
      | "hasUserUpvoted"
      | "reporter"
    >
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
}

const CommunityReportsContext = createContext<
  CommunityReportsContextType | undefined
>(undefined);

export function CommunityReportsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>(mockAreas[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  logger.info("CommunityReportsProvider initialized");

  // Load reports on mount - community reports don't require authentication
  useEffect(() => {
    refreshReports();
  }, []);

  const refreshReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiReports = await ReportsService.getCommunityReports();
      setReports(apiReports);
      logger.info("Community reports refreshed from API", {
        count: apiReports.length,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load community reports";
      setError(errorMessage);
      logger.error("Failed to refresh community reports", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUpvote = async (reportId: string) => {
    try {
      const result = await ReportsService.upvoteReport(reportId);
      setReports((prev) =>
        prev.map((report) => {
          if (report.id === reportId) {
            return {
              ...report,
              hasUserUpvoted: result.hasUserUpvoted,
              upvotes: result.upvotes,
            };
          }
          return report;
        })
      );
      logger.info("Upvote toggled", {
        reportId,
        hasUserUpvoted: result.hasUserUpvoted,
        upvotes: result.upvotes,
      });
    } catch (err) {
      logger.error("Failed to toggle upvote", err);
      throw err;
    }
  };

  const getReportsForArea = (area: string) => {
    return reports.filter((report) => report.location?.area === area);
  };

  const searchReports = (query: string) => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return reports.filter(
      (report) =>
        report.id.toLowerCase().includes(searchTerm) ||
        report.title.toLowerCase().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm) ||
        report.reporter.name.toLowerCase().includes(searchTerm) ||
        report.location?.address?.toLowerCase().includes(searchTerm) ||
        report.location?.area?.toLowerCase().includes(searchTerm) ||
        report.type.toLowerCase().includes(searchTerm)
    );
  };

  const addCommunityReport = async (
    reportData: Omit<
      CommunityReport,
      | "id"
      | "timestamp"
      | "status"
      | "timeline"
      | "upvotes"
      | "hasUserUpvoted"
      | "reporter"
    >
  ) => {
    try {
      logger.info("Adding community report", {
        type: reportData.type,
        area: reportData.location?.area,
      });
      const newReport = await ReportsService.createCommunityReport(reportData);
      setReports((prev) => [newReport, ...prev]);
      logger.info("Community report added successfully", {
        reportId: newReport.id,
      });
    } catch (err) {
      logger.error("Failed to add community report", err);
      throw err;
    }
  };

  return (
    <CommunityReportsContext.Provider
      value={{
        reports,
        selectedArea,
        areas: mockAreas,
        setSelectedArea,
        toggleUpvote,
        getReportsForArea,
        searchReports,
        addCommunityReport,
        loading,
        error,
        refreshReports,
      }}
    >
      {children}
    </CommunityReportsContext.Provider>
  );
}

export function useCommunityReports() {
  const context = useContext(CommunityReportsContext);
  if (context === undefined) {
    throw new Error(
      "useCommunityReports must be used within a CommunityReportsProvider"
    );
  }
  return context;
}
