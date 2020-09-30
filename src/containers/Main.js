import React, { useState, useEffect } from "react";
import { StyleSheet, Platform, Image, Text, View, Button } from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as authActions from "../actions/auth";

function Main(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentUser(firebase.auth().currentUser);
  }, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: authActions.LOGOUT});
        props.navigation.navigate("Loading");
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>Hi {currentUser && currentUser.email}!</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
