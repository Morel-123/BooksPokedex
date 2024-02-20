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
  SafeAreaView,
  FlatList,
  Platform,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import * as socialActions from "../actions/Social";
import { TouchableRipple } from "react-native-paper";
import { Icon } from "react-native-elements";
import Spinner from "../components/Spinner";
import { COLORS, FONTS, SIZES, icons } from "../constants";

function NewSocial(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  let friends = useSelector((state) => state.social.friends);
  const [showAddFriends, setShowAddFriends] = useState(false);
  let friendsCollections = useSelector(
    (state) => state.social.friendsCollections
  );
  let friendsReadingLists = useSelector(
    (state) => state.social.friendsReadingLists
  );
  let selectedFriend = useSelector((state) => state.social.selectedFriend);
  const [selectedFriendState, setSelectedFriendState] =
    useState(selectedFriend);

  const [collection, setCollection] = useState(
    selectedFriend ? selectedFriend.collection : null
  );
  const [readingList, setReadingList] = useState(
    selectedFriend ? selectedFriend.readingList : null
  );
  const [isCollectionSelected, setIsCollectionSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const database = firebase.firestore();
  const [reverseOrder, setReverseOrder] = useState(false);

  useEffect(() => {
    if (
      !showAddFriends &&
      !selectedFriend &&
      friends &&
      Object.keys(friends).length > 0
    ) {
      selectedFriend = friends[Object.keys(friends)[0]];
    }
    setSelectedFriendState(selectedFriend);
    if (selectedFriend) {
      setShowAddFriends(false);
      const existingFriendCollection = friendsCollections[selectedFriend.uid];
      const existingFriendReadingList = friendsReadingLists[selectedFriend.uid];
      if (existingFriendCollection && existingFriendReadingList) {
        setCollection(friendsCollections[selectedFriend.uid]);
        setReadingList(friendsReadingLists[selectedFriend.uid]);
      } else {
        if (!existingFriendCollection) {
          setCollection(null);
        }
        if (!existingFriendReadingList) {
          setReadingList(null);
        }
        setIsLoading(true);
        database
          .collection("users")
          .doc(selectedFriend.uid)
          .get()
          .then((response) => {
            const responseData = response.data();
            if (!existingFriendCollection) {
              let friendCollection = responseData.collection;
              friendCollection = friendCollection.map((bookObject) => {
                if (bookObject.book.imageLinks) {
                  bookObject.book.imageLinks.thumbnail =
                    bookObject.book.imageLinks.thumbnail.replace(
                      "http://",
                      "https://"
                    );
                }
                return bookObject;
              });
              dispatch(
                socialActions.addFriendCollection(
                  selectedFriend.uid,
                  friendCollection
                )
              );
              setCollection(friendCollection);
            }
            if (!existingFriendReadingList) {
              let friendReadingList = responseData.readingList;
              friendReadingList = friendReadingList.map((bookObject) => {
                if (bookObject.book.imageLinks) {
                  bookObject.book.imageLinks.thumbnail =
                    bookObject.book.imageLinks.thumbnail.replace(
                      "http://",
                      "https://"
                    );
                }
                return bookObject;
              });
              dispatch(
                socialActions.addFriendReadingList(
                  selectedFriend.uid,
                  friendReadingList
                )
              );
              setReadingList(friendReadingList);
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      setShowAddFriends(true);
    }
  }, [selectedFriend]);

  useEffect(() => {
    setIsLoading(true);
    database
      .collection("users")
      .get()
      .then((response) => {
        let usersFromDB = [];
        response.docs.map((doc) => {
          usersFromDB.push({
            uid: doc.data().uid,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            expoPushToken: doc.data().expoPushToken,
          });
        });
        setUsers(usersFromDB);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onBookPress = (book) => {
    dispatch(booksActions.setCurrentBook(book));
    props.navigation.navigate("Book Info");
  };

  const displayInitials = (friend) => {
    return (
      "" +
      friend.firstName.substring(0, 1).toUpperCase() +
      friend.lastName.substring(0, 1).toUpperCase()
    );
  };

  const selectFriend = (friend) => {
    dispatch(socialActions.setCurrentFriend(friend));
  };

  const onAddFriendsPressed = () => {
    dispatch(socialActions.setCurrentFriend(null));
    setShowAddFriends(true);
  };

  const addFriend = (friend) => {
    database
      .collection("users")
      .doc(user.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion({
          uid: friend.uid,
          friend: friend,
        }),
      })
      .then(function () {
        dispatch(socialActions.addFriend(friend));
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const removeFriend = (friend) => {
    database
      .collection("users")
      .doc(user.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayRemove({
          uid: friend.uid,
          friend: friend,
        }),
      })
      .then(function () {
        dispatch(socialActions.removeFriend(friend));
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const containsHebrew = (str) => {
    return /[\u0590-\u05FF]/.test(str);
  };

  function renderFriendsSection() {
    return (
      <View style={{ flex: 1 }}>
        {Object.keys(friends).length > 0 ? (
          <FlatList
            data={Object.values(friends)}
            extraData={selectedFriendState}
            renderItem={({ item }) => (
              <View
                style={{
                  height: 60,
                  width: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  key={item.uid}
                  style={{
                    height: 50,
                    width: 50,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    backgroundColor:
                      !showAddFriends &&
                      selectedFriendState &&
                      item.uid == selectedFriendState.uid
                        ? COLORS.primary
                        : "#f96d41c4",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                    position: "relative",
                  }}
                  onPress={() => selectFriend(item)}
                >
                  <View>
                    <Text
                      style={{
                        fontWeight: "bold",
                        lineHeight: 14,
                        fontSize: 14,
                        color:
                          !showAddFriends &&
                          selectedFriendState &&
                          item.uid == selectedFriendState.uid
                            ? "white"
                            : "#bdbdbd",
                        marginTop: Platform.OS === "android" ? 3 : 0,
                      }}
                    >
                      {displayInitials(item)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.uid}
          />
        ) : (
          <Text
            style={{
              marginLeft: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
              color: "white",
            }}
          >
            Start Adding Some Friends
          </Text>
        )}
      </View>
    );
  }

  function renderFriendsCollectionSection() {
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

    if (!isCollectionSelected) {
      return (
        <View style={{ flex: 1, direction: "ltr" }}>
          {readingList && Object.keys(readingList).length > 0 ? (
            <FlatList
              data={Object.values(readingList)}
              renderItem={({ item }) => renderBookItem({ item: item.book })}
              keyExtractor={(item) => `${item.bookID}`}
              showsVerticalScrollIndicator={false}
              style={{ paddingLeft: SIZES.padding }}
            />
          ) : isLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: COLORS.white, marginBottom: 5 }}>
                Loading
              </Text>
              <Spinner
                size={Platform.OS === "android" ? 10 : "large"}
                color={Platform.OS === "android" ? COLORS.primary : undefined}
              />
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: SIZES.padding,
              }}
            >
              <Text style={{ direction: "ltr", color: "white" }}>
                {selectedFriendState.firstName.substring(0, 1).toUpperCase() +
                  selectedFriendState.firstName.substring(1)}
              </Text>
              <Text style={{ marginLeft: 5, direction: "ltr", color: "white" }}>
                has no books in their reading list.
              </Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={{ flex: 1, direction: "ltr" }}>
        {collection && Object.keys(collection).length > 0 ? (
          <FlatList
            data={
              reverseOrder
                ? Object.values(collection).reverse()
                : Object.values(collection)
            }
            renderItem={({ item }) => renderBookItem({ item: item.book })}
            keyExtractor={(item) => `${item.bookID}`}
            showsVerticalScrollIndicator={false}
            style={{ paddingLeft: SIZES.padding }}
          />
        ) : isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: COLORS.white, marginBottom: 5 }}>
              Loading
            </Text>
            <Spinner
              size={Platform.OS === "android" ? 10 : "large"}
              color={Platform.OS === "android" ? COLORS.primary : undefined}
            />
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingLeft: SIZES.padding,
            }}
          >
            <Text style={{ direction: "ltr", color: "white" }}>
              {selectedFriendState.firstName.substring(0, 1).toUpperCase() +
                selectedFriendState.firstName.substring(1)}
            </Text>
            <Text style={{ marginLeft: 5, direction: "ltr", color: "white" }}>
              has no books in their collection.
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderAddFriendsSection() {
    return (
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: COLORS.white, marginBottom: 5 }}>
              Loading
            </Text>
            <Spinner
              size={Platform.OS === "android" ? 10 : "large"}
              color={Platform.OS === "android" ? COLORS.primary : undefined}
            />
          </View>
        ) : (
          <FlatList
            data={users}
            extraData={friends}
            renderItem={({ item }) => (
              <View
                style={{
                  height: 50,
                  backgroundColor: "ff4336",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  marginBottom: 2,
                  borderBottomColor: "#9e9e9eb3",
                  borderBottomWidth: 1,
                  paddingLeft: SIZES.padding,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      lineHeight: 14,
                      fontSize: 14,
                      color: COLORS.white,
                    }}
                  >
                    {item.firstName + " " + item.lastName}
                  </Text>
                </View>
                {friends[item.uid] ? (
                  <TouchableOpacity
                    key={item.uid}
                    style={{
                      height: 30,
                      width: 100,
                      borderTopLeftRadius: 25,
                      borderTopRightRadius: 25,
                      borderBottomLeftRadius: 25,
                      borderBottomRightRadius: 25,
                      // backgroundColor: COLORS.primary,
                      borderColor: "#ffffffd1",
                      borderWidth: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: SIZES.padding,
                      position: "absolute",
                      right: 0,
                    }}
                    onPress={() => removeFriend(item)}
                  >
                    <View>
                      <Text
                        style={{
                          fontWeight: "bold",
                          lineHeight: 14,
                          fontSize: 14,
                          color: "white",
                          marginTop: Platform.OS === "android" ? 3 : 0,
                        }}
                      >
                        Remove
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  // <View
                  //   style={{
                  //     height: 30,
                  //     width: 100,
                  //     display: "flex",
                  //     justifyContent: "center",
                  //     alignItems: "center",
                  //     marginRight: SIZES.padding,
                  //     position: "absolute",
                  //     right: 0,
                  //   }}
                  // >
                  //   <Icon
                  //     color={COLORS.primary}
                  //     type="ionicon"
                  //     name={
                  //       Platform.OS === "ios"
                  //         ? "ios-checkmark-circle-outline"
                  //         : "md-checkmark-circle-outline"
                  //     }
                  //     iconStyle={{ width: 26, textAlign: "center" }}
                  //   />
                  // </View>
                  <TouchableOpacity
                    key={item.uid}
                    style={{
                      height: 30,
                      width: 100,
                      borderTopLeftRadius: 25,
                      borderTopRightRadius: 25,
                      borderBottomLeftRadius: 25,
                      borderBottomRightRadius: 25,
                      backgroundColor: COLORS.primary,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: SIZES.padding,
                      position: "absolute",
                      right: 0,
                    }}
                    onPress={() => addFriend(item)}
                  >
                    <View>
                      <Text
                        style={{
                          fontWeight: "bold",
                          lineHeight: 14,
                          fontSize: 14,
                          color: "white",
                          marginTop: Platform.OS === "android" ? 3 : 0,
                        }}
                      >
                        Add Friend
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
            keyExtractor={(item) => item.uid}
          />
        )}
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.black,
        paddingTop: SIZES.padding2,
      }}
    >
      {/* Body Section */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: COLORS.white,
          paddingHorizontal: SIZES.padding,
        }}
      >
        Friends {Object.keys(friends).length}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          borderBottomColor: "#9e9e9eb3",
          borderBottomWidth: 1,
          alignItems: "center",
          height: 65,
          paddingHorizontal: SIZES.padding,
        }}
      >
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            backgroundColor: showAddFriends ? COLORS.primary : "#f96d41c4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
            position: "relative",
          }}
          onPress={() => onAddFriendsPressed()}
        >
          <View>
            <Icon
              color={showAddFriends ? "white" : "#bdbdbd"}
              type="ionicon"
              name={Platform.OS === "ios" ? "ios-person-add" : "md-person-add"}
              iconStyle={{ width: 26, textAlign: "center" }}
            />
          </View>
        </TouchableOpacity>
        {renderFriendsSection()}
      </View>
      {!selectedFriendState || showAddFriends ? (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1 }}>{renderAddFriendsSection()}</View>
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, marginTop: 5, marginBottom: 5, direction: "ltr" }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 5,
              height: 28,
            }}
          >
            <Text
              style={{
                paddingLeft: SIZES.padding,
                color: COLORS.white,
                fontSize: 20,
                fontWeight: "bold",
                direction: "ltr",
              }}
            >
              {selectedFriendState
                ? selectedFriendState.firstName.substring(0, 1).toUpperCase() +
                  selectedFriendState.firstName.substring(1)
                : ""}
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 20,
                fontWeight: "bold",
                direction: "ltr",
              }}
            >
              {selectedFriendState ? "'s" : ""}
            </Text>
            {isCollectionSelected ? (
              <>
                <Text
                  style={{
                    color: COLORS.white,
                    marginLeft: 5,
                    fontSize: 20,
                    fontWeight: "bold",
                    direction: "ltr",
                    marginRight: 15,
                  }}
                >
                  Collection {collection ? Object.keys(collection).length : 0}
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
                      marginRight: 5,
                      alignSelf: "center",
                      opacity: 0.4,
                      marginTop: 2,
                    }}
                    resizeMode={"cover"}
                    source={require("../../assets/book.png")}
                  ></ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setReverseOrder((prevValue) => !prevValue)}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "auto",
                    marginRight: 5,
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
              </>
            ) : (
              <>
                <Text
                  style={{
                    color: COLORS.white,
                    marginLeft: 5,
                    fontSize: 20,
                    fontWeight: "bold",
                    direction: "ltr",
                    marginRight: 15,
                  }}
                >
                  Reading List{" "}
                  {readingList ? Object.keys(readingList).length : 0}
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
              </>
            )}
          </View>
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={{ flex: 1 }}>{renderFriendsCollectionSection()}</View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

export default NewSocial;
