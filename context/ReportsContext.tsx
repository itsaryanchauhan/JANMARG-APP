import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ReportsService } from "../services/reportsService";
import { isAuthenticated } from "../services/supabase";
import { PersonalReport } from "../types/api";
import { logger } from "../utils/logger";

// Use the shared type instead of local interface
export type Report = PersonalReport;

interface ReportsContextType {
  reports: Report[];
  addReport: (
    report: Omit<Report, "id" | "timestamp" | "status" | "timeline"> & {
      isAnonymous?: boolean;
    }
  ) => Promise<void>; // Made async for API calls
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  logger.info("ReportsProvider initialized");

  // Load reports on mount
  useEffect(() => {
    const loadReports = async () => {
      const isUserAuthenticated = await isAuthenticated();
      if (isUserAuthenticated) {
        refreshReports();
      } else {
        logger.info("User not authenticated, skipping reports load");
      }
    };
    loadReports();
  }, []);

  const refreshReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiReports = await ReportsService.getPersonalReports();
      setReports(apiReports);
      logger.info("Reports refreshed from API", { count: apiReports.length });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load reports";
      setError(errorMessage);
      logger.error("Failed to refresh reports", err);
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (
    reportData: Omit<Report, "id" | "timestamp" | "status" | "timeline"> & {
      isAnonymous?: boolean;
    }
  ) => {
    try {
      logger.info("Adding report via API", {
        type: reportData.type,
        isAnonymous: reportData.isAnonymous,
      });
      const newReport = await ReportsService.createPersonalReport(reportData);
      setReports((prev) => [newReport, ...prev]);
      logger.info("Report added successfully via API", {
        newReportId: newReport.id,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add report";
      setError(errorMessage);
      logger.error("Failed to add report", err);
      throw err; // Re-throw so components can handle it
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        addReport,
        loading,
        error,
        refreshReports,
      }}
    >
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
