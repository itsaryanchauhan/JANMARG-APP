import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useCommunityReports } from "../context/CommunityReportsContext";
import { useReports } from "../context/ReportsContext";
import { logger } from "../utils/logger";

interface CreateReportModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

const issueTypes = [
  { value: "pothole", label: "Pothole", icon: "car-outline" },
  {
    value: "broken-streetlight",
    label: "Broken Streetlight",
    icon: "bulb-outline",
  },
  { value: "garbage", label: "Garbage", icon: "trash-outline" },
  { value: "overgrown-weed", label: "Overgrown Weed", icon: "leaf-outline" },
];

const wardOptions = [
  "Bokaro",
  "Chatra",
  "Deoghar",
  "Dhanbad",
  "Dumka",
  "East Singhbhum",
  "Garhwa",
  "Giridih",
  "Godda",
  "Gumla",
  "Hazaribag",
  "Jamtara",
  "Khunti",
  "Koderma",
  "Latehar",
  "Lohardaga",
  "Palamu",
  "Pakur",
  "Ramgarh",
  "Ranchi",
  "Sahebganj",
  "Seraikela Kharsawan",
  "Simdega",
  "West Singhbhum",
];

export default function CreateReportModal({
  visible,
  onClose,
}: CreateReportModalProps) {
  logger.info("CreateReportModal rendered", { visible });

  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [showWardSelector, setShowWardSelector] = useState(false);

  const { addReport } = useReports();
  const { addCommunityReport, selectedArea } = useCommunityReports();

  const requestLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Location access is required to automatically capture the location of incidents.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) return null;

    setIsGettingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Get address from coordinates
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let addressText = "Unknown location";
      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        const parts = [];

        // Build address from available parts
        if (addr.name) parts.push(addr.name);
        if (addr.street) parts.push(addr.street);
        if (addr.district) parts.push(addr.district);
        if (addr.city) parts.push(addr.city);
        if (addr.region) parts.push(addr.region);
        if (addr.country) parts.push(addr.country);

        if (parts.length > 0) {
          addressText = parts.slice(0, 3).join(", "); // Take first 3 parts
        } else {
          // Fallback to coordinates if no address parts available
          addressText = `${location.coords.latitude.toFixed(
            6
          )}, ${location.coords.longitude.toFixed(6)}`;
        }
      }

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: addressText,
        fullAddress: addresses[0] || null,
      };

      setCurrentLocation(locationData);
      setIsGettingLocation(false);
      return locationData;
    } catch (error) {
      setIsGettingLocation(false);
      console.error("Location error:", error);
      Alert.alert("Error", "Could not get location. Please try again.");
      return null;
    }
  };

  const requestCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera access is required to take photos for reports.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Media library access is required to select photos.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const showImageOptions = () => {
    Alert.alert(
      "Add Photo",
      "Choose how you want to add a photo to your report",
      [
        {
          text: "Take Photo",
          onPress: handleTakePhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: handleChoosePhoto,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      // Automatically capture location when image is taken
      await getCurrentLocation();
    }
  };

  const handleChoosePhoto = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      // Automatically capture location when image is selected
      await getCurrentLocation();
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    logger.info("Report submission started", {
      hasDescription: !!description.trim(),
      selectedIssueType,
      hasImage: !!selectedImage,
      isAnonymous,
      selectedWard,
      selectedArea,
    });

    if (!description.trim()) {
      logger.warn("Report submission failed: no description");
      Alert.alert("Error", "Please add a description for your report.");
      return;
    }

    if (!selectedIssueType) {
      logger.warn("Report submission failed: no issue type selected");
      Alert.alert("Error", "Please select an issue type.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add report to personal reports context
      const selectedType = issueTypes.find(
        (type) => type.value === selectedIssueType
      );
      addReport({
        title: selectedType?.label || "Unknown Issue",
        description: description.trim(),
        type: selectedIssueType as any,
        imageUri: selectedImage || undefined,
        location: currentLocation,
        isAnonymous: isAnonymous,
      });

      // Also add to community reports so it appears in HomeScreen
      const reportArea = selectedWard || selectedArea; // Use selected ward or current selected area
      addCommunityReport({
        title: selectedType?.label || "Unknown Issue",
        description: description.trim(),
        type: selectedIssueType as any,
        imageUri: selectedImage || undefined,
        location: {
          latitude: currentLocation?.latitude || 0,
          longitude: currentLocation?.longitude || 0,
          address: currentLocation?.address || `${reportArea}, Jharkhand`,
          area: reportArea,
        },
      });

      logger.info("Report submitted successfully", {
        type: selectedIssueType,
        area: reportArea,
        isAnonymous,
      });

      setIsSubmitting(false);
      Alert.alert("Success", "Your report has been submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            onClose();
          },
        },
      ]);
    } catch (error) {
      logger.error("Report submission failed", error);
      setIsSubmitting(false);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  const resetForm = () => {
    setDescription("");
    setSelectedImage(null);
    setSelectedIssueType(null);
    setCurrentLocation(null);
    setIsAnonymous(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#4A4A4A" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Report</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Issue Type Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issue Type</Text>
            <Text style={styles.sectionSubtitle}>
              Select the type of issue you're reporting
            </Text>

            <View style={styles.issueTypeGrid}>
              {issueTypes.map((issue) => (
                <TouchableOpacity
                  key={issue.value}
                  style={[
                    styles.issueTypeButton,
                    selectedIssueType === issue.value &&
                      styles.issueTypeButtonSelected,
                  ]}
                  onPress={() => setSelectedIssueType(issue.value)}
                >
                  <Ionicons
                    name={issue.icon as any}
                    size={24}
                    color={
                      selectedIssueType === issue.value ? "#FFFFFF" : "#2E6A56"
                    }
                  />
                  <Text
                    style={[
                      styles.issueTypeText,
                      selectedIssueType === issue.value &&
                        styles.issueTypeTextSelected,
                    ]}
                  >
                    {issue.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* District Selection Section (Optional) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              District Selection (Optional)
            </Text>
            <Text style={styles.sectionSubtitle}>
              Select your district in Jharkhand if you know it, otherwise we'll
              detect it automatically
            </Text>

            <TouchableOpacity
              style={styles.wardSelector}
              onPress={() => setShowWardSelector(!showWardSelector)}
            >
              <Text
                style={[
                  styles.wardSelectorText,
                  selectedWard && styles.wardSelectorTextSelected,
                ]}
              >
                {selectedWard || "Select District (Optional)"}
              </Text>
              <Ionicons
                name={showWardSelector ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {showWardSelector && (
              <View style={styles.wardOptionsContainer}>
                <ScrollView
                  style={styles.wardScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  <TouchableOpacity
                    style={styles.wardOption}
                    onPress={() => {
                      setSelectedWard(null);
                      setShowWardSelector(false);
                    }}
                  >
                    <Text style={styles.wardOptionText}>
                      Auto-detect district
                    </Text>
                  </TouchableOpacity>
                  {wardOptions.map((ward) => (
                    <TouchableOpacity
                      key={ward}
                      style={styles.wardOption}
                      onPress={() => {
                        setSelectedWard(ward);
                        setShowWardSelector(false);
                      }}
                    >
                      <Text style={styles.wardOptionText}>{ward}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo Evidence</Text>
            <Text style={styles.sectionSubtitle}>
              Add a photo to support your report{" "}
              {isGettingLocation && "(Getting location...)"}
            </Text>

            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeImage}
                >
                  <Ionicons name="close-circle" size={24} color="#2E6A56" />
                </TouchableOpacity>
                {currentLocation && (
                  <View style={styles.locationOverlay}>
                    <Ionicons name="location" size={16} color="#FFFFFF" />
                    <Text style={styles.locationText}>
                      {currentLocation.address || "Location captured"}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.photoButton}
                onPress={showImageOptions}
              >
                <Ionicons name="camera" size={32} color="#2E6A56" />
                <Text style={styles.photoButtonText}>Tap to add photo</Text>
                <Text style={styles.photoButtonSubtext}>
                  Camera or Gallery • Location auto-captured
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionSubtitle}>
              Describe the issue you're reporting
            </Text>

            <TextInput
              style={styles.descriptionInput}
              placeholder="What happened? Please provide details about the issue..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          {/* Manual Location Button (if no location captured) */}
          {!currentLocation && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.sectionSubtitle}>
                Add location information to help authorities locate the issue
              </Text>

              <TouchableOpacity
                style={styles.getLocationButton}
                onPress={getCurrentLocation}
                disabled={isGettingLocation}
              >
                <Ionicons
                  name={isGettingLocation ? "hourglass" : "location"}
                  size={24}
                  color={isGettingLocation ? "#999" : "#2E6A56"}
                />
                <Text
                  style={[
                    styles.getLocationButtonText,
                    isGettingLocation && styles.getLocationButtonTextDisabled,
                  ]}
                >
                  {isGettingLocation
                    ? "Getting location..."
                    : "Get Current Location"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Location Info */}
          {currentLocation && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Location</Text>
                <TouchableOpacity
                  style={styles.refreshLocationButton}
                  onPress={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  <Ionicons
                    name="refresh"
                    size={16}
                    color={isGettingLocation ? "#999" : "#2E6A56"}
                  />
                  <Text
                    style={[
                      styles.refreshLocationText,
                      isGettingLocation && styles.refreshLocationTextDisabled,
                    ]}
                  >
                    {isGettingLocation ? "Updating..." : "Refresh"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.locationSection}>
                <View style={styles.locationInfoContainer}>
                  <Ionicons name="location" size={20} color="#2E6A56" />
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationInfoText}>
                      {currentLocation.address}
                    </Text>
                    <Text style={styles.coordinatesText}>
                      {currentLocation.latitude.toFixed(6)},{" "}
                      {currentLocation.longitude.toFixed(6)}
                    </Text>
                  </View>
                </View>

                {/* Map View */}
                <View style={styles.mapContainer}>
                  <WebView
                    source={{
                      html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                            <style>
                                body { margin: 0; padding: 0; }
                                #map { height: 100vh; width: 100%; }
                            </style>
                        </head>
                        <body>
                            <div id="map"></div>
                            <script>
                                var map = L.map('map').setView([${currentLocation.latitude}, ${currentLocation.longitude}], 16);
                                
                                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                    attribution: '© OpenStreetMap contributors'
                                }).addTo(map);
                                
                                var marker = L.marker([${currentLocation.latitude}, ${currentLocation.longitude}]).addTo(map);
                                marker.bindPopup('Report Location');
                                
                                // Disable interactions for create report view
                                map.dragging.disable();
                                map.touchZoom.disable();
                                map.doubleClickZoom.disable();
                                map.scrollWheelZoom.disable();
                                map.boxZoom.disable();
                                map.keyboard.disable();
                            </script>
                        </body>
                        </html>
                      `,
                    }}
                    style={styles.map}
                    scrollEnabled={false}
                    scalesPageToFit={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                  />
                  <TouchableOpacity
                    style={styles.mapOverlay}
                    onPress={() => {
                      // Optional: Open in a larger map modal or external maps app
                      Alert.alert(
                        "Location",
                        `Lat: ${currentLocation.latitude.toFixed(
                          6
                        )}\nLng: ${currentLocation.longitude.toFixed(6)}\n\n${
                          currentLocation.address
                        }`,
                        [{ text: "OK" }]
                      );
                    }}
                  >
                    <Text style={styles.mapOverlayText}>Tap for details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Anonymous Option */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.anonymousContainer}
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              <View
                style={[styles.checkbox, isAnonymous && styles.checkboxChecked]}
              >
                {isAnonymous && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <View style={styles.anonymousTextContainer}>
                <Text style={styles.anonymousTitle}>Post Anonymously</Text>
                <Text style={styles.anonymousSubtitle}>
                  Your identity will be hidden from other users
                </Text>
              </View>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  submitButton: {
    backgroundColor: "#2E6A56",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  photoButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#2E6A56",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E6A56",
    marginTop: 8,
  },
  photoButtonSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  imageContainer: {
    position: "relative",
    alignSelf: "center",
  },
  selectedImage: {
    width: width - 40,
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  descriptionInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#4A4A4A",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  issueTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  issueTypeButton: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  issueTypeButtonSelected: {
    backgroundColor: "#2E6A56",
    borderColor: "#2E6A56",
  },
  issueTypeText: {
    fontSize: 14,
    color: "#4A4A4A",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  issueTypeTextSelected: {
    color: "#FFFFFF",
  },
  locationOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 4,
    maxWidth: 200,
  },
  locationInfoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  locationInfoText: {
    fontSize: 14,
    color: "#4A4A4A",
    marginLeft: 8,
    flex: 1,
  },
  anonymousContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#e9ecef",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#2E6A56",
    borderColor: "#2E6A56",
  },
  anonymousTextContainer: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 2,
  },
  anonymousSubtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  locationSection: {
    gap: 12,
  },
  locationDetails: {
    flex: 1,
    marginLeft: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontFamily: "monospace",
  },
  mapContainer: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  mapOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mapOverlayText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  refreshLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  refreshLocationText: {
    fontSize: 12,
    color: "#2E6A56",
    fontWeight: "500",
    marginLeft: 4,
  },
  refreshLocationTextDisabled: {
    color: "#999",
  },
  getLocationButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2E6A56",
    borderStyle: "dashed",
  },
  getLocationButtonText: {
    fontSize: 16,
    color: "#2E6A56",
    fontWeight: "600",
    marginLeft: 8,
  },
  getLocationButtonTextDisabled: {
    color: "#999",
  },
  wardSelector: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  wardSelectorText: {
    fontSize: 16,
    color: "#999",
  },
  wardSelectorTextSelected: {
    color: "#4A4A4A",
    fontWeight: "500",
  },
  wardOptionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginTop: 8,
    maxHeight: 240,
    overflow: "hidden",
  },
  wardScrollView: {
    backgroundColor: "#FFFFFF",
    maxHeight: 240,
  },
  wardOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
    backgroundColor: "#FFFFFF",
  },
  wardOptionText: {
    fontSize: 16,
    color: "#4A4A4A",
  },
});
