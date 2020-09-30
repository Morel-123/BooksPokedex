import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as authActions from "../actions/auth";
import { Card, ListItem, Button, Icon } from 'react-native-elements'

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(authActions.login(firebase.auth().currentUser.uid));
        props.navigation.navigate("Main");
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <View style={styles.container}>
        <Text>Login</Text>
        {errorMessage && (
          <Text style={{ color: "red" }}>{errorMessage}</Text>
        )}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          value={email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          value={password}
        />
        <Button title="Login" onPress={handleLogin} />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => props.navigation.navigate("SignUp")}
        />
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
});
