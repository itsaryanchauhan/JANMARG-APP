import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import Swiper from "react-native-swiper";
import { logger } from "../utils/logger";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function OnboardingScreen() {
  const isDarkMode = useColorScheme() === "dark";
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const swiperRef = useRef<Swiper>(null);

  logger.info("OnboardingScreen rendered");

  const handleFinish = () => {
    logger.info("Onboarding finished, navigating to home");
    router.push("./home");
  };

  const handleNext = () => {
    swiperRef.current?.scrollBy(1);
  };

  const handlePrev = () => {
    swiperRef.current?.scrollBy(-1);
  };

  // Calculate responsive dimensions
  const imageWidth = Math.min(width * 0.85, 350);
  const imageHeight = Math.min(height * 0.35, 280);
  const titleFontSize = Math.max(width * 0.06, 24);
  const textFontSize = Math.max(width * 0.04, 14);
  const buttonSize = Math.max(width * 0.12, 50);

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
    <View style={styles.swiperContainer}>
      <Swiper
        style={{ backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }}
        removeClippedSubviews={Platform.OS === "android" ? false : true}
        loadMinimal={Platform.OS === "android" ? false : true}
        showsButtons={false}
        loop={false}
        paginationStyle={{
          bottom: 20,
        }}
        activeDotColor={isDarkMode ? "#ffffff" : "#000000"}
        dotColor={isDarkMode ? "#666666" : "#cccccc"}
        ref={(ref) => { swiperRef.current = ref; }}
      >
        {/* Slide 1 */}
        <View
          style={[
            styles.slide,
            { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" },
          ]}
        >
          <Image
            source={require("../assets/images/onboarding/onboarding1.webp")}
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
            source={require("../assets/images/onboarding/onboarding2.webp")}
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
            source={require("../assets/images/onboarding/onboarding3.webp")}
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
            source={require("../assets/images/onboarding/onboarding4.webp")}
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

      {/* Custom Navigation Buttons */}
      <TouchableOpacity
        style={[
          styles.navButton,
          {
            backgroundColor: isDarkMode ? "#ffffff" : "#000000",
            position: "absolute",
            bottom: 20,
            right: 20 + buttonSize + 15,
            width: buttonSize,
            height: buttonSize,
          },
        ]}
        onPress={handlePrev}
      >
        <AntDesign
          name="left"
          size={buttonSize * 0.35}
          color={isDarkMode ? "#000000" : "#ffffff"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          {
            backgroundColor: isDarkMode ? "#ffffff" : "#000000",
            position: "absolute",
            bottom: 20,
            right: 20,
            width: buttonSize,
            height: buttonSize,
          },
        ]}
        onPress={handleNext}
      >
        <AntDesign
          name="right"
          size={buttonSize * 0.35}
          color={isDarkMode ? "#000000" : "#ffffff"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Default fallback for Android
  },
  swiperContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    paddingTop: Math.max(screenHeight * 0.08, 60),
    paddingHorizontal: Math.max(screenWidth * 0.08, 20),
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    alignSelf: "center",
    borderBottomRightRadius: 80,
    borderTopLeftRadius: 80,
    height: screenHeight * 0.35,
    width: screenWidth * 0.85,
    maxHeight: 280,
    maxWidth: 350,
    resizeMode: "cover",
    backgroundColor: "transparent",
    ...(Platform.OS === "android" && {
      backgroundColor: "rgba(255, 255, 255, 0)",
    }),
  },
  title: {
    marginTop: Math.max(screenHeight * 0.06, 40),
    marginHorizontal: Math.max(screenWidth * 0.05, 10),
    fontSize: Math.max(screenWidth * 0.07, 24),
    fontWeight: "bold",
  },
  text: {
    marginTop: Math.max(screenHeight * 0.02, 15),
    fontSize: Math.max(screenWidth * 0.04, 14),
    lineHeight: Math.max(screenWidth * 0.055, 20),
    marginHorizontal: Math.max(screenWidth * 0.05, 10),
    textAlign: "center",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25, // Make buttons circular
  },
  finishButton: {
    marginTop: Math.max(screenHeight * 0.04, 30),
    paddingHorizontal: Math.max(screenWidth * 0.08, 24),
    paddingVertical: Math.max(screenHeight * 0.02, 12),
    borderRadius: 25,
    alignSelf: "center",
  },
  finishButtonText: {
    fontSize: Math.max(screenWidth * 0.045, 16),
    fontWeight: "bold",
  },
});
