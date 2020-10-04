import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";


function Input({ styleInput, placeholder, placeholderTextColor, onChange }) {
  return (
    <View style={styleInput}>
      <TextInput
        id="standard-basic"
        label="Standard"
        style={styles.textinput}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onChange={(e) => onChange(e.target.value)}
      ></TextInput>
    </View>
  );
}

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
