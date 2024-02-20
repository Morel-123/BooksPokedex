import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, SearchBar } from "react-native-elements";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import Spinner from "../components/Spinner";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { firebase } from "../firebase/Config";

function NewCollection(props) {
  const [isCollectionSelected, setIsCollectionSelected] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const database = firebase.firestore();
  const dispatch = useDispatch();
  let favoriteBooks = useSelector((state) => state.books.favoriteBooks);
  let collection = useSelector((state) => state.books.collection);
  let readingList = useSelector((state) => state.books.readingList);

  const filteredCollection = useMemo(
    () => reverseOrder ? filterBooks(collection).reverse() : filterBooks(collection),
    [searchText, collection, reverseOrder]
  );

  useEffect(() => {
    if (!showSearch) {
      setSearchText("");
    }
  }, [showSearch]);

  useEffect(() => {
    if (Object.keys(collection).length === 0) {
      setShowSearch(false);
    }
  }, [collection]);

  const onReadingListBookPress = (book, index) => {
    const indexIndexInArray = selectedIndexes.indexOf(index);
    const bookIndexInArray = selectedBooks.findIndex((b) => b.id == book.id);
    let copyOfSelectedIndexes = [...selectedIndexes];
    let copyOfSelectedBooks = [...selectedBooks];
    if (indexIndexInArray !== -1) {
      copyOfSelectedIndexes.splice(indexIndexInArray, 1);
      copyOfSelectedBooks.splice(bookIndexInArray, 1);
      setSelectedIndexes(copyOfSelectedIndexes);
      setSelectedBooks(copyOfSelectedBooks);
      return;
    } else {
      if (selectedIndexes.length > 0) {
        copyOfSelectedIndexes.push(index);
        copyOfSelectedBooks.push(book);
        setSelectedIndexes(copyOfSelectedIndexes);
        setSelectedBooks(copyOfSelectedBooks);
        return;
      }
    }
    dispatch(booksActions.setCurrentBook(book));
    props.navigation.navigate("Book Info");
  };

  const onBookPress = (book) => {
    dispatch(booksActions.setCurrentBook(book));
    props.navigation.navigate("Book Info");
  };

  const onBookLongPress = (book, index) => {
    if (isCollectionSelected) {
      return;
    } else {
      const indexIndexInArray = selectedIndexes.indexOf(index);
      const bookIndexInArray = selectedBooks.findIndex((b) => b.id == book.id);
      let copyOfSelectedIndexes = [...selectedIndexes];
      let copyOfSelectedBooks = [...selectedBooks];
      if (indexIndexInArray !== -1) {
        copyOfSelectedIndexes.splice(indexIndexInArray, 1);
        copyOfSelectedBooks.splice(bookIndexInArray, 1);
      } else {
        copyOfSelectedIndexes.push(index);
        copyOfSelectedBooks.push(book);
      }
      setSelectedIndexes(copyOfSelectedIndexes);
      setSelectedBooks(copyOfSelectedBooks);
    }
  };

  async function notifyFriendOnAddToCollection(books) {
    let recipients = [];
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i].friend.expoPushToken) {
        recipients.push(user.friends[i].friend.expoPushToken);
      }
    }
    let bookTitles = "";
    for (const bookObj of books) {
      if (bookTitles != "") {
        bookTitles = bookTitles + ", ";
      }
      bookTitles = bookTitles + bookObj.book.title;
    }
    const message = {
      to: recipients,
      sound: "default",
      title:
        books.length == 1
          ? `${
              user.firstName.substring(0, 1).toUpperCase() +
              user.firstName.substring(1)
            } just finished a book`
          : `${
              user.firstName.substring(0, 1).toUpperCase() +
              user.firstName.substring(1)
            } just finished some books`,
      body:
        books.length == 1
          ? `${bookTitles} was added to their collection!`
          : `${bookTitles} were added to their collection!`,
      data: { data: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  const onAddBooksToCollection = () => {
    setLoading(true);
    let removeBooksFromReadingList = [];
    let newBooksToCollection = [];
    for (const book of selectedBooks) {
      removeBooksFromReadingList.push({
        bookID: book.id,
        book: book,
      });
      if (!collection[book.id]) {
        newBooksToCollection.push({
          bookID: book.id,
          book: book,
        });
      }
    }
    let updateFields = {
      readingList: firebase.firestore.FieldValue.arrayRemove(
        ...removeBooksFromReadingList
      ),
    };
    if (newBooksToCollection.length > 0) {
      updateFields = {
        readingList: firebase.firestore.FieldValue.arrayRemove(
          ...removeBooksFromReadingList
        ),
        collection: firebase.firestore.FieldValue.arrayUnion(
          ...newBooksToCollection
        ),
      };
    }
    database
      .collection("users")
      .doc(user.uid)
      .update(updateFields)
      .then(async function () {
        if (newBooksToCollection.length > 0 && Platform.OS !== "web") {
          await notifyFriendOnAddToCollection(newBooksToCollection);
        }
        dispatch(booksActions.addFromReadingListToCollection(selectedBooks));
        setVisible(true);
        setSelectedIndexes([]);
        setSelectedBooks([]);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const onRemoveBooksFromReadingList = () => {
    setLoading(true);
    let removeBooksFromReadingList = [];
    for (const book of selectedBooks) {
      removeBooksFromReadingList.push({
        bookID: book.id,
        book: book,
      });
    }
    let updateFields = {
      readingList: firebase.firestore.FieldValue.arrayRemove(
        ...removeBooksFromReadingList
      ),
    };
    database
      .collection("users")
      .doc(user.uid)
      .update(updateFields)
      .then(async function () {
        dispatch(booksActions.removeBooksFromReadingList(selectedBooks));
        setSelectedIndexes([]);
        setSelectedBooks([]);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const onDismissSnackBar = () => setVisible(false);

  const containsHebrew = (str) => {
    return /[\u0590-\u05FF]/.test(str);
  };

  function filterBooks(books) {
    const searchTerm = searchText.trim().toLowerCase();
    return Object.values(books).filter((book) => {
      const { title, authors } = book;
      if (title && title.toLowerCase().includes(searchTerm)) {
        return true;
      }
      if (
        authors &&
        authors.some((author) => author.toLowerCase().includes(searchTerm))
      ) {
        return true;
      }
      return false;
    });
  }

  function renderFavoritesSection(myBooks) {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            marginLeft: index == 0 ? SIZES.padding : 0,
            marginRight: SIZES.radius,
          }}
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
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: SIZES.padding,
            flexDirection: "row",
          }}
        >
          <Icon
            color="white"
            type="ionicon"
            name={Platform.OS === "ios" ? "ios-heart" : "md-heart"}
            iconStyle={{ width: 26, textAlign: "center" }}
            containerStyle={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 5,
            }}
          />
          <Text style={{ ...FONTS.h2, color: COLORS.white }}>
            Favorites {Object.keys(favoriteBooks).length}
          </Text>
        </View>

        {/* Books */}
        <View style={{ flex: 1, marginTop: SIZES.radius }}>
          {Object.keys(favoriteBooks).length > 0 ? (
            <FlatList
              data={Object.values(favoriteBooks)}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text
              style={{ color: COLORS.white, paddingHorizontal: SIZES.padding }}
            >
              Start Liking To See Books Here
            </Text>
          )}
        </View>
      </View>
    );
  }

  function renderCollectionSection() {
    const renderBookItem = ({ item, index }) => {
      return (
        <View style={{ marginVertical: SIZES.base }}>
          <TouchableOpacity
            style={{
              height: 166,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: isCollectionSelected ? 0 : SIZES.padding,
              backgroundColor:
                !isCollectionSelected && selectedIndexes.indexOf(index) !== -1
                  ? "#41414191"
                  : "transparent",
            }}
            onPress={() =>
              isCollectionSelected
                ? onBookPress(item)
                : onReadingListBookPress(item, index)
            }
            onLongPress={() => {
              if (isCollectionSelected) {
                return;
              }
              onBookLongPress(item, index);
            }}
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

            <View
              style={{
                flex: 1,
                marginLeft: SIZES.radius,
                alignSelf: "flex-start",
                marginTop: 1,
              }}
            >
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

    if (!isCollectionSelected) {
      // reading list is selected
      return (
        <View style={{ flex: 1, marginTop: SIZES.radius }}>
          {/* Header */}
          <View
            style={{
              paddingHorizontal: SIZES.padding,
              flexDirection: "row",
            }}
          >
            <ImageBackground
              style={{
                width: 26,
                height: 26,
                marginRight: 5,
                alignSelf: "center",
                marginTop: 2,
              }}
              resizeMode={"cover"}
              source={require("../../assets/book.png")}
            ></ImageBackground>
            <Text style={{ ...FONTS.h2, color: COLORS.white, marginRight: 15 }}>
              Reading List {Object.keys(readingList).length}
            </Text>
            <TouchableOpacity
              onPress={() => setIsCollectionSelected(true)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="book"
                color={COLORS.white}
                size={26}
                style={{
                  marginRight: 5,
                  height: 26,
                  alignSelf: "center",
                  opacity: 0.4,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Reading List */}
          {Object.keys(readingList).length > 0 ? (
            <FlatList
              data={Object.values(readingList)}
              renderItem={renderBookItem}
              keyExtractor={(item) => `${item.id}`}
              showsVerticalScrollIndicator={false}
              // paddingLeft: SIZES.padding,
              style={{ marginTop: SIZES.radius }}
              extraData={selectedIndexes}
            />
          ) : (
            <Text
              style={{
                color: COLORS.white,
                paddingHorizontal: SIZES.padding,
                marginTop: SIZES.radius,
              }}
            >
              Start Adding To Your Reading List To See Books Here
            </Text>
          )}
        </View>
      );
    }

    return (
      <View style={{ flex: 1, marginTop: SIZES.radius }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: SIZES.padding,
            flexDirection: "row",
          }}
        >
          <MaterialCommunityIcons
            name="book"
            color={COLORS.white}
            size={26}
            style={{ marginRight: 5, height: 26, alignSelf: "center" }}
          />
          <Text style={{ ...FONTS.h2, color: COLORS.white, marginRight: 15 }}>
            Collection {Object.keys(collection).length}
          </Text>
          <TouchableOpacity
            onPress={() => setIsCollectionSelected(false)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground
              style={{
                width: 26,
                height: 26,
                alignSelf: "center",
                opacity: 0.4,
                marginTop: 2,
              }}
              resizeMode={"cover"}
              source={require("../../assets/book.png")}
            ></ImageBackground>
          </TouchableOpacity>
          {Object.keys(collection).length > 0 && (
            <TouchableOpacity
              onPress={() => setShowSearch((prevValue) => !prevValue)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="magnify"
                color={COLORS.white}
                size={26}
                style={{
                  marginLeft: 10,
                  height: 26,
                  alignSelf: "center",
                  opacity: showSearch ? 1 : 0.4,
                }}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setReverseOrder((prevValue) => !prevValue)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <MaterialCommunityIcons
              name={reverseOrder ? "sort-ascending" : "sort-descending"}
              color={COLORS.white}
              size={26}
              style={{
                height: 26,
                alignSelf: "center",
                opacity: 0.4,
              }}
            />
          </TouchableOpacity>
        </View>

        {showSearch && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: SIZES.padding,
              paddingTop: SIZES.radius,
              alignItems: "center",
            }}
          >
            <SearchBar
              platform="android"
              containerStyle={{
                height: 60,
                width: "100%",
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
                setSearchText(search);
              }}
              onClear={() => setSearchText("")}
              value={searchText}
            />
          </View>
        )}

        {/* Collection */}
        {Object.keys(filteredCollection).length > 0 ? (
          <FlatList
            // data={
            //   reverseOrder ? filteredCollection.reverse() : filteredCollection
            // }
            data={filteredCollection}
            renderItem={renderBookItem}
            keyExtractor={(item) => `${item.id}`}
            showsVerticalScrollIndicator={false}
            style={{
              paddingLeft: SIZES.padding,
              marginTop: SIZES.radius,
              flexGrow: 0,
            }}
          />
        ) : (
          <Text
            style={{
              color: COLORS.white,
              paddingHorizontal: SIZES.padding,
              marginTop: SIZES.radius,
            }}
          >
            {showSearch && filteredCollection.length === 0
              ? "No matching results"
              : "Start Adding To Your Collection To See Books Here"}
          </Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.black, position: "relative" }}
    >
      {/* Body Section */}
      <ScrollView style={{ marginTop: SIZES.padding2 }}>
        {/* Favorites Section */}
        <View>{renderFavoritesSection()}</View>
        {/* Collection Section */}
        <View>{renderCollectionSection()}</View>
      </ScrollView>
      {!isCollectionSelected &&
      selectedIndexes &&
      selectedIndexes.length > 0 ? (
        <>
          {loading ? (
            <View
              style={{
                position: "absolute",
                backgroundColor: "#343f54a1",
                height: "100%",
                width: "100%",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: COLORS.white, marginBottom: 5 }}>
                Loading
              </Text>
              <Spinner
                size={Platform.OS === "android" ? 10 : "large"}
                color={COLORS.primary}
              />
            </View>
          ) : null}
          <View
            style={{
              position: "absolute",
              top: 35,
              left: 0,
              width: "100%",
              backgroundColor: COLORS.black,
              height: 50,
              paddingHorizontal: SIZES.padding,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setSelectedIndexes([]);
                setSelectedBooks([]);
              }}
            >
              <Image
                source={icons.back_arrow_icon}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: COLORS.white,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 10,
                marginBottom: 1,
                fontSize: 26,
                color: COLORS.white,
              }}
            >
              {selectedIndexes.length}
            </Text>
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: 24,
              }}
              onPress={onRemoveBooksFromReadingList}
            >
              <MaterialCommunityIcons name="delete" color="white" size={26} />
            </TouchableOpacity>
          </View>
          <View style={{ position: "absolute", bottom: 30, right: 30 }}>
            <TouchableOpacity
              style={{
                width: 60,
                height: 60,
                backgroundColor: COLORS.primary,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={onAddBooksToCollection}
            >
              <MaterialCommunityIcons
                name="book-plus"
                color="white"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : null}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1500}
        style={{ backgroundColor: "#448aff" }}
      >
        Added to collection successfully
      </Snackbar>
    </SafeAreaView>
  );
}

export default NewCollection;
