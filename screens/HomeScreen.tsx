import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome Home!</Text>
      <Text style={styles.subtitle}>
        You have successfully completed onboarding
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dashboard</Text>
        <Text style={styles.cardText}>
          Your personalized content appears here
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <Text style={styles.cardText}>No recent activity to show</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <Text style={styles.cardText}>• Create new post</Text>
        <Text style={styles.cardText}>• Search content</Text>
        <Text style={styles.cardText}>• Check messages</Text>
      </View>
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
    paddingBottom: 120, // Add space for floating tab bar
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
