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
import Spinner from "../components/Spinner";

const Stack = createStackNavigator();

function Main(props) {
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
    if (debouncedSearchText[0] == "") {
      if (historyBooks) {
        console.log(historyBooks);
        setBooks(historyBooks);
        setIsLoading(false);
      } else {
        console.log("else");
        fetch(
          "https://www.googleapis.com/books/v1/volumes?q=subject:history&maxResults=20&langRestrict=en&key=AIzaSyAyH7CvHZd5lhtiXXVcxdUliGTOwxxMkZc",
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
                googleBooks.push({ ...book.volumeInfo, id: book.id });
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
        let language = "en";
        if (containsHebrew(searchText)) {
          language = "iw";
        }
        fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${debouncedSearchText[0]}&maxResults=20&langRestrict=${language}&key=AIzaSyAyH7CvHZd5lhtiXXVcxdUliGTOwxxMkZc`,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            let googleBooks = [];
            console.log(responseJson);
            responseJson.items.forEach((book) => {
              googleBooks.push({ ...book.volumeInfo, id: book.id });
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

  const containsHebrew = (str) => {
    return /[\u0590-\u05FF]/.test(str);
  };

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
      <SearchBar
        platform="android"
        containerStyle={{
          height: 60,
          // height: "12%",
          // height: Dimensions.get("window").height * 0.1,
          width: "85%",
          // position: "absolute",
          backgroundColor: "#cbcbcb",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
        placeholder="Type Here..."
        onChangeText={(search) => {
          setInputChanged(true);
          setSearchText(search);
        }}
        onClear={() => setIsLoading(true)}
        value={searchText}
      />
      <View
        style={{
          // position: "absolute",
          top: 0,
          height: 100,
          width: "100%",
          // zIndex: 200,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Category
          height={80}
          width={104}
          iconImage={require("../../assets/money.png")}
          name="Business"
          id={1}
          onPress={(id) => setSelectedCategoryID(id)}
          selected={(id) => selectedCategoryID === id}
        ></Category>
        <Category
          height={80}
          width={104}
          iconImage={require("../../assets/help.png")}
          name="Self Help"
          id={2}
          onPress={(id) => setSelectedCategoryID(id)}
          selected={(id) => selectedCategoryID === id}
        ></Category>
        <Category
          height={80}
          width={104}
          iconImage={require("../../assets/fantasy.png")}
          name="Fantasy"
          id={3}
          onPress={(id) => setSelectedCategoryID(id)}
          selected={(id) => selectedCategoryID === id}
        ></Category>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading</Text>
          <Spinner
            size={Platform.OS === "android" ? 10 : "large"}
            color={Platform.OS === "android" ? "#448aff" : undefined}
          />
        </View>
      ) : (
        <SafeAreaView style={styles.booksScrollView}>
          <FlatList
            data={books}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={{ marginLeft: 5, marginBottom: 5 }}
                onPress={() => onBookPress(item)}
              >
                <View>
                  <Image
                    style={{ height: 200, width: 150 }}
                    source={
                      item.imageLinks
                        ? {
                            uri: item.imageLinks.thumbnail,
                          }
                        : require("../../assets/no_cover_thumb.png")
                    }
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
            keyExtractor={(item) => item.id}
            onEndReached={(dis) => {
              console.log(dis);
              if (dis.distanceFromEnd < 0) {
                return;
              }
              if (debouncedSearchText[0] == "") {
                dispatch(
                  booksActions.setHistoryBooks([
                    ...historyBooks,
                    ...historyBooks.slice(0, 10),
                  ])
                );
              }
              setBooks((data) => {
                return [...data, ...data.slice(0, 10)];
              });
            }}
            onEndReachedThreshold={0.1}
          />
        </SafeAreaView>
      )}

      {/* <Button title="Log Out" onPress={handleLogout} /> */}
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: Dimensions.get("window").height - 64 - 54,
  },
  booksContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  booksScrollView: {
    // height: Dimensions.get("window").height * 0.75,
    // height: Dimensions.get("window").height * 0.5,
    height: "60%",
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
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // height: Dimensions.get("window").height * 0.5,
    // backgroundColor: "pink",
    // width: "100%",
    // marginBottom: 5,
    // height: Dimensions.get("window").height * 0.5,
    height: "60%",
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "pink",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rightIconsContainer: {
    flexDirection: "row",
    // justifyContent: "space-evenly",
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
