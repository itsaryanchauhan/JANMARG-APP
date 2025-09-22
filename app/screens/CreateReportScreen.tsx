import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useReports } from "../../context/ReportsContext";
import { logger } from "../../utils/logger";

const REPORT_TYPES = [
  { label: "Pothole", value: "pothole" },
  { label: "Broken Streetlight", value: "broken-streetlight" },
  { label: "Garbage Issue", value: "garbage" },
  { label: "Overgrown Weed", value: "overgrown-weed" },
  { label: "Water Issue", value: "water-issue" },
  { label: "Infrastructure", value: "infrastructure" },
  { label: "Traffic", value: "traffic" },
  { label: "Animal Issue", value: "animal-issue" },
  { label: "Encroachment", value: "encroachment" },
  { label: "Garbage Issue", value: "garbage-issue" },
];

export default function CreateReportScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const { addReport } = useReports();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a report title");
      return;
    }

    if (!selectedType) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    try {
      setLoading(true);
      logger.info("Creating report", { title, type: selectedType });

      await addReport({
        title: title.trim(),
        description: description.trim(),
        type: selectedType as any,
        isAnonymous: false, // You can add a toggle for this later
      });

      logger.info("Report created successfully");
      Alert.alert("Success", "Report submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setTitle("");
            setDescription("");
            setSelectedType("");
            // Navigate to My Reports tab
            navigation.navigate("MyReports" as never);
          },
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit report";
      logger.error("Report creation failed", error);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedTypeLabel =
    REPORT_TYPES.find((type) => type.value === selectedType)?.label ||
    "Select category";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: bottomTabBarHeight + 20,
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
    >
      <View style={styles.header}>
        <Ionicons name="document-text" size={32} color="#2E6A56" />
        <Text style={styles.title}>Create Report</Text>
        <Text style={styles.subtitle}>Submit a new report or incident</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Report Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter report title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setShowTypePicker(!showTypePicker)}
          >
            <Text
              style={[styles.selectText, selectedType && { color: "#333" }]}
            >
              {selectedTypeLabel}
            </Text>
            <Ionicons
              name={showTypePicker ? "chevron-up" : "chevron-down"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>

          {showTypePicker && (
            <View style={styles.pickerContainer}>
              {REPORT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedType(type.value);
                    setShowTypePicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{type.label}</Text>
                  {selectedType === type.value && (
                    <Ionicons name="checkmark" size={20} color="#2E6A56" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the incident or issue"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons
                name="send"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  selectText: {
    fontSize: 16,
    color: "#999",
  },
  submitButton: {
    backgroundColor: "#2E6A56",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    maxHeight: 200,
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
