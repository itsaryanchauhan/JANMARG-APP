import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import Tabs from "../navigation/tabs";

export default function HomeWithTabs() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Tabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
