import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { firebase } from "../firebase/Config";
import Input from "./Input";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import User from "../entities/User";

function Registration({ handleSignUp }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <FontAwesome name="arrow-left" style={styles.backButton} size={24} />
      <View style={styles.regform}>
        <Text style={styles.header}>Registration</Text>
        <Input
          placeholder="First Name"
          placeholderTextColor="#b2b2b2"
          style={styles.input}
          styleInput={styles.inputMargin}
          onChange={setFirstName}
        ></Input>
        <Input
          placeholder="Last Name"
          placeholderTextColor="#b2b2b2"
          style={styles.input}
          styleInput={styles.inputMargin}
          onChange={setLastName}
        ></Input>
        <Input
          placeholder="Email"
          placeholderTextColor="#b2b2b2"
          style={styles.input}
          styleInput={styles.inputMargin}
          onChange={setEmail}
        ></Input>
        <Input
          placeholder="Phone Number"
          placeholderTextColor="#b2b2b2"
          style={styles.input}
          styleInput={styles.inputMargin}
          onChange={setPhoneNumber}
        ></Input>
        <TouchableOpacity
          title="Register"
          style={styles.registerButton}
          opacity={1}
          onPress={() => {
            handleSignUp(
              new User(null, firstName, lastName, phoneNumber, email, "Female"),
              "Password"
            );
          }}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function completeRegistration(user) {
  console.log(user);
}

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36485f",
    paddingLeft: 60,
    paddingRight: 60,
  },
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
