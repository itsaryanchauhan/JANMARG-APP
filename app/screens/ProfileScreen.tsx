import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      // Scroll to top when the screen comes into focus
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [])
  );

  const handleSignOut = () => {
    // Here you could add any cleanup logic like clearing user data, tokens, etc.
    // For now, we'll just redirect to the login screen
    router.replace("/login");
  };

  const profileOptions = [
    {
      icon: "person-outline",
      title: "Edit Profile",
      subtitle: "Demo button - feature not implemented yet",
    },
    {
      icon: "notifications-outline",
      title: "Notifications",
      subtitle: "Demo button - feature not implemented yet",
    },
    {
      icon: "lock-closed-outline",
      title: "Privacy & Security",
      subtitle: "Demo button - feature not implemented yet",
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      subtitle: "Demo button - feature not implemented yet",
    },
    {
      icon: "document-text-outline",
      title: "Terms & Conditions",
      subtitle: "Demo button - feature not implemented yet",
    },
    {
      icon: "log-out-outline",
      title: "Sign Out",
      subtitle: "Sign out of your account",
    },
  ];

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: bottomTabBarHeight + 20,
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#666" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>Arjun Sharma</Text>
        <Text style={styles.profileEmail}>arjun.sharma@gmail.com</Text>

        {/* Trust Score */}
        <View style={styles.trustScoreContainer}>
          <View style={styles.trustScorePill}>
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.trustScoreText}>Trust Score: 847</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.6</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
      </View>

      {/* Profile Options */}
      <View style={styles.optionsContainer}>
        {profileOptions.map((option, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.optionItem}
            onPress={option.title === "Sign Out" ? handleSignOut : undefined}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIconContainer}>
                <Ionicons name={option.icon as any} size={24} color="#2E6A56" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
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
    paddingBottom: 120,
  },
  profileHeader: {
    backgroundColor: "#2E6A56",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#333",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  trustScoreContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  trustScorePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5C9479",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  trustScoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 10,
  },
  optionsContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E6A5620",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
