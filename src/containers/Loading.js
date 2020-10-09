import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/Auth";
import Spinner from "../components/Spinner";

function Loading(props) {
  const dispatch = useDispatch();
  const database = firebase.firestore();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        database
          .collection("users")
          .doc(user.uid)
          .get()
          .then(function (response) {
            dispatch(authActions.login(response.data()));
            props.navigation.navigate("MainNavigator");
          })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        props.navigation.navigate("Login");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Loading</Text>
      <Spinner
        size={Platform.OS === "android" ? 10 : "large"}
        color={Platform.OS === "android" ? "#448aff" : undefined}
      />
    </View>
  );
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
