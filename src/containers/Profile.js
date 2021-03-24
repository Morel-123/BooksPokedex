import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { TouchableOpacity as GestureTouchableOpactiy } from "react-native-gesture-handler";
import { Overlay, Button as ElementsButton } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { firebase } from "../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../actions/Auth";
import { COLORS, FONTS, SIZES, icons } from "../constants";
import { ProgressBar } from "react-native-paper";

const avatarImages = [
  {
    id: 10,
    image: require("../../assets/pokemon-avatars/charmander.png"),
    bookRequirement: 2,
  },
  {
    id: 11,
    image: require("../../assets/pokemon-avatars/bullbasaur.png"),
    bookRequirement: 3,
  },
  {
    id: 12,
    image: require("../../assets/pokemon-avatars/squirtle.png"),
    bookRequirement: 5,
  },
  {
    id: 13,
    image: require("../../assets/pokemon-avatars/jigglypuff.png"),
    bookRequirement: 10,
  },
  {
    id: 14,
    image: require("../../assets/pokemon-avatars/pikachu-2.png"),
    bookRequirement: 15,
  },
  {
    id: 15,
    image: require("../../assets/pokemon-avatars/psyduck.png"),
    bookRequirement: 20,
  },
  {
    id: 16,
    image: require("../../assets/pokemon-avatars/snorlax.png"),
    bookRequirement: 25,
  },
  {
    id: 17,
    image: require("../../assets/pokemon-avatars/eevee.png"),
    bookRequirement: 50,
  },
];

const booksLevels = [
  {
    level: 1,
    bookCount: 0,
  },
  {
    level: 2,
    bookCount: 2,
  },
  {
    level: 3,
    bookCount: 3,
  },
  {
    level: 4,
    bookCount: 5,
  },
  {
    level: 5,
    bookCount: 10,
  },
  {
    level: 6,
    bookCount: 15,
  },
  {
    level: 7,
    bookCount: 20,
  },
  {
    level: 8,
    bookCount: 25,
  },
  {
    level: 9,
    bookCount: 50,
  },
];

