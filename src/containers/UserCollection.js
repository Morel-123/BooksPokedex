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
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import { TouchableRipple } from "react-native-paper";

function UserCollection(props) {
  const dispatch = useDispatch();
  let favoriteBooks = useSelector((state) => state.books.favoriteBooks);
  console.log(favoriteBooks);
  let collection = useSelector((state) => state.books.collection);

  let stylesProps = { favoritesLength: Object.keys(favoriteBooks).length };

  useEffect(() => {}, []);

  const onBookPress = (book) => {
    console.log(book);
    dispatch(booksActions.setCurrentBook(book));
    props.navigation.navigate("Book Info");
  };

  return (
    <View style={styles(stylesProps).container}>
      <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: "bold" }}>
        Favorites {Object.keys(favoriteBooks).length}
      </Text>
      {Object.keys(favoriteBooks).length > 0 ? (
        <SafeAreaView style={styles(stylesProps).booksScrollView}>
          <FlatList
            data={Object.values(favoriteBooks)}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  marginLeft: 5,
                  marginBottom: 5,
                  height: 220,
                  marginRight: 5,
                }}
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
            // numColumns={2}
            horizontal={true}
            //   columnWrapperStyle={{
            //     display: "flex",
            //     justifyContent: "space-evenly",
            //     marginBottom: 10,
            //   }}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      ) : (
        <Text style={{ marginLeft: 5 }}>Start Liking To See Books Here</Text>
      )}

      <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: "bold" }}>
        Collection {Object.keys(collection).length}
      </Text>
      {Object.keys(collection).length > 0 ? (
        <SafeAreaView style={styles(stylesProps).collectionContainer}>
          <FlatList
            data={Object.values(collection)}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  marginLeft: 5,
                  marginBottom: 5,
                  height: 200,
                  marginRight: 5,
                }}
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
            // horizontal={true}
            columnWrapperStyle={{
              display: "flex",
              // justifyContent: "space-evenly",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      ) : (
        <Text style={{ marginLeft: 5 }}>
          Start Adding To Your Collection To See Books Here
        </Text>
      )}
    </View>
  );
}

export default UserCollection;

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
      height: 220,
      width: "100%",
      marginTop: 5,
      // marginBottom: 5,
      // display: "flex",
      // alignItems: "center",
    },
    collectionContainer: {
      //289 is 220 for scrollview div, plus 2 titles each 27 plus margins
      height:
        props.favoritesLength > 0
          ? Dimensions.get("window").height - 64 - 54 - 312
          : 0.684 * Dimensions.get("window").height,
      width: "100%",
      marginTop: 5,
      // marginBottom: 5
    },
  });
