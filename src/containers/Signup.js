import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { firebase, firebaseAuth } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as authActions from "../actions/Auth";
import User from "../entities/User";
import RegistrationForm from "../components/RegistrationForm";
import RevampedRegistrationForm from "../components/RevampedRegistrationForm";

function Signup(props) {
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const database = firebase.firestore();

  const handleOnBackPress = () => {
    props.navigation.navigate("RevampedLogin");
  }

  const handleSignUp = (user, inputPassword) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, inputPassword)
      .then(() => {
        let uid = firebase.auth().currentUser.uid;
        database
          .collection("users")
          .doc(uid)
          .set({
            uid: uid,
            firstName: user.firstName,
            lastName: user.lastName,
            userPhoneNumber: user.phoneNumber,
            userEmail: user.email,
            gender: user.gender,
            favoriteBooks: [],
            collection: [],
            readingList: [],
            friends: [],
            expoPushToken: null,
          })
          .then(function () {
            dispatch({
              type: authActions.SIGNUP,
              user: new User(
                uid,
                user.firstName,
                user.lastName,
                user.phoneNumber,
                user.email,
                user.gender
              ),
            });
            props.navigation.navigate("MainNavigator");
          })
          .catch(function (error) {
            console.log(error)
            setErrorMessage(error.message);
          });
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
      });
  };

  const handleGoogleAuthentication = () => {
    const firebaseAuth = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(firebaseAuth)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
  };

  return (
    <RevampedRegistrationForm
      isPasswordSignup={true}
      handleSignUp={handleSignUp}
      handleGoogleAuthentication={handleGoogleAuthentication}
      handleOnBackPress={handleOnBackPress}
    />
  );
}

export default Signup;
