import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Placeholder Screen</Text>
      <Text style={styles.subtitle}>
        This is a placeholder for future functionality
      </Text>
      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>🚧</Text>
        <Text style={styles.placeholderText}>Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  placeholderBox: {
    backgroundColor: "#e9ecef",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#dee2e6",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 18,
    color: "#6c757d",
    marginVertical: 5,
  },
});
