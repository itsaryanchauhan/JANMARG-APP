import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PostScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post Screen</Text>
      <Text style={styles.subtitle}>Create and share content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
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
  },
});
