import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AuthService } from "../services/authService";
import { logger } from "../utils/logger";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  logger.info("LoginScreen rendered");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      logger.info("Login attempt", { email: email ? "provided" : "empty" });

      const result = await AuthService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      logger.info("Login successful", { userId: result.user.id });
      router.push("./onboarding");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      logger.error("Login failed", error);
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={styles.backgroundImage}
        source={require("../assets/images/background.png")}
      />

      {/* lights */}
      <View style={styles.lightsContainer}>
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          source={require("../assets/images/light.png")}
          style={styles.lightLarge}
        />
        <Animated.Image
          entering={FadeInUp.delay(400).duration(1000).springify()}
          source={require("../assets/images/light.png")}
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
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
            style={styles.linkContainer}
          >
            <Text>Don&apos;t have an account? </Text>
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
  buttonDisabled: {
    opacity: 0.6,
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
