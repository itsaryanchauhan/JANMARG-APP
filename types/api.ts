// Shared types for API and app-wide usage
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  area?: string;
  fullAddress?: any;
}

export interface TimelineEntry {
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
  department?: string;
}

export interface ReportBase {
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
  imageSource?: any;
  location?: Location;
  timestamp: string;
  status: "submitted" | "in-progress" | "resolved" | "acknowledged";
  timeline: TimelineEntry[];
}

export interface PersonalReport extends ReportBase {
  isAnonymous?: boolean;
}

export interface CommunityReport extends ReportBase {
  reporter: {
    name: string;
    avatar?: string;
  };
  upvotes: number;
  hasUserUpvoted: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
