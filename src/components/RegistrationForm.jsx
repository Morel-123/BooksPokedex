import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground } from "react-native";
import Input from "./Input";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import User from "../entities/User";

function Registration({ isPasswordSignup, handleSignUp, handleGoogleAuthentication }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("Female");
  const [password, setPassword] = useState(null);

  return (
    <View style={styles.container}>
      <FontAwesome name="arrow-left" style={styles.backButton} size={24} />
      <View style={styles.regform}>
        <Text style={styles.header}>Registration</Text>
        <Text style={styles.genderTitle}>Who are you?</Text>
        <View style={styles.genderIconsContainer}>
          <TouchableOpacity style={(gender == "Male") ? styles.noOpacity : styles.opacity}
            onPress={() => {
              setGender("Male");
            }}>
            <ImageBackground
              style={styles.maleIcon}
              resizeMode={"cover"}
              source={require("../../assets/icons/actor.png")}>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity style={(gender == "Female") ? styles.noOpacity : styles.opacity}
            onPress={() => {
              setGender("Female")
            }}>
            <ImageBackground
              style={styles.femaleIcon}
              resizeMode={"cover"}
              source={require("../../assets/icons/actress.png")}>
            </ImageBackground>
          </TouchableOpacity>
        </View>
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
        {isPasswordSignup ? <Input
          placeholder="Password"
          placeholderTextColor="#b2b2b2"
          style={styles.input}
          styleInput={styles.inputMargin}
          onChange={setPassword}
        ></Input> : null}
        {isPasswordSignup ? <Input
          placeholder="Re-enter password"
          placeholderTextColor="#b2b2b2"
          style={styles.input}
          styleInput={styles.inputMargin}
          onChange={setPassword}
        ></Input> : null}
        <TouchableOpacity
          title="Register"
          style={styles.registerButton}
          opacity={1}
          onPress={() => {
            handleSignUp(
              new User(null, firstName, lastName, phoneNumber, email, gender),
              password
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
    height: "100%",
    width: "100%",
  },
  regform: {
    alignSelf: "stretch",
    marginTop: 10,
  },
  header: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 10,
    marginTop: 50,
    alignSelf: "center",
  },
  opacity: {
    opacity: 0.3
  },
  noOpacity: {
    opacity: 1
  },
  genderTitle: {
    color: "#fdfdfd30",
    width: "100%",
    textAlign: "center",
  },
  genderIconsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  maleIcon: {
    height: 75,
    width: 75,
    marginRight: 20,
    backgroundColor: "#0e94a0",
    borderRadius: 10,
  },
  femaleIcon: {
    height: 75,
    width: 75,
    marginLeft: 20,
    backgroundColor: "#eb7735",
    borderRadius: 10,
  },
  input: {
    marginLeft: 40,
    marginRight: 40,
  },
  backButton: {
    marginTop: 20,
    color: "#fff",
    position: "absolute",
    left: 20,
    top: 20,
  },
  registerButton: {
    width: "auto",
    height: "auto",
    backgroundColor: "#2288dc",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1
  },
  registerButtonText: {
    color: "#d4f4f3",
    alignSelf: "center",
    fontWeight: "bold",
  },
  inputMargin: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
  },
});
