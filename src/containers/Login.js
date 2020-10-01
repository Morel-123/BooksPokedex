import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as authActions from "../actions/Auth";
import { Card, ListItem, Button, Input, Icon } from "react-native-elements";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const database = firebase.firestore();

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        let uid = firebase.auth().currentUser.uid;
        database
          .collection("users")
          .doc(uid)
          .get()
          .then(function (response) {
            dispatch(authActions.login(uid, response.data()));
            props.navigation.navigate("Main");
          })
          .catch(function (error) {});
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <View style={styles.loginContainer}>
      <ImageBackground
        resizeMode={"cover"}
        style={styles.loginBackground}
        source={require("../../assets/books.jpg")}
      ></ImageBackground>
      <TouchableOpacity
        title="Sign Up"
        style={styles.signUpButtonWrapper}
        opacity={1}
        onPress={() => props.navigation.navigate("SignUp")}
      >
        <Text style={styles.signUpButton}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../../assets/logo.png")} />
        <Text style={styles.logoText}>Log In To BookDex</Text>
      </View>
      <View style={styles.loginInnerContainer}>
        <Card>
          {/* <Card.Title>Login</Card.Title> */}
          {/* <Card.Divider /> */}
          <View style={styles.container}>
            <Input
              placeholder="Email"
              onChangeText={(email) => setEmail(email)}
              containerStyle={{ marginBottom: 20 }}
            />
            <Input
              placeholder="Password"
              secureTextEntry={!showPassword}
              onChangeText={(password) => setPassword(password)}
              containerStyle={{ marginBottom: 20 }}
              rightIcon={
                showPassword ? (
                  <Icon
                    name="eye"
                    type="font-awesome"
                    onPress={() => setShowPassword(false)}
                  />
                ) : (
                  <Icon
                    name="eye-slash"
                    type="font-awesome"
                    onPress={() => setShowPassword(true)}
                  />
                )
              }
            />
            <Button
              title="Login"
              buttonStyle={{ width: "75vw", borderRadius: "25px" }}
            />
          </View>
        </Card>
      </View>
    </View>
    // <View style={styles.container}>
    //   <Text>Login</Text>
    //   {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
    //   <TextInput
    //     style={styles.textInput}
    //     autoCapitalize="none"
    //     placeholder="Email"
    //     onChangeText={(email) => setEmail(email)}
    //     value={email}
    //   />
    //   <TextInput
    //     secureTextEntry
    //     style={styles.textInput}
    //     autoCapitalize="none"
    //     placeholder="Password"
    //     onChangeText={(password) => setPassword(password)}
    //     value={password}
    //   />
    //   <Button title="Login" onPress={handleLogin} />
    //   <Button
    //     title="Don't have an account? Sign Up"
    //     onPress={() => props.navigation.navigate("SignUp")}
    //   />
    // </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
  },
  loginButton: {
    borderRadius: "25px",
    width: "75vw",
  },
  loginContainer: {
    height: "100%",
    position: "relative",
  },
  loginInnerContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  loginBackground: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  signUpButton: {
    borderBottomColor: "#0000007a",
    borderBottomWidth: 1,
    fontSize: "18px",
  },
  signUpButtonWrapper: {
    alignSelf: "flex-start",
    position: "absolute",
    top: "5px",
    right: "5px",
    zIndex: 1,
  },
  logo: {
    resizeMode: "cover",
    width: 150,
    height: 100,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoContainer: {
    position: "absolute",
    zIndex: 1,
    left: "calc(50% - 75px)",
    top: 60,
  },
});
