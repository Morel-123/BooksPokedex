import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
// import the different screens
import Signup from "./src/containers/Signup";
import authReducer from "./src/reducers/Auth";

const rootReducer = combineReducers({
  auth: authReducer,
});
let store = createStore(rootReducer);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Signup,
    },
    {
      initialRouteName: "Signup",
    }
  )
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}


