import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";

function Book(props) {
  const dispatch = useDispatch();
  const database = firebase.firestore();
  let book = useSelector((state) => state.books.selectedBook);

  useEffect(() => {}, []);

  const handleBack = () => {
    props.navigation.navigate("My Books");
  };

  return (
    <View style={styles.container}>
      <Text>Book Info</Text>
      <Text>{book.authors[0]}</Text>
      <Image
        style={{ height: 200, width: 200 }}
        source={{
          uri: book.imageLinks.thumbnail,
        }}
        resizeMode="contain"
      />
      <Button title="Go Back" onPress={handleBack} />
    </View>
  );
}

export default Book;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
