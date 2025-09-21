import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReportDetailModal from "../components/ReportDetailModal";
import { useLanguage } from "../context/LanguageContext";
import { Report, useReports } from "../context/ReportsContext";

export default function MyReportsScreen() {
  const { reports } = useReports();
  const { t } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Sort reports: submitted -> in-progress -> resolved
  const sortedReports = [...reports].sort((a, b) => {
    const statusOrder = { submitted: 0, "in-progress": 1, resolved: 2 };
    const orderA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
    const orderB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // If same status, sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Filter reports based on selected status
  const filteredReports =
    statusFilter === "all"
      ? sortedReports
      : sortedReports.filter((report) => report.status === statusFilter);

  const handleReportPress = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  // Convert Report to CommunityReport for modal compatibility
  const convertToCommunityReport = (report: Report) => {
    return {
      ...report,
      location: {
        latitude: report.location?.latitude || 0,
        longitude: report.location?.longitude || 0,
        address: report.location?.address || "Unknown Address",
        area: "My Area",
      },
      reporter: {
        name: report.isAnonymous ? "Anonymous" : "You",
        avatar: undefined,
      },
      upvotes: 0,
      hasUserUpvoted: false,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "#5C9479";
      case "in-progress":
        return "#2E6A56";
      case "resolved":
        return "#2E6A56";
      default:
        return "#6b7280";
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case "pothole":
        return "car-outline";
      case "broken-streetlight":
        return "bulb-outline";
      case "garbage":
        return "trash-outline";
      case "overgrown-weed":
        return "leaf-outline";
      default:
        return "alert-circle-outline";
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={32} color="#2E6A56" />
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>
          Track your submitted reports and their status
        </Text>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first report using the button below
          </Text>
        </View>
      ) : (
        <>
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === "all" && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter("all")}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === "all" && styles.filterTextActive,
                ]}
              >
                All ({reports.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === "submitted" && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter("submitted")}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === "submitted" && styles.filterTextActive,
                ]}
              >
                Submitted (
                {reports.filter((r) => r.status === "submitted").length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === "in-progress" && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter("in-progress")}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === "in-progress" && styles.filterTextActive,
                ]}
              >
                In Progress (
                {reports.filter((r) => r.status === "in-progress").length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === "resolved" && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter("resolved")}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === "resolved" && styles.filterTextActive,
                ]}
              >
                Resolved (
                {reports.filter((r) => r.status === "resolved").length})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reports.length}</Text>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {reports.filter((r) => r.status === "submitted").length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {reports.filter((r) => r.status === "resolved").length}
              </Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>

          {filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => handleReportPress(report)}
            >
              <View style={styles.reportHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getStatusColor(report.status) + "20" },
                  ]}
                >
                  <Ionicons
                    name={getIssueTypeIcon(report.type) as any}
                    size={24}
                    color={getStatusColor(report.status)}
                  />
                </View>
                <View style={styles.reportContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                  </View>
                  <View style={styles.statusAndAnonymousRow}>
                    {report.isAnonymous && (
                      <View style={styles.anonymousTag}>
                        <Text style={styles.anonymousText}>
                          {t("anonymous")}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.reportTime}>
                    {formatDate(report.timestamp)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(report.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1).replace("-", " ")}
                    </Text>
                  </View>
                </View>
                {(report.imageSource || report.imageUri) && (
                  <Image
                    source={report.imageSource || { uri: report.imageUri }}
                    style={styles.reportImage}
                  />
                )}
              </View>
              <Text style={styles.reportDescription} numberOfLines={2}>
                {report.description}
              </Text>
              {report.location && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color="#666" />
                  <Text style={styles.locationText}>
                    {report.location.address ||
                      `${report.location.latitude.toFixed(
                        4
                      )}, ${report.location.longitude.toFixed(4)}`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Report Detail Modal */}
      <ReportDetailModal
        visible={showReportDetail}
        report={
          selectedReport ? convertToCommunityReport(selectedReport) : null
        }
        onClose={() => setShowReportDetail(false)}
        onUpvote={() => {}} // No upvote functionality for own reports
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  content: {
    padding: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#999",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    ...(Platform.OS === "android" && {
      backgroundColor: "#FFFFFF",
      borderWidth: 0.5,
      borderColor: "#f0f0f0",
    }),
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 10,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    ...(Platform.OS === "android" && {
      backgroundColor: "#FFFFFF",
      borderWidth: 0.5,
      borderColor: "#f0f0f0",
    }),
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 4,
  },
  reportTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  reportImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  reportDescription: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  anonymousTag: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  anonymousText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    ...(Platform.OS === "android" && {
      backgroundColor: "#FFFFFF",
      borderWidth: 0.5,
      borderColor: "#f0f0f0",
    }),
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#2E6A56",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  reportIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  reportIdLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "600",
    marginRight: 4,
  },
  reportIdText: {
    fontSize: 10,
    color: "#2E6A56",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  statusAndAnonymousRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});
