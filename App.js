import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
// import the different screens
import Loading from "./src/containers/Loading";
import SignUp from "./src/containers/Signup";
import Login from "./src/containers/Login";
import MainNavigator from "./src/containers/MainNavigator";

import authReducer from "./src/reducers/Auth";
import booksReducer from "./src/reducers/Books";

const rootReducer = combineReducers({
  auth: authReducer,
  books: booksReducer,
});
export const store = createStore(rootReducer);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Loading,
      SignUp,
      Login,
      MainNavigator,
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
