import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReportDetailModal from "../../components/ReportDetailModal";
import {
  CommunityReport,
  useCommunityReports,
} from "../../context/CommunityReportsContext";
import { useLanguage } from "../../context/LanguageContext";
import { logger } from "../../utils/logger";

export default function HomeScreen() {
  const {
    selectedArea,
    areas,
    setSelectedArea,
    toggleUpvote,
    getReportsForArea,
  } = useCommunityReports();

  logger.info("HomeScreen rendered", { selectedArea });

  const { currentLanguage, setLanguage, availableLanguages, t } = useLanguage();

  const [showAreaSelector, setShowAreaSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(
    null
  );
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const bottomTabBarHeight = useBottomTabBarHeight();

  useFocusEffect(
    React.useCallback(() => {
      // Scroll to top when the screen comes into focus
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }, [])
  );

  const allReports = getReportsForArea(selectedArea).filter(
    (report) => report.status !== "resolved"
  );

  // Apply status filter
  const reportsInArea =
    statusFilter === "all"
      ? allReports
      : allReports.filter((report) => report.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "#5C9479";
      case "in-progress":
        return "#2E6A56";
      case "resolved":
        return "#2E6A56";
      default:
        return "#4A4A4A";
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

      {(report.imageSource || report.imageUri) && (
        <View style={styles.reportImageContainer}>
          <Image
            source={report.imageSource || { uri: report.imageUri }}
            style={styles.reportImage}
            resizeMode="cover"
          />
          <View style={styles.locationOverlay}>
            <Ionicons name="location" size={14} color="#FFFFFF" />
            <Text style={styles.locationOverlayText} numberOfLines={1}>
              {report.location.address}
            </Text>
          </View>
        </View>
      )}

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
            color={report.hasUserUpvoted ? "#FFFFFF" : "#2E6A56"}
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.welcomeText}>{t("welcome")}</Text>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <Text style={styles.languageName}>{currentLanguage.name}</Text>
            <Ionicons name="chevron-down" size={16} color="#4A4A4A" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.areaSelector}
          onPress={() => setShowAreaSelector(!showAreaSelector)}
        >
          <View style={styles.areaSelectorContent}>
            <Ionicons name="location" size={20} color="#2E6A56" />
            <Text style={styles.selectedAreaText}>{selectedArea}</Text>
          </View>
          <Ionicons
            name={showAreaSelector ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
        {/* DROPDOWNS HAVE BEEN MOVED FROM HERE */}
      </View>

      {/* Reports List */}
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {reportsInArea.length}{" "}
            {reportsInArea.length === 1 ? "report" : "reports"} found
          </Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowStatusFilter(!showStatusFilter)}
            >
              <Ionicons name="filter-outline" size={16} color="#666" />
              <Text style={styles.filterText}>{t("filter") || "Filter"}</Text>
              <Ionicons
                name={showStatusFilter ? "chevron-up" : "chevron-down"}
                size={16}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Filter Options */}
        {showStatusFilter && (
          <View style={styles.filterOptionsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { key: "all", label: "All", labelHi: "सभी" },
                { key: "submitted", label: "Submitted", labelHi: "प्रस्तुत" },
                {
                  key: "in-progress",
                  label: "In Progress",
                  labelHi: "प्रगति में",
                },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterChip,
                    statusFilter === filter.key && styles.activeFilterChip,
                  ]}
                  onPress={() => {
                    setStatusFilter(filter.key);
                    setShowStatusFilter(false);
                  }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      statusFilter === filter.key &&
                        styles.activeFilterChipText,
                    ]}
                  >
                    {currentLanguage.code === "hi"
                      ? filter.labelHi
                      : filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
            ref={flatListRef}
            data={reportsInArea}
            renderItem={renderReportCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: bottomTabBarHeight + 20 }}
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

      {/* ===== FIX STARTS HERE ===== */}
      {/* Dropdowns are now rendered here, as overlays at the root level */}

      {/* District Dropdown */}
      {showAreaSelector && (
        <>
          {/* Backdrop to capture touches */}
          <TouchableOpacity
            style={styles.dropdownBackdrop}
            onPress={() => setShowAreaSelector(false)}
            activeOpacity={1}
          />
          <View style={styles.areaDropdown} pointerEvents="auto">
            <ScrollView
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
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
                    // Auto-scroll to top when region changes
                    setTimeout(() => {
                      flatListRef.current?.scrollToOffset({
                        offset: 0,
                        animated: true,
                      });
                    }, 100);
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
                    <Ionicons name="checkmark" size={20} color="#2E6A56" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
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
                  currentLanguage.code === language.code &&
                    styles.languageItemSelected,
                ]}
                onPress={() => {
                  setLanguage(language);
                  setShowLanguageSelector(false);
                }}
              >
                <Text
                  style={[
                    styles.languageItemText,
                    currentLanguage.code === language.code &&
                      styles.languageItemTextSelected,
                  ]}
                >
                  {language.name}
                </Text>
                {currentLanguage.code === language.code && (
                  <Ionicons name="checkmark" size={20} color="#2E6A56" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {/* ===== FIX ENDS HERE ===== */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  dropdownBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1999, // Z-index should be high, but lower than the dropdown itself
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    zIndex: 1, // Lower zIndex for header as overlays are handled separately
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
    color: "#4A4A4A",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#EFEFEF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  languageName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A4A4A",
    marginRight: 6,
  },
  areaSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
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
    color: "#4A4A4A",
    marginLeft: 8,
  },
  areaDropdown: {
    position: "absolute",
    top: 140, // Adjusted this value to be more accurate relative to the screen top
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    maxHeight: 300, // Use maxHeight instead of height to be more flexible
    zIndex: 2000, // Must be higher than backdrop
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  areaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
  },
  areaItemSelected: {
    backgroundColor: "#EFEFEF",
  },
  areaItemText: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  areaItemTextSelected: {
    color: "#2E6A56",
    fontWeight: "500",
  },
  languageDropdown: {
    position: "absolute",
    top: 60, // Adjusted this value
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxHeight: 150,
    width: 160,
    zIndex: 2000, // Give it a high zIndex as well
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
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  languageItemSelected: {
    backgroundColor: "#EFEFEF",
  },
  languageItemText: {
    fontSize: 14,
    color: "#4A4A4A",
    flex: 1,
  },
  languageItemTextSelected: {
    color: "#2E6A56",
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
    backgroundColor: "#FFFFFF",
  },
  filterText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    marginRight: 4,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
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
    color: "#4A4A4A",
    marginBottom: 4,
    lineHeight: 20,
  },
  reportMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportTime: {
    fontSize: 12,
    color: "#999",
    flex: 1,
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
    color: "#FFFFFF",
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
    marginTop: 8,
  },
  upvoteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2E6A56",
    backgroundColor: "#FFFFFF",
  },
  upvoteButtonActive: {
    backgroundColor: "#2E6A56",
  },
  upvoteCount: {
    fontSize: 12,
    color: "#2E6A56",
    fontWeight: "500",
    marginLeft: 4,
  },
  upvoteCountActive: {
    color: "#FFFFFF",
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
    paddingBottom: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A4A4A",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  filterOptionsContainer: {
    marginBottom: 15,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeFilterChip: {
    backgroundColor: "#2E6A56",
    borderColor: "#2E6A56",
  },
  filterChipText: {
    fontSize: 14,
    color: "#4A4A4A",
    fontWeight: "500",
  },
  activeFilterChipText: {
    color: "#FFFFFF",
  },
  reportImageContainer: {
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  reportImage: {
    width: "100%",
    height: 200,
  },
  locationOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "70%",
  },
  locationOverlayText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
});
