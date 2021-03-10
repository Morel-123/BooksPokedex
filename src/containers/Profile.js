import React, { useEffect } from "react";
import { Text, View, Button, Image } from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/Auth";
import { COLORS, FONTS, SIZES, icons } from "../constants";

function Profile(props) {
  const dispatch = useDispatch();
  const expoPushToken = useSelector((state) => state.auth.expoPushToken);

  useEffect(() => {}, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(authActions.logout());
      })
      .catch((error) => console.log(error.message));
  };

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { data: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
      }}
    >
      <Button title="Log Out" onPress={handleLogout} color="#f96d41" />
    </View>
  );
}

export default Profile;
