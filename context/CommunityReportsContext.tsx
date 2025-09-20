import React, { createContext, ReactNode, useContext, useState } from "react";
import { mockAreas, mockCommunityReports } from "../data/mock";

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  type:
    | "pothole"
    | "broken-streetlight"
    | "garbage"
    | "overgrown-weed"
    | "water-issue"
    | "infrastructure"
    | "traffic"
    | "animal-issue"
    | "encroachment"
    | "garbage-issue";
  imageUri?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    area: string;
  };
  timestamp: string;
  status: "submitted" | "in-progress" | "resolved" | "acknowledged";
  reporter: {
    name: string;
    avatar?: string;
  };
  upvotes: number;
  hasUserUpvoted: boolean;
  timeline: {
    id: string;
    status:
      | "submitted"
      | "acknowledged"
      | "assigned"
      | "in-progress"
      | "resolved";
    timestamp: string;
    description: string;
    assignedTo?: string;
  }[];
}

const areas = [
  "Central Delhi",
  "Bandra",
  "Koramangala",
  "Salt Lake",
  "Malviya Nagar",
  "Navrangpura",
  "Gachibowli",
  "Rajpur Road",
  "Civil Lines",
  "Sigra",
  "Panaji",
  "RS Puram",
];

// Helper function to generate realistic timelines based on status
const generateTimeline = (
  reportId: string,
  status: string,
  reportTimestamp: string
) => {
  const timeline = [];
  const reportTime = new Date(reportTimestamp);

  // Initial submission
  timeline.push({
    id: `${reportId}-1`,
    status: "submitted" as const,
    timestamp: reportTimestamp,
    description: "Report submitted by citizen",
  });

  if (status === "submitted") {
    return timeline;
  }

  // Acknowledgement (1-2 hours after submission)
  const ackTime = new Date(
    reportTime.getTime() + (1 + Math.random()) * 60 * 60 * 1000
  );
  timeline.push({
    id: `${reportId}-2`,
    status: "acknowledged" as const,
    timestamp: ackTime.toISOString(),
    description: "Report acknowledged by municipal authority",
  });

  // Assignment (4-8 hours after acknowledgement)
  const assignTime = new Date(
    ackTime.getTime() + (4 + Math.random() * 4) * 60 * 60 * 1000
  );
  const assignees = [
    "Public Works Dept.",
    "Road Maintenance Team",
    "Sanitation Dept.",
    "Electrical Team",
  ];
  const assignedTo = assignees[Math.floor(Math.random() * assignees.length)];

  timeline.push({
    id: `${reportId}-3`,
    status: "assigned" as const,
    timestamp: assignTime.toISOString(),
    description: `Assigned to ${assignedTo}`,
    assignedTo,
  });

  if (status === "in-progress" || status === "resolved") {
    // Work started (1-2 days after assignment)
    const workStartTime = new Date(
      assignTime.getTime() + (1 + Math.random()) * 24 * 60 * 60 * 1000
    );
    timeline.push({
      id: `${reportId}-4`,
      status: "in-progress" as const,
      timestamp: workStartTime.toISOString(),
      description: "Work started on the reported issue",
    });

    if (status === "resolved") {
      // Resolution (2-5 days after work started)
      const resolveTime = new Date(
        workStartTime.getTime() + (2 + Math.random() * 3) * 24 * 60 * 60 * 1000
      );
      timeline.push({
        id: `${reportId}-5`,
        status: "resolved" as const,
        timestamp: resolveTime.toISOString(),
        description: "Issue resolved and verified",
      });
    }
  }

  return timeline;
};

interface CommunityReportsContextType {
  reports: CommunityReport[];
  selectedArea: string;
  areas: string[];
  setSelectedArea: (area: string) => void;
  toggleUpvote: (reportId: string) => void;
  getReportsForArea: (area: string) => CommunityReport[];
  searchReports: (query: string) => CommunityReport[];
}

const CommunityReportsContext = createContext<
  CommunityReportsContextType | undefined
>(undefined);

export function CommunityReportsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [reports, setReports] =
    useState<CommunityReport[]>(mockCommunityReports);
  const [selectedArea, setSelectedArea] = useState<string>(mockAreas[0]);

  const toggleUpvote = (reportId: string) => {
    setReports((prev) =>
      prev.map((report) => {
        if (report.id === reportId) {
          return {
            ...report,
            hasUserUpvoted: !report.hasUserUpvoted,
            upvotes: report.hasUserUpvoted
              ? report.upvotes - 1
              : report.upvotes + 1,
          };
        }
        return report;
      })
    );
  };

  const getReportsForArea = (area: string) => {
    return reports.filter((report) => report.location.area === area);
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
        report.location.address.toLowerCase().includes(searchTerm) ||
        report.location.area.toLowerCase().includes(searchTerm) ||
        report.type.toLowerCase().includes(searchTerm)
    );
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
