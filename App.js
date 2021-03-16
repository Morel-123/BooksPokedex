import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { COLORS, FONTS, SIZES, icons } from "./src/constants";
import { StatusBar } from "react-native";

// import the different screens
import Loading from "./src/containers/Loading";
import Signup from "./src/containers/Signup";
import Login from "./src/containers/Login";
import RevampedLogin from "./src/containers/RevampedLogin";
import MainNavigator from "./src/containers/MainNavigator";

import authReducer from "./src/reducers/Auth";
import booksReducer from "./src/reducers/Books";
import socialReducer from "./src/reducers/Social";

const rootReducer = combineReducers({
  auth: authReducer,
  books: booksReducer,
  social: socialReducer,
});
export const store = createStore(rootReducer);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Loading,
      Signup,
      RevampedLogin,
      MainNavigator,
    },
    {
      initialRouteName: "Loading",
    }
  )
);

export default class App extends React.Component {
  async componentDidMount() {
    await this.loadAssetsAsync();
  }

  loadAssetsAsync = async () => {
    await Font.loadAsync({
      "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
      "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
      "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    });
    await Asset.fromModule(require("./assets/logo.png")).downloadAsync();
  };

  render() {
    return (
      <Provider store={store}>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={COLORS.black}
          translucent={true}
        />
        <AppContainer />
      </Provider>
    );
  }
}
