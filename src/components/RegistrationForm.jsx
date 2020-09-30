import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Input from "./Input";
import { Button } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import IonIcon from "react-native-vector-icons/Ionicons";

function Registration(props) {
  return (
    <View style={styles.regform}>
      <Text style={styles.header}>הרשמה</Text>
      <Input placeholder="שם מלא" placeholderTextColor="#b2b2b2"></Input>
      <Input placeholder="אימייל" placeholderTextColor="#b2b2b2"></Input>
      <Button iconRight title="הירשם" style={styles.registerButton}></Button>
    </View>
  );
}

export default Registration;

const styles = StyleSheet.create({
  regform: {
    alignSelf: "stretch",
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: "#19918740",
    borderBottomWidth: 1,
  },
  registerButton: {
    color: "#fff",
    marginLeft: 10,
    marginTop: 30,
  },
});
