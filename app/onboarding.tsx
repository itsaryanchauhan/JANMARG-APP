import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Swiper from "react-native-swiper";

const { width: w, height: h } = Dimensions.get("window");

export default function OnboardingScreen() {
  const isDarkMode = useColorScheme() === "dark";
  const router = useRouter();

  const handleFinish = () => {
    router.push("./home");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" },
      ]}
    >
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={isDarkMode ? "#1a1a1a" : "#ffffff"}
      />
      <Swiper
        style={{ backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }}
        removeClippedSubviews={Platform.OS === "android" ? false : true}
        loadMinimal={Platform.OS === "android" ? false : true}
        buttonWrapperStyle={{
          backgroundColor: "transparent",
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          left: 0,
          flex: 1,
          paddingHorizontal: 30,
          paddingVertical: 20,
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
        showsButtons={true}
        loop={false}
        paginationStyle={{
          marginRight: w * 0.7,
          marginBottom: h * 0.02,
        }}
        activeDotColor={isDarkMode ? "#ffffff" : "#000000"}
        dotColor={isDarkMode ? "#666666" : "#cccccc"}
        nextButton={
          <View
            style={[
              styles.navButton,
              {
                backgroundColor: isDarkMode ? "#ffffff" : "#000000",
              },
            ]}
          >
            <AntDesign
              name="right"
              size={22}
              color={isDarkMode ? "#000000" : "#ffffff"}
            />
          </View>
        }
        prevButton={
          <View
            style={[
              styles.navButton,
              {
                backgroundColor: isDarkMode ? "#ffffff" : "#000000",
                marginHorizontal: 20,
              },
            ]}
          >
            <AntDesign
              name="left"
              size={22}
              color={isDarkMode ? "#000000" : "#ffffff"}
            />
          </View>
        }
      >
        {/* Slide 1 */}
        <View
          style={[
            styles.slide,
            { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <Image
            source={require("../assets/images/onboarding/onboarding1.png")}
            style={styles.img}
          />
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? "#ffffff" : "#000000" },
            ]}
          >
            Report Civic Issues
          </Text>
          <Text
            style={[styles.text, { color: isDarkMode ? "#cccccc" : "#666666" }]}
          >
            JANMARG empowers citizens to report civic issues in their community.
            From potholes to broken streetlights, help make your city better by
            reporting problems that need attention.
          </Text>
        </View>

        {/* Slide 2 */}
        <View
          style={[
            styles.slide,
            { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <Image
            source={require("../assets/images/onboarding/onboarding2.png")}
            style={styles.img}
          />
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? "#ffffff" : "#000000" },
            ]}
          >
            Search & Browse
          </Text>
          <Text
            style={[styles.text, { color: isDarkMode ? "#cccccc" : "#666666" }]}
          >
            Browse reports in your area and stay informed about ongoing issues.
            Use the search feature to find specific problems or filter by status
            to see what's being worked on.
          </Text>
        </View>

        {/* Slide 3 */}
        <View
          style={[
            styles.slide,
            { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <Image
            source={require("../assets/images/onboarding/onboarding3.png")}
            style={styles.img}
          />
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? "#ffffff" : "#000000" },
            ]}
          >
            Track & Engage
          </Text>
          <Text
            style={[styles.text, { color: isDarkMode ? "#cccccc" : "#666666" }]}
          >
            Track the progress of your reports and support others by upvoting
            important issues. View detailed information, see exact locations on
            maps, and stay updated on resolution status.
          </Text>
        </View>

        {/* Slide 4 - Final slide with finish button */}
        <View
          style={[
            styles.slide,
            { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <Image
            source={require("../assets/images/onboarding/onboarding4.png")}
            style={styles.img}
          />
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? "#ffffff" : "#000000" },
            ]}
          >
            Welcome to JANMARG
          </Text>
          <Text
            style={[styles.text, { color: isDarkMode ? "#cccccc" : "#666666" }]}
          >
            Start making a difference in your community today! Report issues,
            track progress, and collaborate with fellow citizens to build a
            better city for everyone.
          </Text>

          <TouchableOpacity
            style={[
              styles.finishButton,
              { backgroundColor: isDarkMode ? "#ffffff" : "#000000" },
            ]}
            onPress={handleFinish}
          >
            <Text
              style={[
                styles.finishButtonText,
                { color: isDarkMode ? "#000000" : "#ffffff" },
              ]}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Default fallback for Android
  },
  slide: {
    flex: 1,
    paddingTop: 80,
    marginHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    alignSelf: "center",
    borderBottomRightRadius: 80,
    borderTopLeftRadius: 80,
    height: h * 0.5,
    width: w * 0.9,
    resizeMode: "cover",
    backgroundColor: "transparent", // Ensure no background color on image
    ...(Platform.OS === "android" && {
      backgroundColor: "rgba(255, 255, 255, 0)", // Android-specific transparent background
    }),
  },
  title: {
    marginTop: 60,
    marginHorizontal: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 10,
    marginRight: 10,
  },
  navButton: {
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    width: 60,
    justifyContent: "center",
  },
  finishButton: {
    marginTop: 40,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignSelf: "center",
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
