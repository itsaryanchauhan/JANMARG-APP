import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Import screen components
import CreateReportModal from "../components/CreateReportModal";
import CreateReportScreen from "../screens/CreateReportScreen";
import HomeScreen from "../screens/HomeScreen";
import PlaceholderScreen from "../screens/PlaceholderScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MyReportsScreen from "../screens/MyReportsScreen";

const Tab = createBottomTabNavigator();

// Custom Tab Bar Button for the middle CREATE REPORT button
const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: "center",
      alignItems: "center",
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View style={styles.customButton}>{children}</View>
  </TouchableOpacity>
);

const Tabs = () => {
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);

  const handleCreateReportPress = () => {
    setShowCreateReportModal(true);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 25,
            left: 20,
            right: 20,
            backgroundColor: "#ffffff",
            borderRadius: 15,
            height: 90,
            ...styles.shadow,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={25}
                  color={focused ? "#e32f45" : "#748c94"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: focused ? "#e32f45" : "#748c94",
                    },
                  ]}
                >
                  HOME
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Placeholder"
          component={PlaceholderScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <Ionicons
                  name={focused ? "apps" : "apps-outline"}
                  size={25}
                  color={focused ? "#e32f45" : "#748c94"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: focused ? "#e32f45" : "#748c94",
                    },
                  ]}
                >
                  MENU
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
              <Ionicons name="document-text" size={28} color="#fff" />
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
              <View style={styles.tabItem}>
                <Ionicons
                  name={focused ? "document-text" : "document-text-outline"}
                  size={25}
                  color={focused ? "#e32f45" : "#748c94"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: focused ? "#e32f45" : "#748c94",
                    },
                  ]}
                >
                  MY REPORTS
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
              <View style={styles.tabItem}>
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={25}
                  color={focused ? "#e32f45" : "#748c94"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: focused ? "#e32f45" : "#748c94",
                    },
                  ]}
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

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e32f45",
    justifyContent: "center",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Tabs;
