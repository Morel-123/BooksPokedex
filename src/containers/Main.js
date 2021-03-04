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
  Keyboard,
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
import { TabView, SceneMap } from "react-native-tab-view";

const Stack = createStackNavigator();

function Main(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [books, setBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [inputChanged, setInputChanged] = useState(false);
  const [selectedCategoryID, setSelectedCategoryID] = useState(0);
  const [previousSelectedCategoryID, setPreviousSelectedCategoryID] = useState(
    0
  );
  const debouncedSearchText = useDebounce(searchText, 300);
  const [search, setSearch] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [needToUpdateScroll, setNeedToUpdateScroll] = useState(false);
  const dispatch = useDispatch();
  const database = firebase.firestore();

  const user = useSelector((state) => state.auth.user);
  const historyBooks = useSelector((state) => state.books.historyBooks);
  const businessBooks = useSelector((state) => state.books.businessBooks);
  const selfHelpBooks = useSelector((state) => state.books.selfHelpBooks);
  const fantasyBooks = useSelector((state) => state.books.fantasyBooks);

  const [allCategoriesBooks, setAllCategoriesBooks] = useState([
    businessBooks,
    selfHelpBooks,
    fantasyBooks,
    historyBooks,
  ]);
  const [allCategoriesNames, setAllCategoriesNames] = useState([
    "business",
    "self help",
    "fantasy",
    "history",
  ]);
  const [
    allCategoriesStoreFunctions,
    setAllCategoriesStoreFunctions,
  ] = useState([
    booksActions.setBusinessBooks,
    booksActions.setSelfHelpBooks,
    booksActions.setFantasyBooks,
    booksActions.setHistoryBooks,
  ]);


  const [userBooks, setUserBooks] = useState(null);
  const [isLoadingUserBooks, setIsLoadingUserBooks] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "google", title: "Google's Books" },
    { key: "user", title: "User's Books" },
  ]);


  useEffect(() => {
    let pageCount = 20;
    if (books && books.length > 0) {
      setScrollIndex((books.length - pageCount) / 2);
    }
  }, [books]);

  useEffect(() => {
    setCurrentUser(firebase.auth().currentUser);
    if (debouncedSearchText[0] == "") {
      if (allCategoriesBooks[selectedCategoryID]) {
        setBooks(allCategoriesBooks[selectedCategoryID]);
        setIsLoading(false);
      } else {
        if (!isLoading) {
          setIsLoading(true);
          fetch(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${allCategoriesNames[selectedCategoryID]}&maxResults=20&langRestrict=en&key=AIzaSyAyH7CvHZd5lhtiXXVcxdUliGTOwxxMkZc`,
            {
              method: "GET",
            }
          )
            .then((response) => response.json())
            .then((responseJson) => {
              let googleBooks = [];
              if (responseJson) {
                responseJson.items.forEach((book) => {
                  googleBooks.push({ ...book.volumeInfo, id: book.id });
                });
                setAllCategoriesBooks((books) => {
                  let updatedBooks = [...books];
                  updatedBooks[selectedCategoryID] = googleBooks;
                  return updatedBooks;
                });
                dispatch(
                  allCategoriesStoreFunctions[selectedCategoryID](googleBooks)
                );
                setBooks(googleBooks);
              }
              setIsLoading(false);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    } else {
      if (searchText === debouncedSearchText[0] && inputChanged) {
        setIndex(0);
        setUserBooks(null);
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
            responseJson.items.forEach((book) => {
              googleBooks.push({ ...book.volumeInfo, id: book.id });
            });
            setBooks(googleBooks);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [debouncedSearchText[0], selectedCategoryID]);

  useEffect(() => {
    //if we are on the user's book's tab
    if (index == 1 && debouncedSearchText[0] != "" && userBooks == null) {
      setIsLoadingUserBooks(true);
      database
        .collection("books")
        .get()
        .then((res) => {
          let matchingBooks = [];
          res.docs.map((doc) => {
            if (
              doc
                .data()
                .title.toLowerCase()
                .indexOf(debouncedSearchText[0].toLowerCase()) !== -1
            ) {
              matchingBooks.push(doc.data());
            }
          });
          setUserBooks(matchingBooks);
          setIsLoadingUserBooks(false);
        })
        .catch(function (error) {
          console.log(error.message);
        });
    }
  }, [index]);

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
    dispatch(booksActions.setCurrentBook(book));
    props.navigation.navigate("Book Info");
  };

  const onAddBookPress = () => {
    props.navigation.navigate("Add Book");
  };

  const onCategoryPress = (id) => {
    setPreviousSelectedCategoryID(selectedCategoryID);
    setSelectedCategoryID(id);
    setBooks(allCategoriesBooks[id]);
  };

  const RenderGoogleBooksResult = (props) => {
    return (
      <SafeAreaView
        style={[
          props.inTabView
            ? styles.innerBooksScrollViewExpanded
            : debouncedSearchText[0] == ""
            ? styles.booksScrollView
            : styles.booksScrollViewExpanded,
        ]}
      >
        <FlatList
          data={books}
          getItemLayout={(data, index) => ({
            length: 215,
            offset: index % 2 == 0 ? 215 * index : 215 * (index - 1),
            index,
          })}
          initialScrollIndex={scrollIndex}
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
            if (dis.distanceFromEnd < 0) {
              return;
            }
            if (debouncedSearchText[0] == "") {
              setIsLoading(true);
              fetch(
                `https://www.googleapis.com/books/v1/volumes?q=subject:${allCategoriesNames[selectedCategoryID]}&maxResults=20&startIndex=${allCategoriesBooks[selectedCategoryID].length}&langRestrict=en&key=AIzaSyAyH7CvHZd5lhtiXXVcxdUliGTOwxxMkZc`,
                {
                  method: "GET",
                }
              )
                .then((response) => response.json())
                .then((responseJson) => {
                  let googleBooks = [];
                  if (responseJson) {
                    responseJson.items.forEach((book) => {
                      googleBooks.push({ ...book.volumeInfo, id: book.id });
                    });
                    setAllCategoriesBooks((books) => {
                      let updatedBooks = [...books];
                      updatedBooks[selectedCategoryID] = [
                        ...updatedBooks[selectedCategoryID],
                        ...googleBooks,
                      ];
                      return updatedBooks;
                    });
                    dispatch(
                      allCategoriesStoreFunctions[selectedCategoryID]([
                        ...allCategoriesBooks[selectedCategoryID],
                        ...googleBooks,
                      ])
                    );
                    setBooks((data) => {
                      return [...data, ...googleBooks];
                    });
                    setNeedToUpdateScroll(true);
                  }
                  setIsLoading(false);
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "google":
        return <RenderGoogleBooksResult inTabView={true} />;
      case "user":
        return isLoadingUserBooks ? (
          <View style={styles.loadingContainerExpanded}>
            <Text>Loading</Text>
            <Spinner
              size={Platform.OS === "android" ? 10 : "large"}
              color={Platform.OS === "android" ? "#448aff" : undefined}
            />
          </View>
        ) : !userBooks || userBooks.length == 0 ? (
          <View style={{ marginLeft: 5 }}>
            <Text>No matching results</Text>
          </View>
        ) : (
          <SafeAreaView style={styles.booksScrollViewExpanded}>
            <FlatList
              data={userBooks}
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
              onEndReachedThreshold={0.1}
            />
          </SafeAreaView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <SearchBar
          ref={(search) => {
            setSearch(search);
          }}
          platform="android"
          containerStyle={{
            height: 60,
            width: "88%",
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
            setIsLoading(true);
            setSearchText(search);
          }}
          onClear={() => setIsLoading(true)}
          value={searchText}
        />
        <TouchableRipple
          onPress={onAddBookPress}
          rippleColor="rgba(0, 0, 0, .32)"
          style={styles.addButton}
          borderless={true}
          centered={true}
        >
          <View style={styles.iconContainer}>
            <Icon
              color="white"
              type="ionicon"
              name={Platform.OS === "ios" ? "ios-add" : "md-add"}
              iconStyle={{ width: 26, textAlign: "center" }}
            />
          </View>
        </TouchableRipple>
      </View>
      {debouncedSearchText[0] == "" ? (
        <View
          style={{
            top: 0,
            height: 100,
            width: "100%",
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
            id={0}
            onPress={onCategoryPress}
            selected={(id) => selectedCategoryID === id}
          ></Category>
          <Category
            height={80}
            width={104}
            iconImage={require("../../assets/help.png")}
            name="Self Help"
            id={1}
            onPress={onCategoryPress}
            selected={(id) => selectedCategoryID === id}
          ></Category>
          <Category
            height={80}
            width={104}
            iconImage={require("../../assets/fantasy.png")}
            name="Fantasy"
            id={2}
            onPress={onCategoryPress}
            selected={(id) => selectedCategoryID === id}
          ></Category>
        </View>
      ) : (
        false
      )}
      {isLoading ? (
        <View
          style={[
            debouncedSearchText[0] == ""
              ? styles.loadingContainer
              : styles.loadingContainerExpanded,
          ]}
        >
          <Text>Loading</Text>
          <Spinner
            size={Platform.OS === "android" ? 10 : "large"}
            color={Platform.OS === "android" ? "#448aff" : undefined}
          />
        </View>
      ) : debouncedSearchText[0] == "" ? (
        <RenderGoogleBooksResult />
      ) : (
        <View style={styles.booksScrollViewExpanded}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
          />
        </View>
      )}
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  container: {
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
    height: "60%",
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
  },
  booksScrollViewExpanded: {
    height: "81%",
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
  },
  innerBooksScrollViewExpanded: {
    height: "100%",
    width: "100%",
    marginTop: 5,
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
    height: "60%",
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainerExpanded: {
    height: "81%",
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
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
  addButton: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: "#448aff",
    height: 40,
    width: 40,
    alignSelf: "center",
    marginLeft: 10,
  },
});
