"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNavigation = require("react-navigation");

var _loading = _interopRequireDefault(require("./src/containers/loading"));

var _signup = _interopRequireDefault(require("./src/containers/signup"));

var _login = _interopRequireDefault(require("./src/containers/login"));

var _main = _interopRequireDefault(require("./src/containers/main"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import HttpExample from './src/components/placeholder';
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <HttpExample/>
//       <StatusBar style="auto" />
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
// create our app’s navigation stack
var _default = (0, _reactNavigation.createAppContainer)((0, _reactNavigation.createSwitchNavigator)({
  Loading: _loading["default"],
  SignUp: _signup["default"],
  Login: _login["default"],
  Main: _main["default"]
}, {
  initialRouteName: 'Loading'
}));

exports["default"] = _default;