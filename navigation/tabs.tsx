import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import screen components
import CreateReportModal from "../components/CreateReportModal";
import CreateReportScreen from "../screens/CreateReportScreen";
import HomeScreen from "../screens/HomeScreen";
import MyReportsScreen from "../screens/MyReportsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const Tabs = () => {
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const insets = useSafeAreaInsets();

  // Responsive breakpoints and values calculated at runtime
  const isTablet = width >= 768;
  const isSmallPhone = width <= 375;

  // Add extra margin based on safe area and device type
  const baseMargin = isTablet ? 35 : isSmallPhone ? 25 : 30;
  const safeMargin = Math.max(baseMargin, insets.left + 15, insets.right + 15);

  // Ensure minimum margin even if safe area is 0
  const finalMargin = Math.max(safeMargin, baseMargin);

  // Calculate responsive values with proper constraints
  const getResponsiveValue = () => {
    if (isTablet) {
      return {
        navbarHeight: 80,
        fontSize: 12,
        iconSize: 24,
        buttonSize: 65,
        margin: finalMargin, // Use safe area aware margin
      };
    } else if (isSmallPhone) {
      return {
        navbarHeight: 70,
        fontSize: 9,
        iconSize: 20,
        buttonSize: 50,
        margin: finalMargin, // Use safe area aware margin
      };
    } else {
      return {
        navbarHeight: 75,
        fontSize: 10,
        iconSize: 22,
        buttonSize: 55,
        margin: finalMargin, // Use safe area aware margin
      };
    }
  };

  const responsive = getResponsiveValue();

  // Dynamic styles that depend on responsive values
  const dynamicStyles = StyleSheet.create({
    tabBarStyle: {
      position: "absolute",
      bottom: 15,
      left: responsive.margin,
      right: responsive.margin,
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      height: responsive.navbarHeight,
      paddingBottom: isTablet ? 15 : 10,
      paddingTop: isTablet ? 15 : 10,
      marginHorizontal: 0, // Ensure no additional margin
      ...styles.shadow,
    },
    customButton: {
      width: responsive.buttonSize,
      height: responsive.buttonSize,
      borderRadius: responsive.buttonSize / 2,
      backgroundColor: "#2E6A56",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "#FFFFFF",
    },
    tabItem: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: responsive.navbarHeight - 20,
      paddingHorizontal: isSmallPhone ? 2 : 4,
      flex: 1,
      maxWidth: width / 5, // Ensure equal distribution among 5 tabs
      paddingVertical: 5, // Add vertical padding for better spacing
    },
    tabLabel: {
      fontSize: responsive.fontSize,
      marginTop: isSmallPhone ? 1 : 2, // Reduced marginTop for Android phones
      fontWeight: "600",
      textAlign: "center",
      flexShrink: 0, // Prevent text shrinking
      width: "100%", // Take full available width
    },
  });

  // Custom Tab Bar Button for the middle CREATE REPORT button
  const CustomTabBarButton = ({ children, onPress }: any) => (
    <TouchableOpacity
      style={[
        {
          top: -25,
          justifyContent: "center",
          alignItems: "center",
        },
        styles.shadow,
      ]}
      onPress={onPress}
    >
      <View style={dynamicStyles.customButton}>{children}</View>
    </TouchableOpacity>
  );

  const handleCreateReportPress = () => {
    setShowCreateReportModal(true);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: dynamicStyles.tabBarStyle,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={dynamicStyles.tabItem}>
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={responsive.iconSize}
                  color={focused ? "#2E6A56" : "#6b7280"}
                />
                <Text
                  style={[
                    dynamicStyles.tabLabel,
                    {
                      color: focused ? "#2E6A56" : "#6b7280",
                    },
                  ]}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  HOME
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={dynamicStyles.tabItem}>
                <Ionicons
                  name={focused ? "search" : "search-outline"}
                  size={responsive.iconSize}
                  color={focused ? "#2E6A56" : "#6b7280"}
                />
                <Text
                  style={[
                    dynamicStyles.tabLabel,
                    {
                      color: focused ? "#2E6A56" : "#6b7280",
                    },
                  ]}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  SEARCH
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="CreateReport"
          component={CreateReportScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="document-text" size={28} color="#FFFFFF" />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton
                {...props}
                onPress={handleCreateReportPress}
              />
            ),
          }}
        />

        <Tab.Screen
          name="MyReports"
          component={MyReportsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={dynamicStyles.tabItem}>
                <Ionicons
                  name={focused ? "document-text" : "document-text-outline"}
                  size={responsive.iconSize}
                  color={focused ? "#2E6A56" : "#6b7280"}
                />
                <Text
                  style={[
                    dynamicStyles.tabLabel,
                    {
                      color: focused ? "#2E6A56" : "#6b7280",
                    },
                  ]}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  REPORTS
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={dynamicStyles.tabItem}>
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={responsive.iconSize}
                  color={focused ? "#2E6A56" : "#6b7280"}
                />
                <Text
                  style={[
                    dynamicStyles.tabLabel,
                    {
                      color: focused ? "#2E6A56" : "#6b7280",
                    },
                  ]}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  PROFILE
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>

      <CreateReportModal
        visible={showCreateReportModal}
        onClose={() => setShowCreateReportModal(false)}
      />
    </>
  );
};

// Static styles that don't depend on responsive values
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Tabs;
