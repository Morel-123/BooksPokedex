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
      {/* <Text>Book Info</Text> */}
      <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Image
          style={{ height: 220, width: 150, marginLeft: 10, marginRight: 5 }}
          source={{
            uri: book.imageLinks.thumbnail,
          }}
          resizeMode="stretch"
        />
        <View style={{ display: "flex", width: "55%" }}>
          <Text style={{ fontSize: 24, textAlign: "center", color: "#212121", fontWeight: "bold" }}>
            {book.title}
          </Text>
          <Text style={{ fontSize: 16, textAlign: "center", color: "#757575" }}>
            {book.authors[0]}
          </Text>
        </View>
      </View>
      <View style={styles.extraInfoWrapper}>
        <View style={styles.extraInfoContainer}>
          <View style={styles.extraInfoDetailContainer}>
            <Text style={[styles.extraInfoDetailText, styles.extraInfoDetailTitle]}>Genre</Text>
            <Text style={[styles.extraInfoDetailText, styles.extraInfoDetailValue]}>{book.categories[0]}</Text>
          </View>
          <View style={styles.extraInfoDetailContainer}>
            <Text style={[styles.extraInfoDetailText, styles.extraInfoDetailTitle]}>Pages</Text>
            <Text style={[styles.extraInfoDetailText, styles.extraInfoDetailValue]}>{book.pageCount}</Text>
          </View>
          <View style={styles.extraInfoDetailContainer}>
            <Text style={[styles.extraInfoDetailText, styles.extraInfoDetailTitle]}>Released</Text>
            <Text style={[styles.extraInfoDetailText, styles.extraInfoDetailValue]}>{book.publishedDate.substring(0, 4)}</Text>
          </View>
        </View>
      </View>
      {/* <Text>{book.authors[0]}</Text> */}
      {/* <Text>{book.description}</Text> */}
      {/* <Text>{book.averageRating}</Text> */}
      {/* <Text>{book.categories[0]}</Text> */}
      {/* <Text>{book.pageCount}</Text> */}
      {/* <Text>{book.publishedDate.substring(0, 4)}</Text> */}
      {/* <Image
        style={{ height: 200, width: 200 }}
        source={{
          uri: book.imageLinks.thumbnail,
        }}
        resizeMode="contain"
      /> */}
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
  extraInfoWrapper: {
    width: "100%",
    height: "12%",
    display: "flex",
    alignItems: "center",
  },
  extraInfoContainer: {
    width: "95%",
    height: "100%",
    backgroundColor: "#f44336",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    marginTop: 5,
  },
  extraInfoDetailContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // textAlign: "center",
  },
  extraInfoDetailText: {
    color: "white",
  },
  extraInfoDetailTitle: {
    fontSize: 16,
    color: "white"
  },
  extraInfoDetailValue: {
    fontSize: 20,
    fontWeight: "bold",
  }
});
