import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import RegistrationForm from "./src/components/RegistrationForm";
import { AuthContextProvider } from "./src/contexts/AuthContext";

export default function App() {
  return (
    <View style={styles.container}>
      <AuthContextProvider>
        <RegistrationForm />
      </AuthContextProvider>
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
