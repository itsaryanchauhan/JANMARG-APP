import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Report {
  id: string;
  title: string;
  description: string;
  type: "pothole" | "broken-streetlight" | "garbage" | "overgrown-weed";
  imageUri?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    fullAddress?: any;
  };
  timestamp: string;
  status: "submitted" | "in-progress" | "resolved";
  isAnonymous?: boolean;
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

interface ReportsContextType {
  reports: Report[];
  addReport: (
    report: Omit<Report, "id" | "timestamp" | "status" | "timeline"> & {
      isAnonymous?: boolean;
    }
  ) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  const addReport = (
    reportData: Omit<Report, "id" | "timestamp" | "status" | "timeline"> & {
      isAnonymous?: boolean;
    }
  ) => {
    const reportId = Date.now().toString();
    const timestamp = new Date().toISOString();

    const newReport: Report = {
      ...reportData,
      id: reportId,
      timestamp,
      status: "submitted",
      timeline: [
        {
          id: `${reportId}-1`,
          status: "submitted",
          timestamp,
          description:
            "Report submitted by " +
            (reportData.isAnonymous ? "anonymous user" : "user"),
        },
      ],
    };
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
