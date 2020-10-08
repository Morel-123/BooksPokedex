import React, { useState, useEffect } from "react";
import { StyleSheet, Platform, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import { createStackNavigator } from "@react-navigation/stack";
import UserCollection from "./UserCollection";
import Book from "./Book";
import { TouchableRipple } from "react-native-paper";

const Stack = createStackNavigator();

function UserCollectionNavigator(props) {
  let selectedBook = useSelector((state) => state.books.selectedBook);
  let favoriteBooks = useSelector((state) => state.books.favoriteBooks);
  const [liked, setLiked] = useState(
    selectedBook ? (favoriteBooks[selectedBook.id] ? true : false) : false
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedBook && favoriteBooks[selectedBook.id]) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [selectedBook, favoriteBooks]);

  const onBookLikePress = () => {
    if (liked) {
      dispatch(booksActions.removeFavoriteBook(selectedBook));
    } else {
      dispatch(booksActions.addFavoriteBook(selectedBook));
    }
    setLiked((value) => !value);
  };

  return (
    <Stack.Navigator
      initialRouteName="My Collection"
      headerMode="screen"
      screenOptions={{
        headerStyle: { backgroundColor: "#ff4336" },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen name="My Collection" component={UserCollection} />
      <Stack.Screen
        name="Book Info"
        component={Book}
        options={{
          headerRight: (props) => (
            <View style={styles.rightIconsContainer}>
              <TouchableRipple
                onPress={onBookLikePress}
                rippleColor="rgba(0, 0, 0, .32)"
                style={styles.roundIcon}
                borderless={true}
                centered={true}
              >
                <View style={styles.iconContainer}>
                  {liked ? (
                    <Icon
                      color="white"
                      type="ionicon"
                      name={Platform.OS === "ios" ? "ios-heart" : "md-heart"}
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
                    />
                  )}
                </View>
              </TouchableRipple>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default UserCollectionNavigator;

const styles = StyleSheet.create({
  rightIconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 120,
    marginRight: 5,
  },
  roundIcon: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
