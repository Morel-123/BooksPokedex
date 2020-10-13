import React, { useState, useEffect } from "react";
import { StyleSheet, Platform, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import { createStackNavigator } from "@react-navigation/stack";
import UserCollection from "./UserCollection";
import Book from "./Book";
import MyTabs from "./BottomNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableRipple } from "react-native-paper";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { firebase } from "../firebase/Config";

const Stack = createStackNavigator();

function MainNavigator(props) {

  useEffect(() => {
  }, []);


  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

    switch (routeName) {
      case "Home":
        return "Home";
      case "Collection":
        return "My Collection";
      case "Profile":
        return "My Profile";
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        headerMode="screen"
        screenOptions={{
          headerStyle: { backgroundColor: "#ff4336" },
          headerTitleStyle: { color: "white", fontSize: 24 },
          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
          })}
        />
        <Stack.Screen
          name="Book Info"
          component={Book}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;

const styles = StyleSheet.create({
  rightIconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 120,
    marginRight: 5,
  },
  roundIcon: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
