import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as authActions from "../actions/Auth";
import User from "../entities/User";
import RegistrationForm from "../components/RegistrationForm";

function Signup(props) {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const database = firebase.firestore();

  const handleSignUp = async (user, inputPassword) => {
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
          })
          .then(function () {
            console.log("Document successfully written!");
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
            // props.navigation.navigate("Main");
            console.log("navigated to main");
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.log(error.message);
      });
  };

  return <RegistrationForm handleSignUp={handleSignUp.bind(this)} />;
}

export default Signup;
