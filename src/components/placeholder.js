import React, { Component } from 'react'
import { View, Text } from 'react-native'
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDXMa9vxHULALyO_VUDrxB_s9a218_sP9A",
  authDomain: "bookspokedex-dev.firebaseapp.com",
  databaseURL: "https://bookspokedex-dev.firebaseio.com",
  projectId: "bookspokedex-dev",
  storageBucket: "bookspokedex-dev.appspot.com",
  messagingSenderId: "1037107596623",
  appId: "1:1037107596623:web:a2f1831a585b55ad51493a",
  measurementId: "G-KXX28XTJM3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();

class HttpExample extends Component {
   state = {
      data: ''
   }
   componentDidMount = () => {
           database.collection('users').doc('s7Ou2OrTBKZ7Hu90QsWa').get()
      .then(response => {
          console.log(response.data())
        this.setState({
            data: response.data
         })
      })
      .catch(error => {
          console.error(error);
        // setError(error);
      });
    //   fetch('https://jsonplaceholder.typicode.com/posts/1', {
    //      method: 'GET'
    //   })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //      console.log(responseJson);
    //      this.setState({
    //         data: responseJson
    //      })
    //   })
    //   .catch((error) => {
    //      console.error(error);
    //   });
   }
   render() {
      return (
         <View>
            <Text>
               {this.state.data}
            </Text>
         </View>
      )
   }
}
export default HttpExample