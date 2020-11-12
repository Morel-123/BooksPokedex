import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import ReadMore from "react-native-read-more-text";
import { TouchableRipple, Snackbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as booksActions from "../actions/Books";
import { useHeaderHeight } from "@react-navigation/stack";
import { Icon } from "react-native-elements";

function Book(props) {
  const dispatch = useDispatch();
  const database = firebase.firestore();
  const [textReady, setTextReady] = useState(false);
  let book = useSelector((state) => state.books.selectedBook);
  let collection = useSelector((state) => state.books.collection);
  const [isInCollection, setIsInCollection] = useState(
    book ? (collection[book.id] ? true : false) : false
  );
  let favoriteBooks = useSelector((state) => state.books.favoriteBooks);
  const [liked, setLiked] = useState(
    book ? (favoriteBooks[book.id] ? true : false) : false
  );
  const user = useSelector((state) => state.auth.user);
  const headerHeight = useHeaderHeight();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (book && collection[book.id]) {
      setIsInCollection(true);
    } else {
      setIsInCollection(false);
    }
    if (book && favoriteBooks[book.id]) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [book, collection, favoriteBooks]);

  const handleBack = () => {
    // props.navigation.navigate("My Books");
    props.navigation.pop();
  };

  const renderTruncatedFooter = (handlePress) => {
    return (
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        style={{ alignSelf: "flex-start" }}
        onPress={handlePress}
      >
        <Text style={{ color: "#448aff", marginTop: 0 }}>Show more</Text>
      </TouchableRipple>
    );
  };

  const renderRevealedFooter = (handlePress) => {
    return (
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        style={{ alignSelf: "flex-start" }}
        onPress={handlePress}
      >
        <Text style={{ color: "#448aff", marginTop: 0 }}>Show less</Text>
      </TouchableRipple>
    );
  };

  const onAddOrRemoveBookToCollection = () => {
    database
      .collection("users")
      .doc(user.uid)
      .update({
        collection: isInCollection
          ? firebase.firestore.FieldValue.arrayRemove({
              bookID: book.id,
              book: book,
            })
          : firebase.firestore.FieldValue.arrayUnion({
              bookID: book.id,
              book: book,
            }),
      })
      .then(function () {
        if (isInCollection) {
          dispatch(booksActions.removeFromCollection(book));
        } else {
          dispatch(booksActions.addToCollection(book));
        }
        setIsInCollection((value) => !value);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const onBookLikePress = () => {
    setLiked((val) => !val);
    database
      .collection("users")
      .doc(user.uid)
      .update({
        favoriteBooks: liked
          ? firebase.firestore.FieldValue.arrayRemove({
              bookID: book.id,
              book: book,
            })
          : firebase.firestore.FieldValue.arrayUnion({
              bookID: book.id,
              book: book,
            }),
      })
      .then(function () {
        if (liked) {
          dispatch(booksActions.removeFavoriteBook(book));
        } else {
          dispatch(booksActions.addFavoriteBook(book));
        }
        onToggleSnackBar();
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  return (
    // <ScrollView>
    <View
      style={{
        ...styles.container,
        height: Dimensions.get("window").height - headerHeight,
      }}
    >
      <ScrollView
        style={{ height: Dimensions.get("window").height - headerHeight }}
      >
        <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <View style={{ position: "relative", height: 220, width: 170 }}>
            <Image
              style={{
                height: 220,
                width: 150,
                marginLeft: 10,
                marginRight: 5,
              }}
              source={
                book.imageLinks
                  ? {
                      uri: book.imageLinks.thumbnail,
                    }
                  : require("../../assets/no_cover_thumb.png")
              }
              resizeMode="stretch"
            />
            <TouchableRipple
              onPress={onBookLikePress}
              rippleColor="rgba(0, 0, 0, .32)"
              style={styles.likeButton}
              borderless={true}
              centered={true}
            >
              <View style={styles.iconContainer}>
                {liked ? (
                  <Icon
                    color="white"
                    type="ionicon"
                    name={Platform.OS === "ios" ? "ios-heart" : "md-heart"}
                    iconStyle={{ width: 26, textAlign: "center" }}
                  />
                ) : (
                  <Icon
                    color="white"
                    type="ionicon"
                    name={
                      Platform.OS === "ios"
                        ? "ios-heart-empty"
                        : "md-heart-empty"
                    }
                    iconStyle={{ width: 26, textAlign: "center" }}
                  />
                )}
              </View>
            </TouchableRipple>
          </View>
          <View
            style={{
              display: "flex",
              width: Dimensions.get("window").width - 175,
              marginRight: 5,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                color: "#212121",
                fontWeight: "bold",
              }}
            >
              {book.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: "#757575",
                marginTop: 5,
              }}
            >
              {book.authors ? book.authors[0] : "Not Specified"}
            </Text>
            {isInCollection ? (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                  width: 40,
                  alignSelf: "center",
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                  borderBottomLeftRadius: 50,
                  borderBottomRightRadius: 50,
                  backgroundColor: "#4BCA81",
                  marginTop: 5,
                }}
              >
                <MaterialCommunityIcons name="book" color="white" size={20} />
              </View>
            ) : (
              false
            )}
          </View>
        </View>
        <View style={styles.extraInfoWrapper}>
          <View style={styles.extraInfoContainer}>
            <View style={styles.extraInfoDetailContainer}>
              <Text
                style={[
                  styles.extraInfoDetailText,
                  styles.extraInfoDetailTitle,
                ]}
              >
                Genre
              </Text>
              <Text
                style={[
                  styles.extraInfoDetailText,
                  styles.extraInfoDetailValue,
                ]}
              >
                {book.categories
                  ? book.categories[0].split(" ")[0]
                  : "Not Specified"}
              </Text>
            </View>
            <View style={styles.extraInfoDetailContainer}>
              <Text
                style={[
                  styles.extraInfoDetailText,
                  styles.extraInfoDetailTitle,
                ]}
              >
                Pages
              </Text>
              <Text
                style={[
                  styles.extraInfoDetailText,
                  styles.extraInfoDetailValue,
                ]}
              >
                {book.pageCount ? book.pageCount : "N/A"}
              </Text>
            </View>
            <View style={styles.extraInfoDetailContainer}>
              <Text
                style={[
                  styles.extraInfoDetailText,
                  styles.extraInfoDetailTitle,
                ]}
              >
                Released
              </Text>
              <Text
                style={[
                  styles.extraInfoDetailText,
                  styles.extraInfoDetailValue,
                ]}
              >
                {book.publishedDate.substring(0, 4)}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 5,
            marginLeft: 9,
            width: "100%",
            paddingRight: 8,
          }}
        >
          <Text style={{ fontSize: 20 }}>Description</Text>
          <View style={{ width: '98%', opacity: textReady ? 1 : 0 }}>
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={renderTruncatedFooter}
              renderRevealedFooter={renderRevealedFooter}
              onReady={() => setTextReady(true)}
            >
              <Text style={{ fontSize: 16 }}>{book.description}</Text>
            </ReadMore>
          </View>
        </View>
        {isInCollection ? (
          <Button
            title="Remove From Collection"
            onPress={onAddOrRemoveBookToCollection}
          />
        ) : (
          <Button
            title="Add To Collection"
            onPress={onAddOrRemoveBookToCollection}
          />
        )}
        {/* <Button title="Go Back" onPress={handleBack} /> */}
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1500}
        style={{ backgroundColor: "#448aff" }}
      >
        {liked ? "Added to Favorites" : "Removed from Favorites"}
      </Snackbar>
    </View>
    // </ScrollView>
  );
}

export default Book;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  extraInfoWrapper: {
    width: "100%",
    // height: "12%",
    height: Dimensions.get("window").height * 0.1,
    display: "flex",
    alignItems: "center",
  },
  extraInfoContainer: {
    width: "97%",
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
    color: "white",
  },
  extraInfoDetailValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  likeButton: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: "absolute",
    bottom: 0,
    right: 2,
    backgroundColor: "#448aff",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
