import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { logger } from "../utils/logger";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const VALID_EMAIL = "abc@gmail.com";
  const VALID_PASSWORD = "abc123";

  logger.info("LoginScreen rendered");

  const handleLogin = () => {
    logger.info("Login attempt", { email: email ? "provided" : "empty" });
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      logger.info("Login successful, navigating to onboarding");
      router.push("./onboarding");
    } else {
      logger.warn("Login failed: invalid credentials", {
        email,
        passwordProvided: !!password,
      });
      Alert.alert(
        "Login Failed",
        "Invalid credentials. Please use the test credentials shown below.",
        [{ text: "OK" }]
      );
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={styles.backgroundImage}
        source={require("../assets/images/background.webp")}
      />

      {/* lights */}
      <View style={styles.lightsContainer}>
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          source={require("../assets/images/light.webp")}
          style={styles.lightLarge}
        />
        <Animated.Image
          entering={FadeInUp.delay(400).duration(1000).springify()}
          source={require("../assets/images/light.webp")}
          style={styles.lightSmall}
        />
      </View>

      {/* title and form */}
      <View style={styles.mainContent}>
        {/* title */}
        <View style={styles.titleContainer}>
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            style={styles.title}
          >
            Login
          </Animated.Text>
        </View>

        {/* form */}
        <View style={styles.formContainer}>
          {/* Test Credentials Display */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(1000).springify()}
            style={styles.credentialsContainer}
          >
            <Text style={styles.credentialsTitle}>Test Credentials:</Text>
            <Text style={styles.credentialsText}>Email: abc@gmail.com</Text>
            <Text style={styles.credentialsText}>Password: abc123</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            style={styles.inputContainer}
          >
            <TextInput
              placeholder="Email"
              placeholderTextColor={"gray"}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            style={styles.inputContainer}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor={"gray"}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
            style={styles.buttonContainer}
          >
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
            style={styles.linkContainer}
          >
            <Text>Don't have an account? </Text>
            <Link href="./signup" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>SignUp</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  lightsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
  },
  lightLarge: {
    height: 225,
    width: 90,
  },
  lightSmall: {
    height: 160,
    width: 65,
    opacity: 0.75,
  },
  mainContent: {
    height: "100%",
    width: "100%",
    justifyContent: "space-around",
    paddingTop: 160,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 48,
    letterSpacing: 2,
  },
  formContainer: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  credentialsContainer: {
    backgroundColor: "rgba(46, 106, 86, 0.9)",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  credentialsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  credentialsText: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
    marginBottom: 2,
  },
  inputContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    width: "100%",
    backgroundColor: "#2E6A56",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  linkText: {
    color: "#5C9479",
  },
});
