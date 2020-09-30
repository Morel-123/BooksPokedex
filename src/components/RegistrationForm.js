import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default class Registration extends React.Component {
  render() {
    return (
      <View style={styles.regform}>
        <Text style={styles.header}>הרשמה</Text>
        <TextInput
          style={styles.textinput}
          placeholder="שם מלא"
          underlineColorAndroid={"transparent"}
        ></TextInput>

        <TextInput
          style={styles.textinput}
          placeholder="אימייל"
          underlineColorAndroid={"transparent"}
        ></TextInput>

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
  textinput: {
    alignSelf: "stretch",
    height: 40,
    marginBottom: 30,
    color: "#fff",
    borderBottomColor: "#f8f8f8",
    borderBottomWidth: 1,
    textAlign: 'right',
  },
});
