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
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import * as socialActions from "../actions/Social";
import { TouchableRipple } from "react-native-paper";
import { Icon } from "react-native-elements";
import { SearchBar } from "react-native-elements";
import Spinner from "../components/Spinner";

function Social(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  let friends = useSelector((state) => state.social.friends);
  const [showAddFriends, setShowAddFriends] = useState(false);
  let friendsCollections = useSelector(
    (state) => state.social.friendsCollections
  );
  let selectedFriend = useSelector((state) => state.social.selectedFriend);
  const [selectedFriendState, setSelectedFriendState] = useState(
    selectedFriend
  );

  const [collection, setCollection] = useState(
    selectedFriend ? selectedFriend.collection : null
  );
  const [searchText, setSearchText] = useState("");
  const [inputChanged, setInputChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const database = firebase.firestore();

  let stylesProps = { friendsLength: Object.keys(friends).length };

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
      if (friendsCollections[selectedFriend.uid]) {
        setCollection(friendsCollections[selectedFriend.uid]);
      } else {
        setCollection(null);
        setIsLoading(true);
        database
          .collection("users")
          .doc(selectedFriend.uid)
          .get()
          .then((response) => {
            let friendCollection = response.data().collection;
            dispatch(
              socialActions.addFriendCollection(
                selectedFriend.uid,
                friendCollection
              )
            );
            setCollection(friendCollection);
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

  return (
    <View style={styles(stylesProps).container}>
      <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: "bold" }}>
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
            backgroundColor: showAddFriends
              ? "rgb(26, 112, 255)"
              : "rgb(68, 138, 255)",
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
        {Object.keys(friends).length > 0 ? (
          <SafeAreaView style={styles(stylesProps).booksScrollView}>
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
                          ? "rgb(26, 112, 255)"
                          : "rgb(68, 138, 255)",
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
                        }}
                      >
                        {displayInitials(item)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              horizontal={true}
              keyExtractor={(item) => item.uid}
            />
          </SafeAreaView>
        ) : (
          <Text
            style={{
              marginLeft: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
            }}
          >
            Start Adding Some Friends
          </Text>
        )}
      </View>

      {!selectedFriendState || showAddFriends ? (
        <View style={{ flex: 1 }}>
          {isLoading ? (
            <View style={styles(stylesProps).loadingContainer}>
              <Text>Loading</Text>
              <Spinner
                size={Platform.OS === "android" ? 10 : "large"}
                color={Platform.OS === "android" ? "#448aff" : undefined}
              />
            </View>
          ) : (
            <SafeAreaView style={styles(stylesProps).collectionContainer}>
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
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "flex-start",
                        marginLeft: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          lineHeight: 14,
                          fontSize: 14,
                        }}
                      >
                        {item.firstName + " " + item.lastName}
                      </Text>
                    </View>
                    {friends[item.uid] ? (
                      <View
                        style={{
                          height: 30,
                          width: 100,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                          position: "absolute",
                          right: 0,
                        }}
                      >
                        <Icon
                          color="#448aff"
                          type="ionicon"
                          name={
                            Platform.OS === "ios"
                              ? "ios-checkmark-circle-outline"
                              : "md-checkmark-circle-outline"
                          }
                          iconStyle={{ width: 26, textAlign: "center" }}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        key={item.uid}
                        style={{
                          height: 30,
                          width: 100,
                          borderTopLeftRadius: 25,
                          borderTopRightRadius: 25,
                          borderBottomLeftRadius: 25,
                          borderBottomRightRadius: 25,
                          backgroundColor: "red",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
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
            </SafeAreaView>
          )}
        </View>
      ) : (
        <View
          style={{ flex: 1, marginTop: 2, marginBottom: 5, direction: "ltr" }}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text
              style={{
                marginLeft: 5,
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
                fontSize: 20,
                fontWeight: "bold",
                direction: "ltr",
              }}
            >
              {selectedFriendState ? "'s" : ""}
            </Text>
            <Text
              style={{
                marginLeft: 5,
                fontSize: 20,
                fontWeight: "bold",
                direction: "ltr",
              }}
            >
              Collection {collection ? Object.keys(collection).length : 0}
            </Text>
          </View>
          {collection && Object.keys(collection).length > 0 ? (
            <SafeAreaView style={styles(stylesProps).collectionContainer}>
              <FlatList
                data={Object.values(collection)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.bookID}
                    style={{
                      marginLeft: 5,
                      marginBottom: 5,
                      height: 200,
                      marginRight: 5,
                    }}
                    onPress={() => onBookPress(item.book)}
                  >
                    <View>
                      <Image
                        style={{ height: 200, width: 150 }}
                        source={
                          item.book.imageLinks
                            ? {
                                uri: item.book.imageLinks.thumbnail,
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
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
                keyExtractor={(item) => item.bookID}
              />
            </SafeAreaView>
          ) : isLoading ? (
            <View style={styles(stylesProps).loadingContainer}>
              <Text>Loading</Text>
              <Spinner
                size={Platform.OS === "android" ? 10 : "large"}
                color={Platform.OS === "android" ? "#448aff" : undefined}
              />
            </View>
          ) : (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ marginLeft: 5, direction: "ltr" }}>
                {selectedFriendState.firstName.substring(0, 1).toUpperCase() +
                  selectedFriendState.firstName.substring(1)}
              </Text>
              <Text style={{ marginLeft: 5, direction: "ltr" }}>
                has no books in their collection.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default Social;

const styles = (props) =>
  StyleSheet.create({
    container: {
      height: Dimensions.get("window").height - 64 - 54,
      display: "flex",
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
    },
    booksScrollView: {
      height: 60,
      width: Dimensions.get("window").width - 60,
    },
    collectionContainer: {
      //289 is 220 for scrollview div, plus 2 titles each 27 plus margins
      height:
        props.friendsLength > 0
          ? Dimensions.get("window").height - 64 - 54 - 312
          : 0.684 * Dimensions.get("window").height,
      width: "100%",
      marginTop: 5,
      marginBottom: 5,
      flex: 1,
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
  });
