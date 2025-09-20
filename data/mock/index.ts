// Export all mock data for easy importing
import { mockAreas as areas, mockCommunityReports as communityReports } from "./communityReports.js";
import { mockPersonalReports as personalReports } from "./personalReports.js";

export const mockAreas = areas;
export const mockCommunityReports = communityReports;
export const mockPersonalReports = personalReports;

// You can also export combined data or utilities here if needed
export const getAllMockData = () => ({
  communityReports: require("./communityReports").mockCommunityReports,
  personalReports: require("./personalReports").mockPersonalReports,
  areas: require("./communityReports").mockAreas,
});
