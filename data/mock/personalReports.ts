import { Report } from "../../context/ReportsContext";

// Mock personal reports based on the JSON data from message.txt
export const mockPersonalReports: Report[] = [
  {
    id: "cm3k2j9d40001abc123def456",
    title: "Broken Streetlight on Main Road",
    description:
      "The streetlight near the bus stop on Main Road has been flickering for weeks and finally went out completely. This creates a safety hazard for pedestrians, especially during evening hours.",
    type: "broken-streetlight",
    imageUri: "/placeholder.svg",
    location: {
      latitude: 28.6139,
      longitude: 77.209,
      address: "Main Road, Near Bus Stop, Central Ward, New Delhi",
    },
    timestamp: "2024-03-15T10:30:00Z",
    status: "submitted",
    isAnonymous: false,
    timeline: [
      {
        id: "timeline001",
        status: "submitted",
        timestamp: "2024-03-15T10:30:00Z",
        description: "Report submitted by you",
        assignedTo: undefined,
      },
    ],
  },
  {
    id: "cm3k2j9d40003abc123def458",
    title: "Garbage Collection Missed for 3 Days",
    description:
      "Garbage collection has been skipped for the past 3 days in Sector 15. The bins are overflowing and creating unhygienic conditions in the residential area.",
    type: "garbage",
    imageUri: "/placeholder.svg",
    location: {
      latitude: 28.4089,
      longitude: 77.0434,
      address: "Sector 15, Residential Area, Gurgaon",
    },
    timestamp: "2024-03-12T08:45:00Z",
    status: "in-progress",
    isAnonymous: true,
    timeline: [
      {
        id: "timeline003a",
        status: "submitted",
        timestamp: "2024-03-12T08:45:00Z",
        description: "Report submitted anonymously",
        assignedTo: undefined,
      },
      {
        id: "timeline003b",
        status: "acknowledged",
        timestamp: "2024-03-14T16:30:00Z",
        description: "Report validated by Municipal Corporation",
        assignedTo: undefined,
      },
      {
        id: "timeline003c",
        status: "assigned",
        timestamp: "2024-03-15T10:00:00Z",
        description: "Assigned to waste management team",
        assignedTo: "Municipal Corporation",
      },
      {
        id: "timeline003d",
        status: "in-progress",
        timestamp: "2024-03-16T09:30:00Z",
        description: "Collection schedule updated",
        assignedTo: "Municipal Corporation",
      },
    ],
  },
  {
    id: "cm3k2j9d40006abc123def461",
    title: "Public Park Maintenance Required",
    description:
      "The public park needs urgent attention - broken swings, damaged benches, overgrown grass, and non-functional drinking water fountain. Children's safety is a concern.",
    type: "overgrown-weed",
    imageUri: "/placeholder.svg",
    location: {
      latitude: 28.6508,
      longitude: 77.3152,
      address: "Green Valley Public Park, East Delhi",
    },
    timestamp: "2024-03-08T16:20:00Z",
    status: "submitted",
    isAnonymous: false,
    timeline: [
      {
        id: "timeline006a",
        status: "submitted",
        timestamp: "2024-03-08T16:20:00Z",
        description: "Report submitted by you",
        assignedTo: undefined,
      },
      {
        id: "timeline006b",
        status: "acknowledged",
        timestamp: "2024-03-10T11:30:00Z",
        description: "Report acknowledged by Horticulture Department",
        assignedTo: undefined,
      },
    ],
  },
  {
    id: "cm3k2j9d40009abc123def464",
    title: "Power Outage in Market Area",
    description:
      "Frequent power cuts in the main market area affecting businesses. Outages lasting 4-6 hours daily for the past week, causing significant economic loss to shop owners.",
    type: "broken-streetlight",
    imageUri: "/placeholder.svg",
    location: {
      latitude: 28.5244,
      longitude: 77.2066,
      address: "Main Market Area, South Delhi",
    },
    timestamp: "2024-03-05T12:00:00Z",
    status: "resolved",
    isAnonymous: false,
    timeline: [
      {
        id: "timeline009a",
        status: "submitted",
        timestamp: "2024-03-05T12:00:00Z",
        description: "Report submitted by you",
        assignedTo: undefined,
      },
      {
        id: "timeline009b",
        status: "acknowledged",
        timestamp: "2024-03-06T09:30:00Z",
        description: "Report acknowledged by Delhi Electricity Board",
        assignedTo: undefined,
      },
      {
        id: "timeline009c",
        status: "assigned",
        timestamp: "2024-03-07T14:00:00Z",
        description: "Assigned to electrical maintenance team",
        assignedTo: "Delhi Electricity Board",
      },
      {
        id: "timeline009d",
        status: "in-progress",
        timestamp: "2024-03-08T10:15:00Z",
        description: "Infrastructure inspection and repairs started",
        assignedTo: "Delhi Electricity Board",
      },
      {
        id: "timeline009e",
        status: "resolved",
        timestamp: "2024-03-12T15:30:00Z",
        description: "Power supply stabilized and issue resolved",
        assignedTo: "Delhi Electricity Board",
      },
    ],
  },
  {
    id: "cm3k2j9d40010abc123def465",
    title: "Sewage Overflow in Residential Street",
    description:
      "Sewage is overflowing from manholes onto the street creating unhygienic conditions and foul odor. The situation worsens during rain and poses health risks to residents.",
    type: "garbage",
    imageUri: "/placeholder.svg",
    location: {
      latitude: 28.65,
      longitude: 77.23,
      address: "Lane 3, Old City Area, Old Delhi",
    },
    timestamp: "2024-03-09T10:45:00Z",
    status: "submitted",
    isAnonymous: true,
    timeline: [
      {
        id: "timeline010a",
        status: "submitted",
        timestamp: "2024-03-09T10:45:00Z",
        description: "Report submitted anonymously",
        assignedTo: undefined,
      },
    ],
  },
  // Additional personal reports
  {
    id: "cm3k2j9d40021abc123def476",
    title: "Street Dog Vaccination Drive Needed",
    description:
      "Community needs organized street dog vaccination and sterilization drive. Many unvaccinated dogs in the area pose health risks to residents.",
    type: "garbage", // Using for community health issues
    imageUri: "/placeholder.svg",
    location: {
      latitude: 28.5355,
      longitude: 77.2507,
      address: "Park View Ward Residential Area, South Delhi",
    },
    timestamp: "2024-03-07T09:30:00Z",
    status: "submitted",
    isAnonymous: false,
    timeline: [
      {
        id: "timeline021a",
        status: "submitted",
        timestamp: "2024-03-07T09:30:00Z",
        description: "Report submitted by you",
        assignedTo: undefined,
      },
    ],
  },
  {
    id: "cm3k2j9d40022abc123def477",
    title: "Bus Stop Shelter Damaged",
    description:
      "Bus stop shelter near my home has broken roof and seating. Commuters have no protection from sun and rain while waiting for buses.",
    type: "broken-streetlight", // Using for infrastructure
    imageUri: "/placeholder.svg",
    location: {
      latitude: 28.6139,
      longitude: 77.209,
      address: "Central Ward Bus Stop, New Delhi",
    },
    timestamp: "2024-03-04T16:15:00Z",
    status: "in-progress",
    isAnonymous: true,
    timeline: [
      {
        id: "timeline022a",
        status: "submitted",
        timestamp: "2024-03-04T16:15:00Z",
        description: "Report submitted anonymously",
        assignedTo: undefined,
      },
      {
        id: "timeline022b",
        status: "acknowledged",
        timestamp: "2024-03-06T11:00:00Z",
        description: "Report acknowledged by transport authority",
        assignedTo: undefined,
      },
      {
        id: "timeline022c",
        status: "assigned",
        timestamp: "2024-03-08T14:30:00Z",
        description: "Assigned to infrastructure team",
        assignedTo: "Delhi Transport Corporation",
      },
    ],
  },
];
