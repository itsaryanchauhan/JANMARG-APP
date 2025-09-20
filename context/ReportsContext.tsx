import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'pothole' | 'broken-streetlight' | 'garbage' | 'overgrown-weed';
  imageUri?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: string;
  status: 'submitted' | 'in-progress' | 'resolved';
}

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  const addReport = (reportData: Omit<Report, 'id' | 'timestamp' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'submitted',
    };
    setReports(prev => [newReport, ...prev]);
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
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}