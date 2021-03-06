import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { FONTS, COLORS, SIZES, icons } from "../constants";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Button } from "react-native-elements";
import { Snackbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as booksActions from "../actions/Books";
import Root from "../components/Root";
import Popup from "../components/Popup";

const LineDivider = () => {
  return (
    <View style={{ width: 1, paddingVertical: 5 }}>
      <View
        style={{
          flex: 1,
          borderLeftColor: COLORS.lightGray2,
          borderLeftWidth: 1,
        }}
      ></View>
    </View>
  );
};

const BookDetail = (props) => {
  const dispatch = useDispatch();
  const database = firebase.firestore();

  let book = useSelector((state) => state.books.selectedBook);

  const [scrollViewWholeHeight, setScrollViewWholeHeight] = useState(1);
  const [scrollViewVisibleHeight, setScrollViewVisibleHeight] = useState(0);

  let favoriteBooks = useSelector((state) => state.books.favoriteBooks);
  const [liked, setLiked] = useState(
    book ? (favoriteBooks[book.id] ? true : false) : false
  );

  let collection = useSelector((state) => state.books.collection);
  const user = useSelector((state) => state.auth.user);
  const [visible, setVisible] = useState(false);
  const [isInCollection, setIsInCollection] = useState(
    book ? (collection[book.id] ? true : false) : false
  );
  const [loadingCollectionRequest, setLoadingCollectionRequest] = useState(
    false
  );
  const [showPopup, setShowPopup] = useState(false);

  const indicator = new Animated.Value(0);

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

  const onAddOrRemoveBookToCollection = () => {
    setLoadingCollectionRequest(true);
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
      .then(async function () {
        let needToNotifyFriends = false;
        let message = "The book was added successfully";
        if (isInCollection) {
          dispatch(booksActions.removeFromCollection(book));
          message = "The book was removed successfully";
        } else {
          dispatch(booksActions.addToCollection(book));
          needToNotifyFriends = true;
        }
        let callback = () => {
          setLoadingCollectionRequest(false);
          setShowPopup(false);
        };
        displySuccessPopup(message, callback);
        if (needToNotifyFriends) {
          await notifyFriendOnAddToCollection(book);
        }
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  async function notifyFriendOnAddToCollection(book) {
    let recipients = [];
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i].friend.expoPushToken) {
        recipients.push(user.friends[i].friend.expoPushToken);
      }
    }
    const message = {
      to: recipients,
      sound: "default",
      title: `${
        user.firstName.substring(0, 1).toUpperCase() +
        user.firstName.substring(1)
      } just finished a book`,
      body: `${book.title} was added to their collection!`,
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

  const displySuccessPopup = (message, userCallback) => {
    setShowPopup(true);
    Popup.show({
      type: "Success",
      title: "Awesome",
      button: true,
      textBody: message,
      buttonText: "Ok",
      callback: () => {
        Popup.hide();
        userCallback();
      },
    });
  };

  function renderBookInfoSection() {
    return (
      <View
        style={{ flex: 1.1, display: "flex", justifyContent: "space-evenly" }}
      >
        <ImageBackground
          source={
            book.imageLinks
              ? {
                  uri: book.imageLinks.thumbnail,
                }
              : require("../../assets/no_cover_thumb.png")
          }
          resizeMode="cover"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.5,
          }}
        />

        {/* Color Overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "#cfcfcf",
            opacity: 0.5,
          }}
        ></View>

        {/* Navigation header */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: SIZES.radius,
            height: 40,
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: SIZES.base }}
            onPress={() => props.navigation.goBack()}
          >
            <Image
              source={icons.back_arrow_icon}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.black,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Book Cover */}
        <View
          style={{
            height: 200,
            alignItems: "center",
          }}
        >
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.3,
              shadowRadius: 7,
              elevation: showPopup ? 0 : 8,
              backgroundColor: "#000",
              zIndex: 2,
            }}
          >
            <Image
              source={
                book.imageLinks
                  ? {
                      uri: book.imageLinks.thumbnail,
                    }
                  : require("../../assets/no_cover_thumb.png")
              }
              resizeMode="stretch"
              style={{
                flex: 1,
                width: 150,
                height: 200,
              }}
            />
          </View>
        </View>

        {/* Book Name and Author */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.black,
              textAlign: "center",
              marginHorizontal: 5,
            }}
          >
            {book.title}
          </Text>
          <Text style={{ ...FONTS.body3, color: COLORS.black }}>
            {book.authors ? book.authors[0] : "Not Specified"}
          </Text>
        </View>

        {/* Book Info */}
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 20,
            borderRadius: SIZES.radius,
            backgroundColor: "rgba(0,0,0,0.3)",
            marginVertical: 5,
            marginHorizontal: 15,
          }}
        >
          {/* Genre */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 5,
              textAlign: "center",
            }}
          >
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>
              {book.categories
                ? book.categories[0].split(" ")[0]
                : "Not Specified"}
            </Text>
            <Text style={{ ...FONTS.body4, color: COLORS.white }}>Genre</Text>
          </View>

          <LineDivider />

          {/* Pages */}
          <View
            style={{
              flex: 1,
              // paddingHorizontal: SIZES.radius,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 5,
            }}
          >
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>
              {book.pageCount ? book.pageCount : "N/A"}
            </Text>
            <Text style={{ ...FONTS.body4, color: COLORS.white }}>Pages</Text>
          </View>

          <LineDivider />

          {/* Released */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 5,
            }}
          >
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>
              {book.publishedDate && book.publishedDate.length > 0
                ? book.publishedDate.substring(0, 4)
                : "N/A"}
            </Text>
            <Text style={{ ...FONTS.body4, color: COLORS.white }}>
              Released
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function renderBookDescription() {
    const indicatorSize =
      scrollViewWholeHeight > scrollViewVisibleHeight
        ? (scrollViewVisibleHeight * scrollViewVisibleHeight) /
          scrollViewWholeHeight
        : scrollViewVisibleHeight;

    const difference =
      scrollViewVisibleHeight > indicatorSize
        ? scrollViewVisibleHeight - indicatorSize
        : 1;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          padding: SIZES.padding,
          paddingVertical: 20,
        }}
      >
        {/* Custom Scrollbar */}
        <View
          style={{ width: 4, height: "100%", backgroundColor: COLORS.gray1 }}
        >
          <Animated.View
            style={{
              width: 4,
              height: indicatorSize,
              backgroundColor: COLORS.lightGray4,
              transform: [
                {
                  translateY: Animated.multiply(
                    indicator,
                    scrollViewVisibleHeight / scrollViewWholeHeight
                  ).interpolate({
                    inputRange: [0, difference],
                    outputRange: [0, difference],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          />
        </View>

        {/* Description */}
        <ScrollView
          contentContainerStyle={{ paddingLeft: SIZES.padding2 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onContentSizeChange={(width, height) => {
            setScrollViewWholeHeight(height);
          }}
          onLayout={({
            nativeEvent: {
              layout: { x, y, width, height },
            },
          }) => {
            setScrollViewVisibleHeight(height);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: indicator } } }],
            { useNativeDriver: false }
          )}
        >
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.white,
              marginBottom: 6,
            }}
          >
            Description
          </Text>
          <Text style={{ ...FONTS.body2, color: COLORS.lightGray }}>
            {book.description && book.description.length > 0
              ? book.description
              : "No description at the moment."}
          </Text>
        </ScrollView>
      </View>
    );
  }

  function renderBottomButton() {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Like */}
        <TouchableOpacity
          style={{
            width: 60,
            backgroundColor: COLORS.secondary,
            marginLeft: SIZES.padding,
            marginVertical: SIZES.base,
            borderRadius: SIZES.radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={onBookLikePress}
        >
          {liked ? (
            <Icon
              color={COLORS.lightGray2}
              type="ionicon"
              name={Platform.OS === "ios" ? "ios-heart" : "md-heart"}
              iconStyle={{ width: 26, textAlign: "center" }}
            />
          ) : (
            <Icon
              color={COLORS.lightGray2}
              type="ionicon"
              name={
                Platform.OS === "ios" ? "ios-heart-empty" : "md-heart-empty"
              }
              iconStyle={{ width: 26, textAlign: "center" }}
            />
          )}
        </TouchableOpacity>

        {/* Add to collection */}

        {isInCollection ? (
          <Button
            title="Remove From Collection"
            titleStyle={{
              paddingBottom: 0,
              paddingTop: 0,
              ...FONTS.h3,
              color: COLORS.white,
            }}
            onPress={onAddOrRemoveBookToCollection}
            buttonStyle={{
              flex: 1,
              backgroundColor: COLORS.primary,
              marginHorizontal: SIZES.base,
              marginVertical: SIZES.base,
              borderRadius: SIZES.radius,
              alignItems: "center",
              justifyContent: "center",
              height: "auto",
              paddingVertical: 12,
            }}
            containerStyle={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
            }}
            loading={loadingCollectionRequest}
          />
        ) : (
          <Button
            component={TouchableOpacity}
            title="Add To Collection"
            titleStyle={{
              paddingBottom: 0,
              paddingTop: 0,
              ...FONTS.h3,
              color: COLORS.white,
            }}
            onPress={onAddOrRemoveBookToCollection}
            buttonStyle={{
              flex: 1,
              backgroundColor: COLORS.primary,
              marginHorizontal: SIZES.base,
              marginVertical: SIZES.base,
              borderRadius: SIZES.radius,
              alignItems: "center",
              justifyContent: "center",
              height: "auto",
              paddingVertical: 12,
            }}
            containerStyle={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
            }}
            loading={loadingCollectionRequest}
          />
        )}
      </View>
    );
  }

  if (book) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.black,
          height: Dimensions.get("window").height,
        }}
      >
        <Root>
          {/* Book Cover Section */}
          <View style={{ flex: 3 }}>{renderBookInfoSection()}</View>

          {/* Description */}
          <View style={{ flex: 1.2 }}>{renderBookDescription()}</View>

          {/* Buttons */}
          <View style={{ height: 70, marginBottom: 10 }}>
            {renderBottomButton()}
          </View>
          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            duration={1500}
            style={{ backgroundColor: "#448aff" }}
          >
            {liked ? "Added to Favorites" : "Removed from Favorites"}
          </Snackbar>
        </Root>
      </View>
    );
  } else {
    return <></>;
  }
};

export default BookDetail;
