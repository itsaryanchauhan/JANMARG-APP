// Export all mock data for easy importing
export { mockAreas, mockCommunityReports } from "./communityReports";
export { mockPersonalReports } from "./personalReports";

// You can also export combined data or utilities here if needed
export const getAllMockData = () => ({
  communityReports: require("./communityReports").mockCommunityReports,
  personalReports: require("./personalReports").mockPersonalReports,
  areas: require("./communityReports").mockAreas,
});
