import { Stack } from "expo-router";
import { CommunityReportsProvider } from "../context/CommunityReportsContext";
import { ReportsProvider } from "../context/ReportsContext";

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
