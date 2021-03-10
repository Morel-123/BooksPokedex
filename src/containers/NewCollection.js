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
import { Icon } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import { COLORS, FONTS, SIZES, icons } from "../constants";

function NewCollection(props) {
  const dispatch = useDispatch();
  let favoriteBooks = useSelector((state) => state.books.favoriteBooks);
  let collection = useSelector((state) => state.books.collection);

  const onBookPress = (book) => {
    dispatch(booksActions.setCurrentBook(book));
    props.navigation.navigate("Book Info");
  };

  const containsHebrew = (str) => {
    return /[\u0590-\u05FF]/.test(str);
  };

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
          <Text style={{ ...FONTS.h2, color: COLORS.white }}>
            Collection {Object.keys(collection).length}
          </Text>
        </View>

        {/* Collection */}
        {Object.keys(collection).length > 0 ? (
          <FlatList
            data={Object.values(collection)}
            renderItem={renderBookItem}
            keyExtractor={(item) => `${item.id}`}
            showsVerticalScrollIndicator={false}
            style={{ paddingLeft: SIZES.padding, marginTop: SIZES.radius }}
          />
        ) : (
          <Text
            style={{ color: COLORS.white, paddingHorizontal: SIZES.padding }}
          >
            Start Adding To Your Collection To See Books Here
          </Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      {/* Body Section */}
      <ScrollView style={{ marginTop: SIZES.padding2 }}>
        {/* Favorites Section */}
        <View>{renderFavoritesSection()}</View>
        {/* Collection Section */}
        <View>{renderCollectionSection()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default NewCollection;
