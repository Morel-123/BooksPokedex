import React, { useState, useEffect } from "react";
import { StyleSheet, Platform, Image, Text, View, Button } from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/auth";

function Main(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const uid = useSelector((state) => state.auth.userID);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setCurrentUser(firebase.auth().currentUser);
  }, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(authActions.logout());
        props.navigation.navigate("Loading");
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>
        Hi {currentUser && currentUser.email}! {uid}
      </Text>
      <Text>
        Hi {user && user.firstName} {user && user.lastName}
      </Text>
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
