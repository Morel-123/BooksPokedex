import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as authActions from "../actions/Auth";
import { Card, ListItem, Button, Input, Icon } from "react-native-elements";
import { useForm, Controller } from "react-hook-form";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const database = firebase.firestore();
  const { control, handleSubmit, errors, register } = useForm({
    mode: "onTouched",
  });
  const onSubmit = (data) => {
    console.log(data);
    console.log(isEmailAddressValid(email));
  };

  const isEmailAddressValid = (input) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      input
    );
  };

  const handleLogin = (data) => {
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
            dispatch(authActions.login(response.data()));
            props.navigation.navigate("Main");
          })
          .catch((error) => setErrorMessage(error.message));
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
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={{
                    height: 40,
                    fontSize: 18,
                    borderBottom: "1px solid #86939e",
                  }}
                  placeholder="Email"
                  onChangeText={(email) => {
                    onChange(email);
                    setEmail(email);
                  }}
                  onBlur={onBlur}
                  value={value}
                />
                {errors.email && errors.email.type === "required" && (
                  <Text style={styles.errorMessage}>Email is required.</Text>
                )}
                {errors.email && errors.email.type === "validate" && (
                  <Text style={styles.errorMessage}>
                    Please provide a valid email.
                  </Text>
                )}
              </View>
            )}
            name="email"
            rules={{
              required: true,
              validate: (value) => isEmailAddressValid(value),
            }}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={{
                    height: 40,
                    fontSize: 18,
                    borderBottom: "1px solid #86939e",
                  }}
                  placeholder="Password"
                  onChangeText={(password) => {
                    onChange(password);
                    setPassword(password);
                  }}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={!showPassword}
                />
                {errors.password && errors.password.type === "required" && (
                  <Text style={styles.errorMessage}>Password is required.</Text>
                )}
                {errors.password && errors.password.type === "minLength" && (
                  <Text style={styles.errorMessage}>
                    Password must be at least 6 characters long.
                  </Text>
                )}
                {showPassword ? (
                  <Icon
                    name="eye"
                    type="font-awesome"
                    containerStyle={{
                      height: 24,
                      position: "absolute",
                      top: 8,
                      right: 0,
                    }}
                    onPress={() => setShowPassword(false)}
                  />
                ) : (
                  <Icon
                    name="eye-slash"
                    type="font-awesome"
                    containerStyle={{
                      height: 24,
                      position: "absolute",
                      top: 8,
                      right: 0,
                    }}
                    onPress={() => setShowPassword(true)}
                  />
                )}
              </View>
            )}
            name="password"
            rules={{
              required: true,
              minLength: 6,
            }}
            defaultValue=""
          />
          <Button
            title="Login"
            buttonStyle={{
              width: Dimensions.get("window").width * 0.75,
              borderRadius: 25,
              alignSelf: "center",
            }}
            onPress={handleSubmit(handleLogin)}
          />
        </Card>
      </View>
    </View>
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
    borderRadius: 25,
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
    fontSize: 18,
  },
  signUpButtonWrapper: {
    alignSelf: "flex-start",
    position: "absolute",
    top: "3%",
    right: "3%",
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
    left: Dimensions.get("window").width / 2 - 75,
    top: 80,
  },
  errorMessage: {
    color: "red",
  },
  inputContainer: {
    marginBottom: 20,
    height: 60,
    position: "relative",
  },
  passwordIcon: {
    height: 24,
    position: "absolute",
    top: 8,
    right: 0,
  },
});
