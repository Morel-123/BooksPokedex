import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Input from "./Input";

export default class Registration extends React.Component {
  render() {
    return (
      <View style={styles.regform}>
        <Text style={styles.header}>הרשמה</Text>
        <Input
          id="standard-basic"
          label="Standard"
          style={styles.textinput}
          placeholder="שם מלא"
        ></Input>
        <Input
          id="standard-basic"
          label="Standard"
          style={styles.textinput}
          placeholder="אימייל"
        ></Input>
      </View>
    );
  }
}

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
    borderBottomColor: "#199187",
    borderBottomWidth: 1,
  },
});
