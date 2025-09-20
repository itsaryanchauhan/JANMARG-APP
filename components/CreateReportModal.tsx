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

  const { addReport } = useReports();

  const requestLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Location access is required to automatically capture the location of incidents.',
        [{ text: 'OK' }]
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
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address[0] ? `${address[0].street}, ${address[0].city}` : 'Unknown location',
      };
      
      setCurrentLocation(locationData);
      setIsGettingLocation(false);
      return locationData;
    } catch (error) {
      setIsGettingLocation(false);
      Alert.alert('Error', 'Could not get location. Please try again.');
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
    const selectedType = issueTypes.find(type => type.value === selectedIssueType);
    addReport({
      title: selectedType?.label || 'Unknown Issue',
      description: description.trim(),
      type: selectedIssueType as any,
      imageUri: selectedImage || undefined,
      location: currentLocation,
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
            <Text style={styles.sectionSubtitle}>Select the type of issue you're reporting</Text>
            
            <View style={styles.issueTypeGrid}>
              {issueTypes.map((issue) => (
                <TouchableOpacity
                  key={issue.value}
                  style={[
                    styles.issueTypeButton,
                    selectedIssueType === issue.value && styles.issueTypeButtonSelected
                  ]}
                  onPress={() => setSelectedIssueType(issue.value)}
                >
                  <Ionicons 
                    name={issue.icon as any} 
                    size={24} 
                    color={selectedIssueType === issue.value ? '#fff' : '#e32f45'} 
                  />
                  <Text style={[
                    styles.issueTypeText,
                    selectedIssueType === issue.value && styles.issueTypeTextSelected
                  ]}>
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
              Add a photo to support your report {isGettingLocation && '(Getting location...)'}
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
                      {currentLocation.address || 'Location captured'}
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
                <Text style={styles.photoButtonSubtext}>Camera or Gallery • Location auto-captured</Text>
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

          {/* Location Info */}
          {currentLocation && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.locationInfoContainer}>
                <Ionicons name="location" size={20} color="#e32f45" />
                <Text style={styles.locationInfoText}>
                  {currentLocation.address || `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`}
                </Text>
              </View>
            </View>
          )}
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
});
