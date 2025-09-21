import { Report } from "../../context/ReportsContext";

// Mock personal reports - only 2 default reports as requested
export const mockPersonalReports: Report[] = [
  {
    id: "personal_001",
    title: "Broken Streetlight on Main Road",
    description:
      "The streetlight near the bus stop on Main Road has been flickering for weeks and finally went out completely. This creates a safety hazard for pedestrians, especially during evening hours.",
    type: "broken-streetlight",
    imageSource: require("../../assets/images/mock_image/broken_streetlight.jpg"),
    location: {
      latitude: 28.6139,
      longitude: 77.209,
      address: "Main Road, Near Bus Stop, Bokaro",
    },
    timestamp: "2025-09-18T10:30:00Z",
    status: "submitted",
    isAnonymous: false,
    timeline: [
      {
        id: "timeline001",
        status: "submitted",
        timestamp: "2025-09-18T10:30:00Z",
        description: "Report submitted by you",
        assignedTo: undefined,
      },
    ],
  },
  {
    id: "personal_002",
    title: "Garbage Collection Missed for 3 Days",
    description:
      "Garbage collection has been skipped for the past 3 days in residential area. The bins are overflowing and creating unhygienic conditions.",
    type: "garbage",
    imageSource: require("../../assets/images/mock_image/broken_road.jpg"),
    location: {
      latitude: 23.7958,
      longitude: 86.1511,
      address: "Residential Area, Bokaro Steel City",
    },
    timestamp: "2025-09-15T08:45:00Z",
    status: "in-progress",
    isAnonymous: true,
    timeline: [
      {
        id: "timeline002a",
        status: "submitted",
        timestamp: "2025-09-15T08:45:00Z",
        description: "Report submitted anonymously",
        assignedTo: undefined,
      },
      {
        id: "timeline002b",
        status: "acknowledged",
        timestamp: "2025-09-16T16:30:00Z",
        description: "Report validated by Municipal Corporation",
        assignedTo: undefined,
      },
      {
        id: "timeline002c",
        status: "in-progress",
        timestamp: "2025-09-17T09:30:00Z",
        description: "Collection schedule updated",
        assignedTo: "Municipal Corporation",
      },
    ],
  },
];
