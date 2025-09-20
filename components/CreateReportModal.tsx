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
import MapView, { Marker } from "react-native-maps";
import { useReports } from "../context/ReportsContext";

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

export default function CreateReportModal({
  visible,
  onClose,
}: CreateReportModalProps) {
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { addReport } = useReports();

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
    if (!description.trim()) {
      Alert.alert("Error", "Please add a description for your report.");
      return;
    }

    if (!selectedIssueType) {
      Alert.alert("Error", "Please select an issue type.");
      return;
    }

    setIsSubmitting(true);

    // Add report to context
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
            <Ionicons name="close" size={28} color="#333" />
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
                      selectedIssueType === issue.value ? "#fff" : "#e32f45"
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
                  <Ionicons name="close-circle" size={24} color="#e32f45" />
                </TouchableOpacity>
                {currentLocation && (
                  <View style={styles.locationOverlay}>
                    <Ionicons name="location" size={16} color="#fff" />
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
                <Ionicons name="camera" size={32} color="#e32f45" />
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
                  color={isGettingLocation ? "#999" : "#e32f45"}
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
                    color={isGettingLocation ? "#999" : "#e32f45"}
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
                  <Ionicons name="location" size={20} color="#e32f45" />
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
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: currentLocation.latitude,
                      longitude: currentLocation.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                      }}
                      title="Report Location"
                      description={currentLocation.address}
                    >
                      <View style={styles.markerContainer}>
                        <Ionicons name="location" size={30} color="#e32f45" />
                      </View>
                    </Marker>
                  </MapView>
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
                  <Ionicons name="checkmark" size={16} color="#fff" />
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
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
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#e32f45",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
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
    color: "#333",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  photoButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e32f45",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e32f45",
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
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  descriptionInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  issueTypeButtonSelected: {
    backgroundColor: "#e32f45",
    borderColor: "#e32f45",
  },
  issueTypeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  issueTypeTextSelected: {
    color: "#fff",
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
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
    maxWidth: 200,
  },
  locationInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  locationInfoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  anonymousContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#e32f45",
    borderColor: "#e32f45",
  },
  anonymousTextContainer: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
    color: "#fff",
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
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  refreshLocationText: {
    fontSize: 12,
    color: "#e32f45",
    fontWeight: "500",
    marginLeft: 4,
  },
  refreshLocationTextDisabled: {
    color: "#999",
  },
  getLocationButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e32f45",
    borderStyle: "dashed",
  },
  getLocationButtonText: {
    fontSize: 16,
    color: "#e32f45",
    fontWeight: "600",
    marginLeft: 8,
  },
  getLocationButtonTextDisabled: {
    color: "#999",
  },
});
