import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";
import { TouchableRipple } from "react-native-paper";
import { useDebounce } from "use-debounce";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/Auth";
import * as booksActions from "../actions/Books";
import Spinner from "../components/Spinner";
import { SearchBar } from "react-native-elements";

import { COLORS, FONTS, SIZES, icons } from "../constants";

const LineDivider = () => {
  return (
    <View style={{ width: 1, paddingVertical: 18 }}>
      <View
        style={{
          flex: 1,
          borderLeftColor: COLORS.lightGray,
          borderLeftWidth: 1,
        }}
      ></View>
    </View>
  );
};

const NewHome = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [books, setBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [inputChanged, setInputChanged] = useState(false);
  const [selectedCategoryID, setSelectedCategoryID] = useState(0);
  const debouncedSearchText = useDebounce(searchText, 300);
  const [scrollIndex, setScrollIndex] = useState(0);
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
  const [search, setSearch] = useState(null);

  useEffect(() => {
    setCurrentUser(firebase.auth().currentUser);
    if (debouncedSearchText[0] == "") {
      setIndex(0);
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
              if (responseJson && responseJson.items) {
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
      setIsLoading(true);
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
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error.message);
        });
    }
  }, [index]);

  const containsHebrew = (str) => {
    return /[\u0590-\u05FF]/.test(str);
  };

  const onBookPress = (book) => {
    dispatch(booksActions.setCurrentBook(book));
    props.navigation.navigate("Book Info");
  };

  const onAddBookPress = () => {
    props.navigation.navigate("Add Book");
  };

  const categoriesData = [
    {
      id: 0,
      categoryName: "Business",
    },
    {
      id: 1,
      categoryName: "Self Help",
    },
    {
      id: 2,
      categoryName: "Fantasy",
    },
  ];

  const [categories, setCategories] = React.useState(categoriesData);
  const [selectedCategory, setSelectedCategory] = React.useState(0);

  function renderHeader() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingHorizontal: SIZES.padding,
          alignItems: "center",
        }}
      >
        {/* Greetings */}
        <View style={{ flex: 1 }}>
          <View style={{ marginRight: SIZES.padding }}>
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Welcome</Text>
            <Text style={{ ...FONTS.h2, color: COLORS.white }}>
              {user
                ? user.firstName.substring(0, 1).toUpperCase() +
                  user.firstName.substring(1)
                : ""}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            height: 40,
            paddingLeft: 3,
            paddingRight: SIZES.radius,
            borderRadius: 20,
          }}
          onPress={onAddBookPress}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 25,
                backgroundColor: "rgba(0,0,0,0.33)",
              }}
            >
              <Image
                source={icons.plus_icon}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </View>

            <Text
              style={{
                marginLeft: SIZES.base,
                color: COLORS.white,
                ...FONTS.body3,
              }}
            >
              Add Book
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function renderButtonSection() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: SIZES.padding,
          paddingBottom: 8,
          paddingTop: 0,
          alignItems: "center",
        }}
      >
        <SearchBar
          ref={(search) => {
            setSearch(search);
          }}
          platform="android"
          containerStyle={{
            height: 60,
            width: "95%",
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
      </View>
    );
  }

  function renderCategoryHeader() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{ flex: 1, marginRight: SIZES.padding }}
          onPress={() => setSelectedCategoryID(item.id)}
        >
          {selectedCategoryID == item.id && (
            <Text style={{ ...FONTS.h2, color: COLORS.white }}>
              {item.categoryName}
            </Text>
          )}
          {selectedCategoryID != item.id && (
            <Text style={{ ...FONTS.h2, color: COLORS.lightGray }}>
              {item.categoryName}
            </Text>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flex: 1, paddingLeft: SIZES.padding }}>
        <FlatList
          data={categories}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          horizontal
        />
      </View>
    );
  }

  const renderBookItem = ({ item }) => {
    return (
      <View style={{ marginVertical: SIZES.base }}>
        <TouchableOpacity
          style={{ height: 166, flexDirection: "row" }}
          onPress={() => onBookPress(item)}
        >
          {/* Book Cover */}
          <Image
            source={
              item.imageLinks
                ? {
                    uri: item.imageLinks.thumbnail,
                  }
                : require("../../assets/no_cover_thumb.png")
            }
            resizeMode="cover"
            style={{ width: 100, height: 150, borderRadius: 10 }}
          />

          <View style={{ flex: 1, marginLeft: SIZES.radius }}>
            {/* Book name and author */}
            <View>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  paddingRight: SIZES.padding,
                  ...FONTS.h2,
                  color: COLORS.white,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.lightGray,
                  paddingRight: SIZES.padding,
                }}
              >
                {item.authors ? item.authors[0] : "Not Specified"}
              </Text>
            </View>

            {/* Book Info */}
            <View
              style={{
                flexDirection: containsHebrew(item.title)
                  ? "row-reverse"
                  : "row",
                marginTop: SIZES.base,
                paddingRight: SIZES.padding,
                paddingLeft: containsHebrew(item.title) ? SIZES.padding : 0,
              }}
            >
              <Image
                source={icons.page_filled_icon}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.lightGray,
                  alignSelf: "center",
                }}
              />
              <Text
                style={{
                  ...FONTS.body4,
                  color: COLORS.lightGray,
                  paddingHorizontal: SIZES.radius,
                  alignSelf: "center",
                }}
              >
                {item.pageCount ? item.pageCount : "N/A"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  function renderCategoryData() {
    return (
      <View
        style={{ flex: 1, marginTop: SIZES.radius, paddingLeft: SIZES.padding }}
      >
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
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
      </View>
    );
  }

  function renderSearchCategoriesHeader() {
    const searchCategories = [
      {
        id: 0,
        categoryName: "Google's Books",
      },
      {
        id: 1,
        categoryName: "User's Books",
      },
    ];
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{ flex: 1, marginRight: SIZES.padding }}
          onPress={() => setIndex(item.id)}
        >
          {index == item.id && (
            <Text style={{ ...FONTS.h2, color: COLORS.white }}>
              {item.categoryName}
            </Text>
          )}
          {index != item.id && (
            <Text style={{ ...FONTS.h2, color: COLORS.lightGray }}>
              {item.categoryName}
            </Text>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flex: 1, paddingLeft: SIZES.padding }}>
        <FlatList
          data={searchCategories}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          horizontal
        />
      </View>
    );
  }

  function renderUserBooksData() {
    return (
      <View
        style={{ flex: 1, marginTop: SIZES.radius, paddingLeft: SIZES.padding }}
      >
        {!userBooks || userBooks.length == 0 ? (
          <View>
            <Text style={{ color: COLORS.white }}>No matching results</Text>
          </View>
        ) : (
          <FlatList
            data={userBooks}
            renderItem={renderBookItem}
            keyExtractor={(item) => `${item.id}`}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      {/* Header Section */}
      <View style={{ height: 200, marginTop: 20 }}>
        {renderHeader()}
        {renderButtonSection()}
      </View>

      {/* Body Section */}
      <View style={{ height: 35, marginBottom: 5 }}>
        {searchText == ""
          ? renderCategoryHeader()
          : renderSearchCategoriesHeader()}
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: COLORS.white, marginBottom: 5 }}>Loading</Text>
          <Spinner
            size={Platform.OS === "android" ? 10 : "large"}
            color={Platform.OS === "android" ? "#f96d41" : undefined}
          />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          {index == 0 ? renderCategoryData() : renderUserBooksData()}
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

export default NewHome;
