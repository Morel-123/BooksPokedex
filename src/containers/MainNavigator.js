import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Platform, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as booksActions from "../actions/Books";
import { createStackNavigator } from "@react-navigation/stack";
import UserCollection from "./UserCollection";
import Book from "./Book";
import BookDetail from "./BookDetail";
import MyTabs from "./BottomNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableRipple } from "react-native-paper";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { firebase } from "../firebase/Config";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as authActions from "../actions/Auth";
import NewBookForm from "../components/NewBookForm";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function MainNavigator(props) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const dispatch = useDispatch();
  const database = firebase.firestore();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      database
        .collection("users")
        .doc(user.uid)
        .update({
          expoPushToken: token ? token : null,
        })
        .then(function () {
          dispatch(authActions.setExpoPushToken(token));
          setExpoPushToken(token);
        })
        .catch(function (error) {
          console.log(error.message);
        });
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {}
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

    switch (routeName) {
      case "Home":
        return "Home";
      case "Collection":
        return "My Collection";
      case "Social":
        return "Social";
      case "Profile":
        return "My Profile";
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        headerMode="screen"
        screenOptions={{
          headerStyle: { backgroundColor: "#ff4336" },
          headerTitleStyle: { color: "white", fontSize: 24 },
          headerTintColor: "white",
          // headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
          })}
        />
        <Stack.Screen
          name="Book Info"
          component={BookDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Add Book" component={NewBookForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;

const styles = StyleSheet.create({
  rightIconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 120,
    marginRight: 5,
  },
  roundIcon: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
