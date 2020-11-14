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
// import { useDebounce } from "use-debounce";
import Spinner from "../components/Spinner";

function Social(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  let friends = useSelector((state) => state.social.friends);
  console.log(friends);
  //   friends = {
  //     1: { uid: "1", firstName: "mor", lastName: "tzhory", collection: [] },
  //     2: { uid: "2", firstName: "אוראל", lastName: "זילברמן", collection: null },
  //   };
  const [showAddFriends, setShowAddFriends] = useState(false);
  let selectedFriend = useSelector((state) => state.social.selectedFriend);
  if (
    !showAddFriends &&
    !selectedFriend &&
    friends &&
    Object.keys(friends).length > 0
  ) {
    selectedFriend = friends[Object.keys(friends)[0]];
  }
  console.log("selectefriend");
  console.log(selectedFriend);

  let collection = selectedFriend ? selectedFriend.collection : null;
  const [searchText, setSearchText] = useState("");
  const [inputChanged, setInputChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  //   const debouncedSearchText = useDebounce(searchText, 300);
  const database = firebase.firestore();

  let stylesProps = { friendsLength: Object.keys(friends).length };

  useEffect(() => {
    setIsLoading(true);
    database
      .collection("users")
      .get()
      .then((response) => {
        console.log(response);
        let usersFromDB = [];
        response.docs.map((doc) => {
          usersFromDB.push(doc.data());
        });
        setUsers(usersFromDB);
        setIsLoading(false);
        // setTimeout(() => {
        // }, 100);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onBookPress = (book) => {
    console.log(book);
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
    console.log(friend);
    dispatch(socialActions.setCurrentFriend(friend));
    setShowAddFriends(false);
  };

  const onAddFriendsPressed = () => {
    setShowAddFriends(true);
  };

  const addFriend = (friend) => {
    console.log(friend);
    // dispatch(socialActions.addFriend(friend));
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
            // marginTop: 7,
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
                        !showAddFriends && item.uid === selectedFriend.uid
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
                          color:
                            !showAddFriends && item.uid === selectedFriend.uid
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
              // numColumns={2}
              horizontal={true}
              //   columnWrapperStyle={{
              //     display: "flex",
              //     justifyContent: "space-evenly",
              //     marginBottom: 10,
              //   }}
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

      {!selectedFriend || showAddFriends ? (
        // <Text style={{ marginLeft: 5 }}>Need to add search bar here</Text>
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
                      //   width: 50,
                      //   borderRadius: "50%",
                      backgroundColor: "ff4336",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      //   marginRight: 10,
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
                // numColumns={2}
                // horizontal={true}
                //   columnWrapperStyle={{
                //     display: "flex",
                //     justifyContent: "space-evenly",
                //     marginBottom: 10,
                //   }}
                keyExtractor={(item) => item.uid}
              />
            </SafeAreaView>
          )}
        </View>
      ) : (
        <View style={{ flex: 1, marginTop: 2, marginBottom: 5 }}>
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: "bold",
              direction: "ltr",
            }}
          >
            {selectedFriend
              ? selectedFriend.firstName.substring(0, 1).toUpperCase() +
                selectedFriend.firstName.substring(1) +
                "'s "
              : ""}
            Collection {collection ? Object.keys(collection).length : 0}
          </Text>
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
                // horizontal={true}
                columnWrapperStyle={{
                  display: "flex",
                  // justifyContent: "space-evenly",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
                keyExtractor={(item) => item.bookID}
              />
            </SafeAreaView>
          ) : (
            <Text style={{ marginLeft: 5, direction: "ltr" }}>
              {selectedFriend.firstName.substring(0, 1).toUpperCase() +
                selectedFriend.firstName.substring(1) +
                " has no books in their collection."}
            </Text>
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
      // flex: 1,
      height: Dimensions.get("window").height - 64 - 54,
      display: "flex",
      // justifyContent: "center",
      // alignItems: "center",
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
    },
    booksScrollView: {
      // height: "50%",
      height: 60,
      width: Dimensions.get("window").width - 60,
      //   marginTop: 7,
      //   borderBottomColor: "#9e9e9eb3",
      //   borderBottomWidth: 1,
      //   marginBottom: 5,
      //   display: "flex",
      //   alignItems: "center",
    },
    collectionContainer: {
      //289 is 220 for scrollview div, plus 2 titles each 27 plus margins
      height:
        props.friendsLength > 0
          ? Dimensions.get("window").height - 64 - 54 - 312
          : 0.684 * Dimensions.get("window").height,
      width: "100%",
      marginTop: 5,
      flex: 1,
      // marginBottom: 5
    },
    loadingContainer: {
      height: "60%",
      width: "100%",
      marginTop: 5,
      marginBottom: 5,
      // backgroundColor: "pink",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

// height: 40;
// width: 40;
// border-radius: 50%;
// background: aqua;
// display: flex;
// justify-content: center;
// align-items: center;
// margin: 0;
// position: relative;
