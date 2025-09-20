import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Tabs from "../navigation/tabs";
import { LanguageProvider } from "../context/LanguageContext";

export default function HomeWithTabs() {
  const insets = useSafeAreaInsets();

  return (
    <LanguageProvider>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="auto" />
        <Tabs />
      </View>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
