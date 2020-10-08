import React, { useEffect } from "react";
import { Text, View, Button } from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as authActions from "../actions/Auth";

function Profile(props) {
  const dispatch = useDispatch();

  useEffect(() => {
  }, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(authActions.logout());
        // props.navigation.navigate("Loading");
      })
      .catch((error) => console.log(error.message));
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile!</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

export default Profile;