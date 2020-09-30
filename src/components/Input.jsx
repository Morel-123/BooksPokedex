import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";

export default class Input extends Component {
  render() {
    return (
      <View>
        <TextInput
          id="standard-basic"
          label="Standard"
          style={styles.textinput}
          placeholder="אימייל"
        ></TextInput>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textinput: {
    alignSelf: "stretch",
    height: 40,
    marginBottom: 30,
    color: "#fff",
    borderBottomColor: "#f8f8f8",
    borderBottomWidth: 1,
    textAlign: "right",
  },
});
