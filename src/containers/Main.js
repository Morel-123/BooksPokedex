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
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/Auth";
import * as booksActions from "../actions/Books";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function Main(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();
  const database = firebase.firestore();

  const user = useSelector((state) => state.auth.user);

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
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
          booksFromDB.push(doc.data());
        });
        console.log(booksFromDB);
        setBooks(booksFromDB);
      })
      .catch((error) => console.log(error.message));
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

      <ScrollView style={styles.booksScrollView}>
        <View style={styles.booksContainer}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.bookName}
              style={{ width: "33%", marginLeft: 5, marginBottom: 5 }}
              onPress={() => onBookPress(book)}
            >
              {/* <Text>{book.bookName}</Text> */}
              <View style={{ width: "100%" }}>
                <Image
                  style={{ height: 200 }}
                  source={{
                    uri: book.imageUrl,
                  }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
    flexWrap: "wrap",
  },
  booksScrollView: {
    // height: "80%",
    height: Dimensions.get("window").height * 0.8,
    backgroundColor: "pink",
    width: "100%",
    // marginTop: 20,
    marginBottom: 5,
  },
  plusButton: {
    position: "absolute",
    top: 17,
    right: 10,
  },
  title: {
    // marginTop: 10,
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    width: "100%",
    backgroundColor: "#ff4336",
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
    // alignSelf: "flex-start",
  },
});
