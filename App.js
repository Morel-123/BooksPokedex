import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
// import the different screens
import Loading from "./src/containers/Loading";
import SignUp from "./src/containers/Signup";
import Login from "./src/containers/Login";
import Main from "./src/containers/Main";

import authReducer from "./src/reducers/Auth";

const rootReducer = combineReducers({
  auth: authReducer,
});
let store = createStore(rootReducer);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Loading,
      SignUp,
      Login,
      Main,
    },
    {
      initialRouteName: "Loading",
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
