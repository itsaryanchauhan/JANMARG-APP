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

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  logger.info("SignupScreen rendered");

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      logger.info("Signup attempt", { email, username });

      const result = await AuthService.signup({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      logger.info("Signup successful", { userId: result.user.id });
      Alert.alert(
        "Success",
        "Account created successfully! Please check your email to verify your account.",
        [
          {
            text: "OK",
            onPress: () => router.push("./login"),
          },
        ]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      logger.error("Signup failed", error);
      Alert.alert("Signup Failed", errorMessage);
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
            SignUp
          </Animated.Text>
        </View>

        {/* form */}
        <View style={styles.formContainer}>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            style={styles.inputContainer}
          >
            <TextInput
              placeholder="Username"
              placeholderTextColor={"gray"}
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
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
            entering={FadeInDown.delay(600).duration(1000).springify()}
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
            entering={FadeInDown.delay(800).duration(1000).springify()}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>SignUp</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(1000).duration(1000).springify()}
            style={styles.linkContainer}
          >
            <Text>Already have an account? </Text>
            <Link href="./login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Login</Text>
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
    color: "#2E6A56",
  },
});
