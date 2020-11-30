import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { firebase } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as authActions from "../actions/Auth";
import * as booksActions from "../actions/Books";
import * as socialActions from "../actions/Social";
import { Card, ListItem, Button, Input, Icon } from "react-native-elements";
import { useForm, Controller } from "react-hook-form";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const database = firebase.firestore();
  var provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "786999117943-diu3s943muh0hrfsmu413i2co9f58tup.apps.googleusercontent.com",
    iosClientId:
      "786999117943-diu3s943muh0hrfsmu413i2co9f58tup.apps.googleusercontent.com",
    androidClientId:
      "786999117943-nv1n1ekb6hio89bs9imagid0np54bsvb.apps.googleusercontent.com",
    webClientId:
      "786999117943-diu3s943muh0hrfsmu413i2co9f58tup.apps.googleusercontent.com",
  });

  const { control, handleSubmit, errors, register } = useForm({
    mode: "onTouched",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;

      const credential = firebase.auth.GoogleAuthProvider.credential(
        null,
        access_token
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(function (result) {
          let uid = result.user.uid;
          if (result.additionalUserInfo.isNewUser) {
            //need to add it to firebase
            console.log("new user");
            database
              .collection("users")
              .doc(uid)
              .set({
                uid: uid,
                firstName: result.additionalUserInfo.profile.given_name,
                lastName: result.additionalUserInfo.profile.family_name,
                userPhoneNumber: result.user.phoneNumber,
                userEmail: result.additionalUserInfo.profile.email,
                gender: "male",
                favoriteBooks: [],
                collection: [],
                friends: [],
                expoPushToken: null,
              })
              .then(function () {
                let userObj = new User(
                  uid,
                  result.additionalUserInfo.profile.given_name,
                  result.additionalUserInfo.profile.family_name,
                  result.user.phoneNumber,
                  result.additionalUserInfo.profile.email,
                  "male"
                );
                userObj.favoriteBooks = [];
                userObj.collection = [];
                userObj.friends = [];
                userObj.expoPushToken = null;
                dispatch({
                  type: authActions.SIGNUP,
                  user: userObj,
                  // user: new User(
                  //   uid,
                  //   result.additionalUserInfo.profile.given_name,
                  //   result.additionalUserInfo.profile.family_name,
                  //   result.user.phoneNumber,
                  //   result.additionalUserInfo.profile.email,
                  //   "male"
                  // ),
                });
                props.navigation.navigate("MainNavigator");
              })
              .catch(function (error) {
                console.log(error.message);
              });
          } else {
            getUserFromDBAndNavigate(uid);
          }
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    }
  }, [response]);

  const isEmailAddressValid = (input) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      input
    );
  };

  const getUserFromDBAndNavigate = (uid) => {
    database
      .collection("users")
      .doc(uid)
      .get()
      .then(function (response) {
        const responseData = response.data();
        dispatch(authActions.login(responseData));
        let favoriteBooksFromDB = responseData.favoriteBooks;
        let favoriteBooks = {};
        favoriteBooksFromDB.forEach((favoriteBook) => {
          favoriteBooks[favoriteBook.bookID] = favoriteBook.book;
        });
        dispatch(booksActions.setFavoriteBooks(favoriteBooks));
        let collectionFromDB = responseData.collection;
        let collection = {};
        collectionFromDB.forEach((item) => {
          collection[item.bookID] = item.book;
        });
        dispatch(booksActions.setCollection(collection));
        let friendsFromDB = responseData.friends;
        let friends = {};
        friendsFromDB.forEach((item) => {
          friends[item.uid] = item.friend;
        });
        dispatch(socialActions.setFriends(friends));
        props.navigation.navigate("MainNavigator");
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const handleLogin = (data) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        let uid = firebase.auth().currentUser.uid;
        getUserFromDBAndNavigate(uid);
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <View style={styles.loginContainer}>
      <ImageBackground
        resizeMode={"cover"}
        style={styles.loginBackground}
        source={require("../../assets/books.jpg")}
      ></ImageBackground>
      <TouchableOpacity
        title="Sign Up"
        style={styles.signUpButtonWrapper}
        opacity={1}
        onPress={() => props.navigation.navigate("Signup")}
      >
        <Text style={styles.signUpButton}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../../assets/logo.png")} />
        <Text style={styles.logoText}>Log In To BookDex</Text>
      </View>

      <View style={styles.loginInnerContainer}>
        <Card>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={{
                    height: 40,
                    fontSize: 18,
                    borderBottomColor: "#86939e",
                    borderBottomWidth: 1,
                  }}
                  placeholder="Email"
                  onChangeText={(email) => {
                    onChange(email);
                    setEmail(email);
                  }}
                  onBlur={onBlur}
                  value={value}
                />
                {errors.email && errors.email.type === "required" && (
                  <Text style={styles.errorMessage}>Email is required.</Text>
                )}
                {errors.email && errors.email.type === "validate" && (
                  <Text style={styles.errorMessage}>
                    Please provide a valid email.
                  </Text>
                )}
              </View>
            )}
            name="email"
            rules={{
              required: true,
              validate: (value) => isEmailAddressValid(value),
            }}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={{
                    height: 40,
                    fontSize: 18,
                    borderBottomColor: "#86939e",
                    borderBottomWidth: 1,
                  }}
                  placeholder="Password"
                  onChangeText={(password) => {
                    onChange(password);
                    setPassword(password);
                  }}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={!showPassword}
                />
                {errors.password && errors.password.type === "required" && (
                  <Text style={styles.errorMessage}>Password is required.</Text>
                )}
                {errors.password && errors.password.type === "minLength" && (
                  <Text style={styles.errorMessage}>
                    Password must be at least 6 characters long.
                  </Text>
                )}
                {showPassword ? (
                  <Icon
                    name="eye"
                    type="font-awesome"
                    containerStyle={{
                      height: 24,
                      position: "absolute",
                      top: 8,
                      right: 0,
                    }}
                    onPress={() => setShowPassword(false)}
                  />
                ) : (
                  <Icon
                    name="eye-slash"
                    type="font-awesome"
                    containerStyle={{
                      height: 24,
                      position: "absolute",
                      top: 8,
                      right: 0,
                    }}
                    onPress={() => setShowPassword(true)}
                  />
                )}
              </View>
            )}
            name="password"
            rules={{
              required: true,
              minLength: 6,
            }}
            defaultValue=""
          />
          <Button
            title="Login"
            buttonStyle={{
              width: Dimensions.get("window").width * 0.75,
              borderRadius: 25,
              alignSelf: "center",
            }}
            onPress={handleSubmit(handleLogin)}
          />
        </Card>
      </View>
      <View style={{ position: "absolute", bottom: 25, alignSelf: "center" }}>
        <Button
          title="Login With Google"
          buttonStyle={{
            borderRadius: 25,
          }}
          onPress={promptAsync}
        />
      </View>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
  },
  loginButton: {
    borderRadius: 25,
    width: "75vw",
    elevation: 1,
  },
  loginContainer: {
    height: "100%",
    position: "relative",
  },
  loginInnerContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  loginBackground: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  signUpButton: {
    borderBottomColor: "#0000007a",
    borderBottomWidth: 1,
    fontSize: 18,
  },
  signUpButtonWrapper: {
    alignSelf: "flex-start",
    position: "absolute",
    top: "3%",
    right: "3%",
    zIndex: 1,
  },
  logo: {
    resizeMode: "cover",
    width: 150,
    height: 100,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoContainer: {
    position: "absolute",
    zIndex: 1,
    left: Dimensions.get("window").width / 2 - 75,
    top: 80,
  },
  errorMessage: {
    color: "red",
  },
  inputContainer: {
    marginBottom: 20,
    height: 60,
    position: "relative",
  },
  passwordIcon: {
    height: 24,
    position: "absolute",
    top: 8,
    right: 0,
  },
});
