import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import ReportDetailModal from "../components/ReportDetailModal";
import {
  CommunityReport,
  useCommunityReports,
} from "../context/CommunityReportsContext";
import { useLanguage } from "../context/LanguageContext";

export default function HomeScreen() {
  const {
    selectedArea,
    areas,
    setSelectedArea,
    toggleUpvote,
    getReportsForArea,
  } = useCommunityReports();
  
  const { currentLanguage, setLanguage, availableLanguages, t } = useLanguage();

  const [showAreaSelector, setShowAreaSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(
    null
  );
  const [showReportDetail, setShowReportDetail] = useState(false);

  const reportsInArea = getReportsForArea(selectedArea).filter(
    (report) => report.status !== "resolved"
  );

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
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1d ago";
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleReportPress = (report: any) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  const handleUpvote = (reportId: string) => {
    toggleUpvote(reportId);
    // Update selectedReport if it's the one being upvoted
    if (selectedReport && selectedReport.id === reportId) {
      const updatedReport = {
        ...selectedReport,
        upvotes: selectedReport.hasUserUpvoted
          ? selectedReport.upvotes - 1
          : selectedReport.upvotes + 1,
        hasUserUpvoted: !selectedReport.hasUserUpvoted,
      };
      setSelectedReport(updatedReport);
    }
  };

  const renderReportCard = ({ item: report }: { item: any }) => (
    <TouchableOpacity
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
          <Text style={styles.reportTitle} numberOfLines={2}>
            {report.title}
          </Text>
          <Text style={styles.reportLocation}>{report.location.address}</Text>
          <View style={styles.reportMeta}>
            <Text style={styles.reportTime}>
              {formatDate(report.timestamp)}
            </Text>
            <Text style={styles.reportAuthor}>by {report.reporter.name}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(report.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {report.status === "in-progress"
              ? "IN PROGRESS"
              : report.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.reportDescription} numberOfLines={2}>
        {report.description}
      </Text>

      <View style={styles.reportFooter}>
        <TouchableOpacity
          style={[
            styles.upvoteButton,
            report.hasUserUpvoted && styles.upvoteButtonActive,
          ]}
          onPress={() => handleUpvote(report.id)}
        >
          <Ionicons
            name={report.hasUserUpvoted ? "heart" : "heart-outline"}
            size={18}
            color={report.hasUserUpvoted ? "#fff" : "#e32f45"}
          />
          <Text
            style={[
              styles.upvoteCount,
              report.hasUserUpvoted && styles.upvoteCountActive,
            ]}
          >
            {report.upvotes}
          </Text>
        </TouchableOpacity>

        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>Tap to view details</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Area Selector */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.welcomeText}>{t('welcome')}</Text>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <Text style={styles.languageFlag}>{currentLanguage.flag}</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.areaSelector}
          onPress={() => setShowAreaSelector(!showAreaSelector)}
        >
          <View style={styles.areaSelectorContent}>
            <Ionicons name="location" size={20} color="#e32f45" />
            <Text style={styles.selectedAreaText}>{selectedArea}</Text>
          </View>
          <Ionicons
            name={showAreaSelector ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {/* Area Dropdown */}
        {showAreaSelector && (
          <View style={styles.areaDropdown}>
            <ScrollView
              style={styles.areaList}
              showsVerticalScrollIndicator={false}
            >
              {areas.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={[
                    styles.areaItem,
                    selectedArea === area && styles.areaItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedArea(area);
                    setShowAreaSelector(false);
                  }}
                >
                  <Text
                    style={[
                      styles.areaItemText,
                      selectedArea === area && styles.areaItemTextSelected,
                    ]}
                  >
                    {area}
                  </Text>
                  {selectedArea === area && (
                    <Ionicons name="checkmark" size={20} color="#e32f45" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Language Dropdown */}
        {showLanguageSelector && (
          <View style={styles.languageDropdown}>
            <ScrollView
              style={styles.languageScrollView}
              showsVerticalScrollIndicator={false}
            >
              {availableLanguages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    currentLanguage.code === language.code && styles.languageItemSelected,
                  ]}
                  onPress={() => {
                    setLanguage(language);
                    setShowLanguageSelector(false);
                  }}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageItemText,
                      currentLanguage.code === language.code && styles.languageItemTextSelected,
                    ]}
                  >
                    {language.name}
                  </Text>
                  {currentLanguage.code === language.code && (
                    <Ionicons name="checkmark" size={20} color="#e32f45" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Reports List */}
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {reportsInArea.length}{" "}
            {reportsInArea.length === 1 ? "report" : "reports"} found
          </Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter-outline" size={16} color="#666" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {reportsInArea.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Reports in {selectedArea}</Text>
            <Text style={styles.emptySubtitle}>
              This area looks good! Be the first to report any issues.
            </Text>
          </View>
        ) : (
          <FlatList
            data={reportsInArea}
            renderItem={renderReportCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.reportsList}
          />
        )}
      </View>

      {/* Report Detail Modal */}
      <ReportDetailModal
        visible={showReportDetail}
        report={selectedReport}
        onClose={() => setShowReportDetail(false)}
        onUpvote={handleUpvote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    zIndex: 1000,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  languageFlag: {
    fontSize: 18,
    marginRight: 6,
  },
  areaSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  areaSelectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedAreaText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
  },
  areaDropdown: {
    position: "absolute",
    top: 85,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxHeight: 200,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  areaList: {
    maxHeight: 180,
  },
  areaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  areaItemSelected: {
    backgroundColor: "#f8f9fa",
  },
  areaItemText: {
    fontSize: 16,
    color: "#333",
  },
  areaItemTextSelected: {
    color: "#e32f45",
    fontWeight: "500",
  },
  languageDropdown: {
    position: "absolute",
    top: 85,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxHeight: 150,
    width: 160,
    zIndex: 1002,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  languageScrollView: {
    maxHeight: 130,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  languageItemSelected: {
    backgroundColor: "#f8f9fa",
  },
  languageItemText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  languageItemTextSelected: {
    color: "#e32f45",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  statsText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterButtons: {
    flexDirection: "row",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  filterText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  reportsList: {
    paddingBottom: 20,
  },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginRight: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    lineHeight: 20,
  },
  reportLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  reportMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reportTime: {
    fontSize: 12,
    color: "#999",
  },
  reportAuthor: {
    fontSize: 12,
    color: "#999",
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  reportDescription: {
    fontSize: 14,
    color: "#444",
    lineHeight: 18,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upvoteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e32f45",
    backgroundColor: "#fff",
  },
  upvoteButtonActive: {
    backgroundColor: "#e32f45",
  },
  upvoteCount: {
    fontSize: 12,
    color: "#e32f45",
    fontWeight: "500",
    marginLeft: 4,
  },
  upvoteCountActive: {
    color: "#fff",
  },
  viewDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 12,
    color: "#999",
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