function Profile(props) {
  const dispatch = useDispatch();
  const database = firebase.firestore();
  const expoPushToken = useSelector((state) => state.auth.expoPushToken);
  const user = useSelector((state) => state.auth.user);
  let collection = useSelector((state) => state.books.collection);
  const [numOfBooks, setNumOfBooks] = useState(null);
  const [numOfPages, setNumOfPages] = useState(null);
  const [visible, setVisible] = useState(false);
  const avatarIndex = user?.avatarID
    ? avatarImages.findIndex((i) => i.id == user.avatarID)
    : 0;
  const [selectedAvatar, setSelectedAvatar] = useState(
    avatarImages[avatarIndex]
  );
  const [chosenAvatar, setChosenAvatar] = useState(avatarImages[avatarIndex]);
  const [loadingAvatarChange, setLoadingAvatarChange] = useState(false);
  const [nextLevel, setNextLevel] = useState(booksLevels[0]);

  useEffect(() => {
    if (collection) {
      let pages = 0;
      Object.values(collection).forEach((book) => {
        if (Number.isInteger(book.pageCount)) {
          pages = pages + book.pageCount;
        }
      });
      let numOfBooks = Object.keys(collection).length;
      for (let i = 0; i < booksLevels.length; i++) {
        if (booksLevels[i].bookCount > numOfBooks) {
          setNextLevel(booksLevels[i]);
          break;
        }
      }
      setNumOfBooks(numOfBooks);
      setNumOfPages(pages);
    }
  }, [collection]);

  const containsHebrew = (str) => {
    return /[\u0590-\u05FF]/.test(str);
  };

  function abbreviateNumber(number) {
    const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

    // what tier? (determines SI symbol)
    var tier = (Math.log10(Math.abs(number)) / 3) | 0;

    // if zero, we don't need a suffix
    if (tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
  }

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(authActions.logout());
      })
      .catch((error) => console.log(error.message));
  };

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { data: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  const onAvatarPress = () => {
    setVisible(true);
  };

  const onAvatarSelected = (item) => {
    setSelectedAvatar(item);
  };

  const onChangeAvatar = () => {
    // if the user's avatar is the same as the selected avatar- no need to go to the server and update
    if (selectedAvatar.id == chosenAvatar.id) {
      setVisible(false);
      setSelectedAvatar(chosenAvatar);
      return;
    }
    setLoadingAvatarChange(true);
    let uid = firebase.auth().currentUser.uid;
    database
      .collection("users")
      .doc(uid)
      .update({
        avatarID: selectedAvatar.id,
      })
      .then(function () {
        setChosenAvatar(selectedAvatar);
        setLoadingAvatarChange(false);
        setVisible(false);
      })
      .catch(function (error) {
        console.log(error);
        setErrorMessage(error.message);
      });
  };

  function renderAvatarSection() {
    const renderAvatarItem = ({ item }) => {
      return (
        <View
          style={{
            marginHorizontal: 5,
            marginBottom: 5,
            borderColor:
              selectedAvatar.id === item.id ? COLORS.lightGreen : "white",
            borderWidth: selectedAvatar.id === item.id ? 3 : 0,
            borderRadius: 45,
            height: 90,
            width: 90,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <TouchableOpacity
            // style={{
            //   flex: 1,
            // }}
            style={{
              // backgroundColor: "gray",
              position: "relative",
            }}
            onPress={() => onAvatarSelected(item)}
          >
            {numOfBooks < item.bookRequirement && (
              <View
                style={{
                  position: "absolute",
                  height: selectedAvatar.id === item.id ? 60 : 75,
                  width: selectedAvatar.id === item.id ? 60 : 75,
                  zIndex: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="lock"
                  color={COLORS.black}
                  size={32}
                  style={{
                    marginRight: 5,
                    height: 32,
                    alignSelf: "center",
                    position: "absolute",
                  }}
                />
              </View>
            )}
            <Image
              source={item.image}
              resizeMode="contain"
              style={{
                width: selectedAvatar.id === item.id ? 60 : 75,
                height: selectedAvatar.id === item.id ? 60 : 75,
                borderRadius: 10,
                alignSelf: "center",
                opacity: numOfBooks < item.bookRequirement ? 0.5 : 1,
              }}
            />
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <View style={{ flex: 1, marginTop: SIZES.radius }}>
        {/* Avatars */}
        <FlatList
          data={avatarImages}
          renderItem={renderAvatarItem}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          numColumns={3}
          columnWrapperStyle={{ width: "100%", justifyContent: "space-evenly" }}
          style={{ paddingHorizontal: 5 }}
        />
      </View>
    );
  }

  function renderAvatarChangeOverlay() {
    if (!visible) {
      return <></>;
    }

    return (
      <View
        style={{
          position: Platform.OS === "web" ? "absolute" : "absolute",
          height: "50%",
        }}
      >
        <Overlay
          overlayStyle={{
            height: Platform.OS === "web" ? "100%" : "60%",
            width: Platform.OS === "web" ? "100%" : "75%",
            paddingHorizontal: 0,
            backgroundColor: "#f9f4ef",
          }}
          isVisible={visible}
          onBackdropPress={() => {
            setVisible(false);
            setSelectedAvatar(chosenAvatar);
          }}
        >
          <View style={{ position: "relative" }}>
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 5,
                paddingLeft: 10,
                fontSize: 20,
              }}
            >
              Choose Your Avatar:
            </Text>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={selectedAvatar.image}
                resizeMode="contain"
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
            </View>
            <ScrollView
              style={{
                marginTop: 10,
                height: 200,
                marginBottom: 10,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  // alignItems: "center",
                  width: "100%",
                }}
              >
                {renderAvatarSection()}
              </View>
            </ScrollView>
            <View
              style={{
                width: "100%",
                paddingLeft: 10,
                flexDirection: "row",
                alignItems: "center",
                // justifyContent: "center",
              }}
            >
              {numOfBooks >= selectedAvatar.bookRequirement ? (
                <MaterialCommunityIcons
                  name="lock-open"
                  color={COLORS.black}
                  size={26}
                  style={{
                    marginRight: 5,
                    height: 26,
                    alignSelf: "center",
                    transform: [{ scaleX: -1 }],
                  }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="lock"
                  color={COLORS.black}
                  size={26}
                  style={{ marginRight: 5, height: 26, alignSelf: "center" }}
                />
              )}
              <Text style={{ fontSize: 16 }}>
                Read {selectedAvatar.bookRequirement} books to unlock
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor:
                  numOfBooks < selectedAvatar.bookRequirement
                    ? "#dfdfdf"
                    : COLORS.primary,
                width: "50%",
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                height: 35,
                marginTop: 10,
              }}
              onPress={onChangeAvatar}
              disabled={
                numOfBooks < selectedAvatar.bookRequirement ||
                loadingAvatarChange
              }
            >
              <Text
                style={{
                  color:
                    numOfBooks < selectedAvatar.bookRequirement
                      ? "#a1a1a1"
                      : COLORS.white,
                  fontWeight: "bold",
                }}
              >
                {loadingAvatarChange ? "LOADING..." : "SAVE"}
              </Text>
            </TouchableOpacity>
            {Platform.OS === "web" && (
              <Button
                title="Dismiss"
                onPress={() => {
                  setVisible(false);
                  setSelectedAvatar(chosenAvatar);
                }}
              />
            )}
          </View>
        </Overlay>
      </View>
    );
  }

  function renderMasteryLevelsSection() {
    return (
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            padding: 10,
            borderRadius: 25,
            width: 90,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "#1cb0f6",
            backgroundColor: "#d86c41",
          }}
        >
          <Image
            source={require("../../assets/read.png")}
            resizeMode="contain"
            style={{ width: 50, height: 50, borderRadius: 10 }}
          />
          <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
            LEVEL {nextLevel.level - 1}
          </Text>
        </View>
        <View style={{ width: "70%", height: "100%", marginHorizontal: 10 }}>
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: COLORS.black }}
            >
              Books Mastery
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.black }}>
              Read {nextLevel.bookCount} books to unlock
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "space-between",
              alignItems: "center",
              // width: "90%",
              marginTop: 10,
            }}
          >
            <ProgressBar
              // progress={0.5}
              progress={numOfBooks / nextLevel.bookCount}
              color={COLORS.primary}
              style={{ height: 15, width: 175, borderRadius: 15 }}
            />
            <Text
              style={{ color: COLORS.black, paddingBottom: 2, marginLeft: 10 }}
            >
              {numOfBooks} / {nextLevel.bookCount}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ImageBackground
        source={require("../../assets/library1.jpg")}
        style={{
          flex: 1,
          // resizeMode: "contain",
          resizeMode: "stretch",
          justifyContent: "center",
          height: 250,
          top: 0,
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            height: "80%",
            width: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: 45,
            borderTopRightRadius: 45,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -50,
              left: Dimensions.get("window").width / 2 - 50,
            }}
          >
            <GestureTouchableOpactiy
              style={{
                flex: 1,
              }}
              onPress={() => onAvatarPress()}
            >
              <Image
                // source={require("../../assets/pokemon-avatars/snorlax.png")}
                source={chosenAvatar.image}
                resizeMode="contain"
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
            </GestureTouchableOpactiy>
          </View>

          <View
            style={{
              flexDirection:
                containsHebrew(user?.firstName) ||
                containsHebrew(user?.lastName)
                  ? "row-reverse"
                  : "row",
              marginTop: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{ ...FONTS.h2, color: COLORS.black, fontWeight: "bold" }}
            >
              {user
                ? user.firstName.substring(0, 1).toUpperCase() +
                  user.firstName.substring(1) +
                  " "
                : ""}
            </Text>
            <Text
              style={{ ...FONTS.h2, color: COLORS.black, fontWeight: "bold" }}
            >
              {user
                ? user.lastName.substring(0, 1).toUpperCase() +
                  user.lastName.substring(1)
                : ""}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignSelf: "center",
              width: "50%",
              marginTop: 5,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {numOfBooks}
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  color: COLORS.lightGray,
                }}
              >
                Books
              </Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {abbreviateNumber(numOfPages)}
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  color: COLORS.lightGray,
                }}
              >
                Pages
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            {renderMasteryLevelsSection()}
            <View style={{ marginTop: 20 }}>
              {renderMasteryLevelsSection()}
            </View>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: Dimensions.get("window").width / 2 - 75,
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                width: 150,
                borderWidth: 1,
                borderColor: COLORS.primary,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 25,
                alignSelf: "center",
              }}
              onPress={() => handleLogout()}
            >
              <MaterialCommunityIcons
                name="logout-variant"
                color={COLORS.primary}
                size={26}
                style={{
                  marginRight: 5,
                  height: 26,
                  alignSelf: "center",
                }}
              />
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 22,
                  fontWeight: "600",
                  // marginBottom: 2,
                }}
              >
                Log Out
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ position: "absolute", top: 40, right: -80 }}>
            <Image
              source={require("../../assets/graph.png")}
              resizeMode="contain"
              style={{ width: 200, height: 200, borderRadius: 10 }}
            />
          </View>

          <View style={{ position: "absolute", bottom: -92, left: -55 }}>
            <Image
              source={require("../../assets/graph2.png")}
              resizeMode="contain"
              style={{ width: 200, height: 200, borderRadius: 10 }}
            />
          </View>

          {renderAvatarChangeOverlay()}
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
        position: "relative",
      }}
    >
      <View style={{ position: "absolute", top: 50 }}>
        <TouchableOpacity
          style={{
            flex: 1,
          }}
          onPress={() => onAvatarPress()}
        >
          <Image
            // source={require("../../assets/pokemon-avatars/011-avatar.png")}
            source={chosenAvatar.image}
            resizeMode="contain"
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />
        </TouchableOpacity>
      </View>
      {/* box shadow inset 0px -5px #168cc4 */}
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            padding: 10,
            borderRadius: 25,
            width: 90,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "#1cb0f6",
            backgroundColor: "#d86c41",
          }}
        >
          <Image
            source={require("../../assets/read.png")}
            resizeMode="contain"
            style={{ width: 50, height: 50, borderRadius: 10 }}
          />
          <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
            LEVEL {nextLevel.level - 1}
          </Text>
        </View>
        <View style={{ width: "70%", height: "100%", marginRight: 10 }}>
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: COLORS.white }}
            >
              Books Mastery
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.white }}>
              Read {nextLevel.bookCount} books to unlock
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "space-between",
              alignItems: "center",
              // width: "90%",
              marginTop: 6,
            }}
          >
            <ProgressBar
              // progress={0.5}
              progress={numOfBooks / nextLevel.bookCount}
              color={COLORS.primary}
              style={{ height: 15, width: 175, borderRadius: 15 }}
            />
            <Text
              style={{ color: COLORS.white, paddingBottom: 2, marginLeft: 10 }}
            >
              {numOfBooks} / {nextLevel.bookCount}
            </Text>
          </View>
        </View>
      </View>
      <Text style={{ color: "white" }}>You read {numOfBooks} books</Text>
      <Text style={{ color: "white", marginBottom: 5 }}>
        You read {abbreviateNumber(numOfPages)} pages
      </Text>
      <Button title="Log Out" onPress={handleLogout} color="#f96d41" />

      {visible ? (
        <View
          style={{
            position: Platform.OS === "web" ? "absolute" : "absolute",
            height: "50%",
          }}
        >
          <Overlay
            overlayStyle={{
              height: Platform.OS === "web" ? "100%" : "60%",
              width: Platform.OS === "web" ? "100%" : "75%",
              paddingHorizontal: 0,
              backgroundColor: "#f9f4ef",
            }}
            isVisible={visible}
            onBackdropPress={() => {
              setVisible(false);
              setSelectedAvatar(chosenAvatar);
            }}
          >
            <View style={{ position: "relative" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 5,
                  paddingLeft: 10,
                  fontSize: 20,
                }}
              >
                Choose Your Avatar:
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={selectedAvatar.image}
                  resizeMode="contain"
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
              </View>
              <ScrollView
                style={{
                  marginTop: 10,
                  height: 200,
                  marginBottom: 10,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    // alignItems: "center",
                    width: "100%",
                  }}
                >
                  {renderAvatarSection()}
                </View>
              </ScrollView>
              <View
                style={{
                  width: "100%",
                  paddingLeft: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  // justifyContent: "center",
                }}
              >
                {numOfBooks >= selectedAvatar.bookRequirement ? (
                  <MaterialCommunityIcons
                    name="lock-open"
                    color={COLORS.black}
                    size={26}
                    style={{
                      marginRight: 5,
                      height: 26,
                      alignSelf: "center",
                      transform: [{ scaleX: -1 }],
                    }}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="lock"
                    color={COLORS.black}
                    size={26}
                    style={{ marginRight: 5, height: 26, alignSelf: "center" }}
                  />
                )}
                <Text style={{ fontSize: 16 }}>
                  Read {selectedAvatar.bookRequirement} books to unlock
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    numOfBooks < selectedAvatar.bookRequirement
                      ? "#dfdfdf"
                      : COLORS.primary,
                  width: "50%",
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  height: 35,
                  marginTop: 10,
                }}
                onPress={onChangeAvatar}
                disabled={
                  numOfBooks < selectedAvatar.bookRequirement ||
                  loadingAvatarChange
                }
              >
                <Text
                  style={{
                    color:
                      numOfBooks < selectedAvatar.bookRequirement
                        ? "#a1a1a1"
                        : COLORS.white,
                    fontWeight: "bold",
                  }}
                >
                  {loadingAvatarChange ? "LOADING..." : "SAVE"}
                </Text>
              </TouchableOpacity>
              {Platform.OS === "web" && (
                <Button
                  title="Dismiss"
                  onPress={() => {
                    setVisible(false);
                    setSelectedAvatar(chosenAvatar);
                  }}
                />
              )}
            </View>
          </Overlay>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

export default Profile;
