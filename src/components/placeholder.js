import React, { Component } from "react";
import { View, Text } from "react-native";
import { firebase } from '../firebase/config';

// Initialize Firebase
const database = firebase.firestore();

class HttpExample extends Component {
  state = {
    data: "",
  };
  componentDidMount = () => {
    database
      .collection("users")
      .doc("s7Ou2OrTBKZ7Hu90QsWa")
      .get()
      .then((response) => {
        console.log(response.data());
        this.setState({
          data: response.data(),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  render() {
    return (
      <View>
        <Text>{this.state.data.lastName}</Text>
      </View>
    );
  }
}
export default HttpExample;
