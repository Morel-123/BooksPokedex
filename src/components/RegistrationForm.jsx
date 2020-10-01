import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import Input from "./Input";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import User from "../entities/User";
import { AuthContext } from "../contexts/AuthContext";

function Registration() {
  const { user, completeRegistration, cancelRegistration } = useContext(
    AuthContext
  );

  return (
    <View>
      <FontAwesome name="arrow-left" style={styles.backButton} size={24} />
      <View style={styles.regform}>
        <Text style={styles.header}>Registration</Text>
        <Input
          placeholder="Full Name"
          placeholderTextColor="#b2b2b2"
          style={styles.input}
          styleInput={styles.inputMargin}
        ></Input>
        <Input
          placeholder="Email"
          placeholderTextColor="#b2b2b2"
          styleInput={styles.inputMargin}
        ></Input>
        <TouchableOpacity
          title="Register"
          style={styles.registerButton}
          opacity={1}
          onPress={() =>
            completeRegistration(
              new User(
                "3",
                "orel",
                "zilberman",
                "0543333333",
                "orelsmail@gmail.com"
              )
            )
          }
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Registration;

const styles = StyleSheet.create({
  regform: {
    alignSelf: "stretch",
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    paddingBottom: 10,
    marginBottom: 40,
    alignSelf: "center",
    // borderBottomColor: "#19918740",
    // borderBottomWidth: 1,
  },
  input: {
    marginLeft: 40,
    marginRight: 40,
  },
  backButton: {
    marginTop: 20,
    color: "#fff",
  },
  registerButton: {
    width: "auto",
    height: "auto",
    backgroundColor: "#2288dc",
    marginLeft: 40,
    marginRight: 40,
    marginTop: 30,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "#2f2f2f 0px 0px 11px 0px",
  },
  registerButtonText: {
    // color: "#124671",
    color: "#d4f4f3",
    alignSelf: "center",
    fontWeight: "bold",
  },
  inputMargin: {
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 30,
  },
});
