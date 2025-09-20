import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  type: 'pothole' | 'broken-streetlight' | 'garbage' | 'overgrown-weed';
  imageUri?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    area: string;
  };
  timestamp: string;
  status: 'submitted' | 'in-progress' | 'resolved';
  reporter: {
    name: string;
    avatar?: string;
  };
  upvotes: number;
  hasUserUpvoted: boolean;
  timeline: {
    id: string;
    status: 'submitted' | 'acknowledged' | 'assigned' | 'in-progress' | 'resolved';
    timestamp: string;
    description: string;
    assignedTo?: string;
  }[];
}

const areas = [
  'Central Delhi',
  'Bandra',
  'Koramangala',
  'Salt Lake',
  'Malviya Nagar',
  'Navrangpura',
  'Gachibowli',
  'Rajpur Road',
  'Civil Lines',
  'Sigra',
  'Panaji',
  'RS Puram'
];

// Helper function to generate realistic timelines based on status
const generateTimeline = (reportId: string, status: string, reportTimestamp: string) => {
  const timeline = [];
  const reportTime = new Date(reportTimestamp);
  
  // Initial submission
  timeline.push({
    id: `${reportId}-1`,
    status: 'submitted' as const,
    timestamp: reportTimestamp,
    description: 'Report submitted by citizen',
  });

  if (status === 'submitted') {
    return timeline;
  }

  // Acknowledgement (1-2 hours after submission)
  const ackTime = new Date(reportTime.getTime() + (1 + Math.random()) * 60 * 60 * 1000);
  timeline.push({
    id: `${reportId}-2`,
    status: 'acknowledged' as const,
    timestamp: ackTime.toISOString(),
    description: 'Report acknowledged by municipal authority',
  });

  // Assignment (4-8 hours after acknowledgement)
  const assignTime = new Date(ackTime.getTime() + (4 + Math.random() * 4) * 60 * 60 * 1000);
  const assignees = ['Public Works Dept.', 'Road Maintenance Team', 'Sanitation Dept.', 'Electrical Team'];
  const assignedTo = assignees[Math.floor(Math.random() * assignees.length)];
  
  timeline.push({
    id: `${reportId}-3`,
    status: 'assigned' as const,
    timestamp: assignTime.toISOString(),
    description: `Assigned to ${assignedTo}`,
    assignedTo,
  });

  if (status === 'in-progress' || status === 'resolved') {
    // Work started (1-2 days after assignment)
    const workStartTime = new Date(assignTime.getTime() + (1 + Math.random()) * 24 * 60 * 60 * 1000);
    timeline.push({
      id: `${reportId}-4`,
      status: 'in-progress' as const,
      timestamp: workStartTime.toISOString(),
      description: 'Work started on the reported issue',
    });

    if (status === 'resolved') {
      // Resolution (2-5 days after work started)
      const resolveTime = new Date(workStartTime.getTime() + (2 + Math.random() * 3) * 24 * 60 * 60 * 1000);
      timeline.push({
        id: `${reportId}-5`,
        status: 'resolved' as const,
        timestamp: resolveTime.toISOString(),
        description: 'Issue resolved and verified',
      });
    }
  }

  return timeline;
};

