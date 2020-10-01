import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";

function Input(props) {
  return (
    <View style={props.styleInput}>
      <TextInput
        id="standard-basic"
        label="Standard"
        style={styles.textinput}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
      ></TextInput>
    </View>
  );
}

/*
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 30,
*/

export default Input;

const styles = StyleSheet.create({
  textinput: {
    alignSelf: "stretch",
    height: 40,
    color: "#fff",
    borderBottomColor: "#f8f8f8",
    borderBottomWidth: 1,
  },
});
