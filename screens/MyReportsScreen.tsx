import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useReports } from "../context/ReportsContext";

export default function MyReportsScreen() {
  const { reports } = useReports();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "#ffc107";
      case "in-progress":
        return "#007bff";
      case "resolved":
        return "#28a745";
      default:
        return "#6c757d";
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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={32} color="#e32f45" />
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>Track your submitted reports and their status</Text>
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
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reports.length}</Text>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {reports.filter(r => r.status === 'submitted').length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {reports.filter(r => r.status === 'resolved').length}
              </Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>

          {reports.map((report) => (
            <TouchableOpacity key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={[styles.iconContainer, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                  <Ionicons 
                    name={getIssueTypeIcon(report.type) as any} 
                    size={24} 
                    color={getStatusColor(report.status)} 
                  />
                </View>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportTime}>{formatDate(report.timestamp)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                    <Text style={styles.statusText}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                    </Text>
                  </View>
                </View>
                {report.imageUri && (
                  <Image source={{ uri: report.imageUri }} style={styles.reportImage} />
                )}
              </View>
              <Text style={styles.reportDescription} numberOfLines={2}>
                {report.description}
              </Text>
              {report.location && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color="#666" />
                  <Text style={styles.locationText}>
                    {report.location.address || `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#fff",
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
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#ffffff",
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
    color: "#333",
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
    color: "#fff",
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
});