import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RegistrationForm from "./src/components/RegistrationForm";

export default function App() {
  return (
    <View style={styles.container}>
      <RegistrationForm />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36485f",
    paddingLeft: 60,
    paddingRight: 60,
  },
});
