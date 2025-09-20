import { Stack } from "expo-router";
import { ReportsProvider } from "../context/ReportsContext";
import { CommunityReportsProvider } from "../context/CommunityReportsContext";

export default function RootLayout() {
  return (
    <ReportsProvider>
      <CommunityReportsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </CommunityReportsProvider>
    </ReportsProvider>
  );
}
