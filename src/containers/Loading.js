import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/Auth";
import * as booksActions from "../actions/Books";
import * as socialActions from "../actions/Social";
import Spinner from "../components/Spinner";
import { COLORS } from "../constants";

const Pulse = require("react-native-pulse").default;

function Loading(props) {
  const dispatch = useDispatch();
  const database = firebase.firestore();
  const userInState = useSelector((state) => state.auth.user);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && !userInState) {
        database
          .collection("users")
          .doc(user.uid)
          .get()
          .then(function (response) {
            const responseData = response.data();
            dispatch(authActions.login(responseData));
            let favoriteBooksFromDB = responseData.favoriteBooks;
            let favoriteBooks = {};
            favoriteBooksFromDB.forEach((favoriteBook) => {
              if (favoriteBook.book.imageLinks) {
                favoriteBook.book.imageLinks.thumbnail =
                  favoriteBook.book.imageLinks.thumbnail.replace(
                    "http://",
                    "https://"
                  );
              }
              favoriteBooks[favoriteBook.bookID] = favoriteBook.book;
            });
            dispatch(booksActions.setFavoriteBooks(favoriteBooks));
            let collectionFromDB = responseData.collection;
            let collection = {};
            collectionFromDB.forEach((item) => {
              if (item.book.imageLinks) {
                item.book.imageLinks.thumbnail =
                  item.book.imageLinks.thumbnail.replace("http://", "https://");
              }
              collection[item.bookID] = item.book;
            });
            dispatch(booksActions.setCollection(collection));
            let readingListFromDB = responseData.readingList;
            let readingList = {};
            readingListFromDB.forEach((readingListBook) => {
              if (readingListBook.book.imageLinks) {
                readingListBook.book.imageLinks.thumbnail =
                  readingListBook.book.imageLinks.thumbnail.replace(
                    "http://",
                    "https://"
                  );
              }
              readingList[readingListBook.bookID] = readingListBook.book;
            });
            dispatch(booksActions.setReadingList(readingList));
            let friendsFromDB = responseData.friends;
            let friends = {};
            friendsFromDB.forEach((item) => {
              friends[item.uid] = item.friend;
            });
            dispatch(socialActions.setFriends(friends));
            props.navigation.navigate("MainNavigator");
          })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        props.navigation.navigate("RevampedLogin");
      }
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
        position: "relative",
      }}
    >
      <View style={styles.circle}>
        <Pulse
          color={COLORS.primary}
          numPulses={1}
          diameter={220}
          speed={20}
          duration={1}
          initialDiameter={150}
        />
      </View>
      <Image
        style={{ height: 150, width: 150 }}
        source={require("../../assets/logo.png")}
      />
    </View>
  );
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1b26",
  },
  circle: {
    width: 150,
    height: 150,
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -150 / 2,
    marginTop: -150 / 2,
  },
});