// Mock data for community reports
const mockReports: CommunityReport[] = [
  {
    id: 'CR001',
    title: 'Large pothole blocking traffic near CP',
    description: 'There is a massive pothole on the main road near Connaught Place causing severe traffic jams. Several vehicles have already damaged their tires and it\'s getting worse with the recent rains.',
    type: 'pothole',
    imageUri: undefined,
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Connaught Place, New Delhi',
      area: 'Central Delhi'
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'submitted',
    reporter: {
      name: 'Arjun Sharma',
    },
    upvotes: 24,
    hasUserUpvoted: false,
    timeline: generateTimeline('CR001', 'submitted', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR002',
    title: 'Streetlight not working near Bandra station',
    description: 'The streetlight at the corner near Bandra railway station has been out for over a week. This area is very dark at night and poses safety risks for commuters and pedestrians.',
    type: 'broken-streetlight',
    imageUri: undefined,
    location: {
      latitude: 19.0544,
      longitude: 72.8406,
      address: 'Bandra West, Mumbai',
      area: 'Bandra'
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    status: 'in-progress',
    reporter: {
      name: 'Priya Patel',
    },
    upvotes: 12,
    hasUserUpvoted: true,
    timeline: generateTimeline('CR002', 'in-progress', new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR003',
    title: 'Garbage overflowing near tech park',
    description: 'The garbage bins near Koramangala tech park are overflowing and attracting stray dogs. Waste is scattered around making it unsightly and creating health concerns for office workers.',
    type: 'garbage',
    imageUri: undefined,
    location: {
      latitude: 12.9279,
      longitude: 77.6271,
      address: 'Koramangala, Bangalore',
      area: 'Koramangala'
    },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    status: 'resolved',
    reporter: {
      name: 'Ravi Kumar',
    },
    upvotes: 18,
    hasUserUpvoted: false,
    timeline: generateTimeline('CR003', 'resolved', new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR004',
    title: 'Wild grass blocking Salt Lake footpath',
    description: 'Weeds and wild grass have grown over the footpath in Salt Lake, making it difficult for pedestrians to walk safely. People are forced to walk on the busy road to avoid it.',
    type: 'overgrown-weed',
    imageUri: undefined,
    location: {
      latitude: 22.5726,
      longitude: 88.3639,
      address: 'Salt Lake, Kolkata',
      area: 'Salt Lake'
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    status: 'submitted',
    reporter: {
      name: 'Ananya Banerjee',
    },
    upvotes: 8,
    hasUserUpvoted: true,
    timeline: generateTimeline('CR004', 'submitted', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR005',
    title: 'Deep pothole near school in Malviya Nagar',
    description: 'A dangerous pothole has formed right near the school entrance in Malviya Nagar. Children and parents are having difficulty navigating around it safely.',
    type: 'pothole',
    imageUri: undefined,
    location: {
      latitude: 26.8467,
      longitude: 75.7873,
      address: 'Malviya Nagar, Jaipur',
      area: 'Malviya Nagar'
    },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'in-progress',
    reporter: {
      name: 'Vikram Singh',
    },
    upvotes: 31,
    hasUserUpvoted: false,
    timeline: generateTimeline('CR005', 'in-progress', new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR006',
    title: 'Multiple streetlights out in Navrangpura',
    description: 'Five consecutive streetlights are not working on the main road in Navrangpura. Local shopkeepers are concerned about security and customers avoid the area after dark.',
    type: 'broken-streetlight',
    imageUri: undefined,
    location: {
      latitude: 23.0225,
      longitude: 72.5714,
      address: 'Navrangpura, Ahmedabad',
      area: 'Navrangpura'
    },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'submitted',
    reporter: {
      name: 'Meera Shah',
    },
    upvotes: 15,
    hasUserUpvoted: true,
    timeline: generateTimeline('CR006', 'submitted', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR007',
    title: 'Illegal garbage dumping in Gachibowli',
    description: 'Construction waste and household garbage has been illegally dumped in the residential area. It\'s attracting rats and creating unhygienic conditions for families.',
    type: 'garbage',
    imageUri: undefined,
    location: {
      latitude: 17.3850,
      longitude: 78.4867,
      address: 'Gachibowli, Hyderabad',
      area: 'Gachibowli'
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'resolved',
    reporter: {
      name: 'Suresh Reddy',
    },
    upvotes: 22,
    hasUserUpvoted: false,
    timeline: generateTimeline('CR007', 'resolved', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR008',
    title: 'Thorny bushes blocking cycle track',
    description: 'Wild thorny bushes have grown across the dedicated cycle track on Rajpur Road. Cyclists are getting injured and many have stopped using this route.',
    type: 'overgrown-weed',
    imageUri: undefined,
    location: {
      latitude: 30.3165,
      longitude: 78.0322,
      address: 'Rajpur Road, Dehradun',
      area: 'Rajpur Road'
    },
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    status: 'submitted',
    reporter: {
      name: 'Kavita Negi',
    },
    upvotes: 9,
    hasUserUpvoted: true,
    timeline: generateTimeline('CR008', 'submitted', new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR009',
    title: 'Massive crater on Civil Lines road',
    description: 'A huge pothole has formed on the service road that looks more like a crater. Small vehicles can get stuck and it needs emergency repairs immediately.',
    type: 'pothole',
    imageUri: undefined,
    location: {
      latitude: 21.1458,
      longitude: 79.0882,
      address: 'Civil Lines, Nagpur',
      area: 'Civil Lines'
    },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'in-progress',
    reporter: {
      name: 'Rahul Deshmukh',
    },
    upvotes: 45,
    hasUserUpvoted: false,
    timeline: generateTimeline('CR009', 'in-progress', new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR010',
    title: 'Park streetlights creating safety concern',
    description: 'All streetlights in the community park in Sigra have stopped working. Women and children don\'t feel safe using the park in the evening anymore.',
    type: 'broken-streetlight',
    imageUri: undefined,
    location: {
      latitude: 25.3176,
      longitude: 82.9739,
      address: 'Sigra, Varanasi',
      area: 'Sigra'
    },
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    status: 'submitted',
    reporter: {
      name: 'Deepika Gupta',
    },
    upvotes: 28,
    hasUserUpvoted: true,
    timeline: generateTimeline('CR010', 'submitted', new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR011',
    title: 'Medical waste dumped near hospital',
    description: 'Hazardous medical waste has been improperly dumped behind the government hospital in Panaji. This poses serious health risks to the community.',
    type: 'garbage',
    imageUri: undefined,
    location: {
      latitude: 15.2993,
      longitude: 74.1240,
      address: 'Panaji, Goa',
      area: 'Panaji'
    },
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: 'in-progress',
    reporter: {
      name: 'Dr. Amit Rane',
    },
    upvotes: 67,
    hasUserUpvoted: false,
    timeline: generateTimeline('CR011', 'in-progress', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  },
  {
    id: 'CR012',
    title: 'Invasive plants damaging building walls',
    description: 'Fast-growing invasive weeds are damaging apartment building walls in RS Puram. The roots are causing cracks and threatening structural integrity.',
    type: 'overgrown-weed',
    imageUri: undefined,
    location: {
      latitude: 11.0168,
      longitude: 76.9558,
      address: 'RS Puram, Coimbatore',
      area: 'RS Puram'
    },
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    status: 'resolved',
    reporter: {
      name: 'Lakshmi Iyer',
    },
    upvotes: 14,
    hasUserUpvoted: true,
    timeline: generateTimeline('CR012', 'resolved', new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()),
  },
];

interface CommunityReportsContextType {
  reports: CommunityReport[];
  selectedArea: string;
  areas: string[];
  setSelectedArea: (area: string) => void;
  toggleUpvote: (reportId: string) => void;
  getReportsForArea: (area: string) => CommunityReport[];
  searchReports: (query: string) => CommunityReport[];
}

const CommunityReportsContext = createContext<CommunityReportsContextType | undefined>(undefined);

export function CommunityReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<CommunityReport[]>(mockReports);
  const [selectedArea, setSelectedArea] = useState<string>('Central Delhi');

  const toggleUpvote = (reportId: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          hasUserUpvoted: !report.hasUserUpvoted,
          upvotes: report.hasUserUpvoted ? report.upvotes - 1 : report.upvotes + 1
        };
      }
      return report;
    }));
  };

  const getReportsForArea = (area: string) => {
    return reports.filter(report => report.location.area === area);
  };

  const searchReports = (query: string) => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return reports.filter(report => 
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
    <CommunityReportsContext.Provider value={{
      reports,
      selectedArea,
      areas,
      setSelectedArea,
      toggleUpvote,
      getReportsForArea,
      searchReports,
    }}>
      {children}
    </CommunityReportsContext.Provider>
  );
}

export function useCommunityReports() {
  const context = useContext(CommunityReportsContext);
  if (context === undefined) {
    throw new Error('useCommunityReports must be used within a CommunityReportsProvider');
  }
  return context;
}