import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CommunityReport } from "../context/CommunityReportsContext";
import ReportMapView from "./ReportMapView";

interface ReportDetailModalProps {
  visible: boolean;
  report: CommunityReport | null;
  onClose: () => void;
  onUpvote: (reportId: string) => void;
}

export default function ReportDetailModal({
  visible,
  report,
  onClose,
  onUpvote,
}: ReportDetailModalProps) {
  if (!report) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "#5C9479";
      case "acknowledged":
        return "#17a2b8";
      case "assigned":
        return "#6f42c1";
      case "in-progress":
        return "#2E6A56";
      case "resolved":
        return "#2E6A56";
      default:
        return "#4A4A4A";
    }
  };

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return "document-text";
      case "acknowledged":
        return "checkmark-circle";
      case "assigned":
        return "person";
      case "in-progress":
        return "time";
      case "resolved":
        return "checkmark-done";
      default:
        return "help-circle";
    }
  };

  const getTimelineLabel = (status: string) => {
    switch (status) {
      case "submitted":
        return "Report Submitted";
      case "acknowledged":
        return "Acknowledged by Authority";
      case "assigned":
        return "Assigned to Department";
      case "in-progress":
        return "Work in Progress";
      case "resolved":
        return "Issue Resolved";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatTimelineDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#4A4A4A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Report Header */}
          <View style={styles.reportHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getStatusColor(report.status) + "20" },
              ]}
            >
              <Ionicons
                name={getIssueTypeIcon(report.type) as any}
                size={32}
                color={getStatusColor(report.status)}
              />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportIdText}>ID: {report.id}</Text>
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
          </View>

          {/* Reporter Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reported By</Text>
            <View style={styles.reporterContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#666" />
              </View>
              <View style={styles.reporterInfo}>
                <Text style={styles.reporterName}>{report.reporter.name}</Text>
                <Text style={styles.reportTime}>
                  {formatDate(report.timestamp)}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{report.description}</Text>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color="#2E6A56" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationAddress}>
                  {report.location.address}
                </Text>
                <Text style={styles.locationArea}>{report.location.area}</Text>
                <Text style={styles.coordinates}>
                  {report.location.latitude.toFixed(6)},{" "}
                  {report.location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            {/* Map View */}
            <ReportMapView
              location={report.location}
              title={report.title}
              style={styles.mapContainer}
            />
          </View>

          {/* Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Timeline</Text>
            <View style={styles.timelineContainer}>
              {report.timeline.map((entry, index) => {
                const isLast = index === report.timeline.length - 1;
                const isCurrent = entry.status === report.status;

                return (
                  <View key={entry.status} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineIcon,
                          isCurrent && styles.timelineIconCurrent,
                          entry.timestamp && styles.timelineIconCompleted,
                        ]}
                      >
                        <Ionicons
                          name={getTimelineIcon(entry.status)}
                          size={16}
                          color={
                            entry.timestamp
                              ? "#FFFFFF"
                              : isCurrent
                              ? "#2E6A56"
                              : "#ccc"
                          }
                        />
                      </View>
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            entry.timestamp && styles.timelineLineCompleted,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text
                        style={[
                          styles.timelineTitle,
                          entry.timestamp && styles.timelineTitleCompleted,
                          isCurrent && styles.timelineTitleCurrent,
                        ]}
                      >
                        {getTimelineLabel(entry.status)}
                      </Text>
                      {entry.assignedTo && (
                        <View style={styles.assigneeContainer}>
                          <Ionicons
                            name="person-circle"
                            size={16}
                            color="#5C9479"
                          />
                          <Text style={styles.assigneeText}>
                            {entry.status === "assigned"
                              ? `Assigned to: ${entry.assignedTo}`
                              : `Handled by: ${entry.assignedTo}`}
                          </Text>
                        </View>
                      )}
                      {entry.department && (
                        <Text style={styles.departmentText}>
                          {entry.department}
                        </Text>
                      )}
                      {entry.timestamp ? (
                        <Text style={styles.timelineTimestamp}>
                          {formatTimelineDate(entry.timestamp)}
                        </Text>
                      ) : (
                        <Text style={styles.timelinePending}>Pending</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Image (if available) */}
          {report.imageUri && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photo Evidence</Text>
              <Image
                source={{ uri: report.imageUri }}
                style={styles.reportImage}
              />
            </View>
          )}

          {/* Upvote Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community Support</Text>
            <TouchableOpacity
              style={[
                styles.upvoteButton,
                report.hasUserUpvoted && styles.upvoteButtonActive,
              ]}
              onPress={() => onUpvote(report.id)}
            >
              <Ionicons
                name={report.hasUserUpvoted ? "heart" : "heart-outline"}
                size={24}
                color={report.hasUserUpvoted ? "#FFFFFF" : "#2E6A56"}
              />
              <Text
                style={[
                  styles.upvoteText,
                  report.hasUserUpvoted && styles.upvoteTextActive,
                ]}
              >
                {report.upvotes}{" "}
                {report.upvotes === 1 ? "person supports" : "people support"}{" "}
                this report
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 4,
  },
  reportIdText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 12,
  },
  reporterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f3f4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reporterInfo: {
    flex: 1,
  },
  reporterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 2,
  },
  reportTime: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 2,
  },
  locationArea: {
    fontSize: 14,
    color: "#666",
  },
  reportImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  upvoteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2E6A56",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  upvoteButtonActive: {
    backgroundColor: "#2E6A56",
    borderColor: "#2E6A56",
  },
  upvoteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E6A56",
    marginLeft: 12,
  },
  upvoteTextActive: {
    color: "#FFFFFF",
  },
  timelineContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f3f4",
    borderWidth: 2,
    borderColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  timelineIconCurrent: {
    borderColor: "#2E6A56",
    backgroundColor: "#FFFFFF",
  },
  timelineIconCompleted: {
    backgroundColor: "#2E6A56",
    borderColor: "#2E6A56",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#e9ecef",
  },
  timelineLineCompleted: {
    backgroundColor: "#2E6A56",
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  timelineTitleCompleted: {
    color: "#4A4A4A",
  },
  timelineTitleCurrent: {
    color: "#2E6A56",
  },
  timelineTimestamp: {
    fontSize: 14,
    color: "#666",
  },
  timelinePending: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  assigneeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  assigneeText: {
    fontSize: 13,
    color: "#2E6A56",
    fontWeight: "500",
    marginLeft: 4,
  },
  departmentText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 2,
  },
  coordinates: {
    fontSize: 12,
    color: "#999",
    fontFamily: "monospace",
    marginTop: 4,
  },
  mapContainer: {
    marginTop: 12,
    height: 200,
  },
});
