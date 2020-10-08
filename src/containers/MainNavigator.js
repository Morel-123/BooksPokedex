import React, { useState, useEffect } from "react";
import { StyleSheet, Platform, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import { createStackNavigator } from "@react-navigation/stack";
import UserCollection from "./UserCollection";
import Book from "./Book";
import MyTabs from "./BottomNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableRipple } from "react-native-paper";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

function MainNavigator(props) {
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

  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

    switch (routeName) {
      case "Home":
        return "Home";
      case "Collection":
        return "My Collection";
      case "Profile":
        return "My Profile";
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        headerMode="screen"
        screenOptions={{
          headerStyle: { backgroundColor: "#ff4336" },
          headerTitleStyle: { color: "white", fontSize: 24 },
          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
          })}
        />
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
    </NavigationContainer>
  );
}

export default MainNavigator;

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
