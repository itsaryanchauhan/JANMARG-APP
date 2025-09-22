import React, { createContext, ReactNode, useContext, useState } from "react";
import { mockPersonalReports } from "../data/mock/personalReports";
import { logger } from "../utils/logger";

export interface Report {
  id: string;
  title: string;
  description: string;
  type: "pothole" | "broken-streetlight" | "garbage" | "overgrown-weed";
  imageUri?: string;
  imageSource?: any;
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
  const [reports, setReports] = useState<Report[]>(mockPersonalReports);

  logger.info("ReportsProvider initialized", {
    initialReportsCount: mockPersonalReports.length,
  });

  const addReport = (
    reportData: Omit<Report, "id" | "timestamp" | "status" | "timeline"> & {
      isAnonymous?: boolean;
    }
  ) => {
    logger.info("Adding new report", {
      type: reportData.type,
      isAnonymous: reportData.isAnonymous,
    });
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
    setReports((prev) => {
      const updated = [newReport, ...prev];
      logger.info("Report added successfully", {
        newReportId: reportId,
        totalReports: updated.length,
      });
      return updated;
    });
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
