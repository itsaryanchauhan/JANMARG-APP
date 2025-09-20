import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ReportDetailModal from "../components/ReportDetailModal";
import {
  CommunityReport,
  useCommunityReports,
} from "../context/CommunityReportsContext";

export default function SearchScreen() {
  const { searchReports, toggleUpvote } = useCommunityReports();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(
    null
  );
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a report ID to search");
      return;
    }

    const results = searchReports(searchQuery);
    setSearchResults(results);
    setHasSearched(true);

    if (results.length === 0) {
      Alert.alert(
        "No Results",
        `No reports found matching "${searchQuery}". Try searching by report ID (e.g., CR001) or keywords.`
      );
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

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
    // Update search results if they contain this report
    setSearchResults((prev) =>
      prev.map((report) => {
        if (report.id === reportId) {
          return {
            ...report,
            upvotes: report.hasUserUpvoted
              ? report.upvotes - 1
              : report.upvotes + 1,
            hasUserUpvoted: !report.hasUserUpvoted,
          };
        }
        return report;
      })
    );
  };

  const renderSearchResult = ({ item: report }: { item: any }) => (
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
          <Text style={styles.reportId}>ID: {report.id}</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Reports</Text>
        <Text style={styles.headerSubtitle}>
          Search by report ID, keywords, or reporter name
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter report ID (e.g., CR001) or keywords..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.searchButton,
            !searchQuery.trim() && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={!searchQuery.trim()}
        >
          <Text
            style={[
              styles.searchButtonText,
              !searchQuery.trim() && styles.searchButtonTextDisabled,
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.content}>
        {!hasSearched ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Search for Reports</Text>
            <Text style={styles.emptySubtitle}>
              Enter a report ID like "CR001" or use keywords to find specific
              reports
            </Text>
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleTitle}>Example searches:</Text>
              <Text style={styles.exampleText}>
                • CR001 (specific report ID)
              </Text>
              <Text style={styles.exampleText}>• pothole (issue type)</Text>
              <Text style={styles.exampleText}>• Arjun (reporter name)</Text>
              <Text style={styles.exampleText}>• Delhi (location)</Text>
            </View>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Reports Found</Text>
            <Text style={styles.emptySubtitle}>
              No reports match your search "{searchQuery}". Try different
              keywords or report IDs.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {searchResults.length}{" "}
                {searchResults.length === 1 ? "result" : "results"} found
              </Text>
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearResultsButton}
              >
                <Text style={styles.clearResultsText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          </>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: "#e32f45",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  searchButtonDisabled: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  searchButtonTextDisabled: {
    color: "#999",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
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
    marginBottom: 20,
  },
  exampleContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: "100%",
    maxWidth: 300,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  clearResultsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  clearResultsText: {
    fontSize: 12,
    color: "#666",
  },
  resultsList: {
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
  reportId: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e32f45",
    marginBottom: 2,
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
});
