import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Icon } from "react-native-elements";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/Auth";
import * as booksActions from "../actions/Books";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { createStackNavigator } from "@react-navigation/stack";
import Book from "./Book";
import { TouchableRipple } from "react-native-paper";
import { SearchBar } from "react-native-elements";
import { useDebounce } from "use-debounce";
import Category from "../components/Category";

const Stack = createStackNavigator();

function MyBooks(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [books, setBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [inputChanged, setInputChanged] = useState(false);
  const [selectedCategoryID, setSelectedCategoryID] = useState(1);
  const debouncedSearchText = useDebounce(searchText, 500);

  const dispatch = useDispatch();
  const database = firebase.firestore();

  const user = useSelector((state) => state.auth.user);
  const historyBooks = useSelector((state) => state.books.historyBooks);
  useEffect(() => {
    setCurrentUser(firebase.auth().currentUser);
    // console.log(debouncedSearchText);
    // console.log(searchText);
    if (debouncedSearchText[0] == "") {
      if (historyBooks) {
        console.log(historyBooks);
        setBooks(historyBooks);
        setIsLoading(false);
      } else {
        console.log("else");
        fetch(
          "https://www.googleapis.com/books/v1/volumes?q=subject:history&maxResults=20&key=AIzaSyAyH7CvHZd5lhtiXXVcxdUliGTOwxxMkZc",
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            let googleBooks = [];
            console.log(responseJson);
            if (responseJson) {
              responseJson.items.forEach((book) => {
                googleBooks.push(book.volumeInfo);
              });
              dispatch(booksActions.setHistoryBooks(googleBooks));
              setBooks(googleBooks);
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      if (searchText === debouncedSearchText[0] && inputChanged) {
        console.log(debouncedSearchText[0]);
        setIsLoading(true);
        setInputChanged(false);
        fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${debouncedSearchText}&maxResults=20&langRestrict=en&key=AIzaSyAyH7CvHZd5lhtiXXVcxdUliGTOwxxMkZc`,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            let googleBooks = [];
            console.log(responseJson);
            responseJson.items.forEach((book) => {
              googleBooks.push(book.volumeInfo);
            });
            // dispatch(booksActions.setHistoryBooks(googleBooks));
            setBooks(googleBooks);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [debouncedSearchText]);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(authActions.logout());
        props.navigation.navigate("Loading");
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const onBookPress = (book) => {
    console.log(book);
    dispatch(booksActions.setCurrentBook(book));
    props.navigation.navigate("Book Info");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: 0,
          height: 200,
          width: "100%",
          zIndex: 200,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Category
          height={80}
          width={104}
          iconImage="money.svg"
          name="Business"
          id={1}
          onPress={(id) => setSelectedCategoryID(id)}
          selected={(id) => selectedCategoryID === id}
        ></Category>
        <Category
          height={80}
          width={104}
          iconImage="help.svg"
          name="Self Help"
          id={2}
          onPress={(id) => setSelectedCategoryID(id)}
          selected={(id) => selectedCategoryID === id}
        ></Category>
        <Category
          height={80}
          width={104}
          iconImage="fantasy.svg"
          name="Fantasy"
          id={3}
          onPress={(id) => setSelectedCategoryID(id)}
          selected={(id) => selectedCategoryID === id}
        ></Category>
      </View>
      <SearchBar
        platform="android"
        containerStyle={{
          height: "15%",
          width: "80%",
          position: "absolute",
          backgroundColor: "red",
          top: 0,
          zIndex: 100,
        }}
        placeholder="Type Here..."
        onChangeText={(search) => {
          setInputChanged(true);
          setSearchText(search);
        }}
        value={searchText}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <SafeAreaView style={styles.booksScrollView}>
          <FlatList
            data={books}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.title}
                style={{ marginLeft: 5, marginBottom: 5 }}
                onPress={() => onBookPress(item)}
              >
                <View>
                  <Image
                    style={{ height: 200, width: 150 }}
                    source={{
                      uri: item.imageLinks.thumbnail,
                    }}
                    resizeMode="stretch"
                  />
                </View>
              </TouchableOpacity>
            )}
            numColumns={2}
            columnWrapperStyle={{
              display: "flex",
              justifyContent: "space-evenly",
              marginBottom: 10,
            }}
            keyExtractor={(item) => item.title}
            onEndReached={(dis) => {
              console.log(dis);
              if (dis.distanceFromEnd < 0) {
                return;
              }
              setBooks((data) => {
                return [...data, ...data.slice(0, 10)];
              });
            }}
            onEndReachedThreshold={0.1}
          />
        </SafeAreaView>
      )}

      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  booksContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  booksScrollView: {
    height: Dimensions.get("window").height * 0.75,
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
  },
  plusButton: {
    position: "absolute",
    top: 17,
    right: 10,
  },
  title: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    width: "100%",
    backgroundColor: "#ff4336",
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
    height: Dimensions.get("window").height * 0.08,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height * 0.75,
    width: "100%",
    marginBottom: 5,
  },
  rightIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 120,
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

function Main(props) {
  const [liked, setLiked] = useState(false);
  return (
    <Stack.Navigator
      initialRouteName="My Books"
      headerMode="screen"
      screenOptions={{
        headerStyle: { backgroundColor: "#ff4336" },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen name="My Books" component={MyBooks} />
      <Stack.Screen
        name="Book Info"
        component={Book}
        options={{
          headerRight: (props) => (
            <View style={styles.rightIconsContainer}>
              <TouchableRipple
                onPress={() => console.log("search")}
                rippleColor="rgba(0, 0, 0, .32)"
                style={styles.roundIcon}
                borderless={true}
                centered={true}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    color="white"
                    type="ionicon"
                    name={Platform.OS === "ios" ? "ios-search" : "md-search"}
                  />
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => setLiked((value) => !value)}
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
