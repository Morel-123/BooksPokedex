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
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/Auth";
import * as booksActions from "../actions/Books";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function Main(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [books, setBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const database = firebase.firestore();

  const user = useSelector((state) => state.auth.user);
  const historyBooks = useSelector((state) => state.books.historyBooks);
  useEffect(() => {
    setCurrentUser(firebase.auth().currentUser);
    database
      .collection("books")
      // .doc(firebase.auth().currentUser.uid)
      .get()
      .then(function (response) {
        console.log(response);
        let booksFromDB = [];
        response.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          booksFromDB.push(doc.data());
        });
        console.log(booksFromDB);
        // setBooks(booksFromDB);
        // setIsLoading(false);
      })
      .catch((error) => console.log(error.message));
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
          responseJson.items.forEach((book) => {
            googleBooks.push(book.volumeInfo);
          });
          dispatch(booksActions.setHistoryBooks(googleBooks));
          setBooks(googleBooks);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

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
    props.navigation.navigate("Book");
  };

  return (
    <View style={styles.container}>
      {/* <Text style={{ position: "fixed", top: 0, zIndex: 1 }}>
        Hi {currentUser && currentUser.email}!
      </Text> */}
      <Text style={styles.title}>My Books</Text>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => {
          console.log("plusPress");
          // handleOnBackPress();
        }}
      >
        <FontAwesome name="plus" color="#ffffff" size={24} />
      </TouchableOpacity>
      {/* <Text style={{position: "fixed"}}> */}
      {/* Hi {user && user.firstName} {user && user.lastName}{" "} */}
      {/* {user && user.gender} */}
      {/* </Text> */}

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
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            )}
            numColumns={2}
            columnWrapperStyle={{display: "flex", justifyContent: "space-evenly", marginBottom: 10}}
            keyExtractor={(item) => item.title}
            onEndReached={(dis) => {
              console.log(dis)
              if (dis.distanceFromEnd < 0) {
                return;
              }
              setBooks((data) => {
                return [...data, ...data];
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
    height: Dimensions.get("window").height * 0.84,
    width: "100%",
    marginTop: 10,
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
    height: Dimensions.get("window").height * 0.8,
    backgroundColor: "pink",
    width: "100%",
    marginTop: 10,
    marginBottom: 5,
  },
});
