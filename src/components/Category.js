import React, { useState } from "react";
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
} from "react-native";
import { TouchableRipple } from "react-native-paper";

function Category(props) {
  return (
    <TouchableOpacity
      onPress={() => props.onPress(props.id)}
      style={styles(props).container}
    >
      <>
        <Image source={props.iconImage} style={{ width: 40, height: 40 }} />
        <Text style={styles(props).categoryName}>
          {props.name}
        </Text>
      </>
    </TouchableOpacity>
  );
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      height: props.height ? props.height : "100%",
      width: props.width ? props.width : "100%",
      backgroundColor: props.selected(props.id)
        ? "rgb(26, 112, 255)"
        : "rgb(68, 138, 255)",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    categoryName: {
      color: props.selected(props.id) ? "white" : "#bdbdbd",
      fontSize: 16,
      marginTop: 5,
    },
  });

export default Category;
