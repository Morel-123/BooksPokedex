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
    id: 9,
    image: require("../../assets/pokemon-avatars/rattata.png"),
    bookRequirement: 0,
  },
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
  {
    id: 18,
    image: require("../../assets/pokemon-avatars/caterpie.png"),
    pageRequirement: 200,
  },
  {
    id: 19,
    image: require("../../assets/pokemon-avatars/pidgey.png"),
    pageRequirement: 500,
  },
  {
    id: 20,
    image: require("../../assets/pokemon-avatars/weedle.png"),
    pageRequirement: 1000,
  },
  {
    id: 21,
    image: require("../../assets/pokemon-avatars/meowth.png"),
    pageRequirement: 1500,
  },
  {
    id: 22,
    image: require("../../assets/pokemon-avatars/mankey.png"),
    pageRequirement: 2000,
  },
  {
    id: 23,
    image: require("../../assets/pokemon-avatars/venonat.png"),
    pageRequirement: 3000,
  },
  {
    id: 24,
    image: require("../../assets/pokemon-avatars/dratini.png"),
    pageRequirement: 5000,
  },
  {
    id: 25,
    image: require("../../assets/pokemon-avatars/mew.png"),
    pageRequirement: 10000,
  },
  {
    id: 26,
    image: require("../../assets/pokemon-avatars/mystic.png"),
    pageRequirement: 15000,
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

const pagesLevels = [
  {
    level: 1,
    pageCount: 0,
  },
  {
    level: 2,
    pageCount: 200,
  },
  {
    level: 3,
    pageCount: 500,
  },
  {
    level: 4,
    pageCount: 1000,
  },
  {
    level: 5,
    pageCount: 1500,
  },
  {
    level: 6,
    pageCount: 2000,
  },
  {
    level: 7,
    pageCount: 3000,
  },
  {
    level: 8,
    pageCount: 5000,
  },
  {
    level: 9,
    pageCount: 10000,
  },
  {
    level: 10,
    pageCount: 15000,
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
  const [nextBooksLevel, setNextBooksLevel] = useState(booksLevels[0]);
  const [nextPagesLevel, setNextPagesLevel] = useState(pagesLevels[0]);

  useEffect(() => {
    if (collection) {
      // calculate page count and the next level for page levels
      let pages = 0;
      Object.values(collection).forEach((book) => {
        if (Number.isInteger(book.pageCount)) {
          pages = pages + book.pageCount;
        }
      });
      for (let i = 0; i < pagesLevels.length; i++) {
        if (pagesLevels[i].pageCount > pages) {
          setNextPagesLevel(pagesLevels[i]);
          break;
        }
        // it means we have more pages then every level
        if (i == pagesLevels.length - 1) {
          let maxPageLevel = {
            level: "MAX",
            pageCount: pages,
          };
          setNextPagesLevel(maxPageLevel);
        }
      }
      // calculate book count and the next level for book levels
      let numOfBooks = Object.keys(collection).length;
      for (let i = 0; i < booksLevels.length; i++) {
        if (booksLevels[i].bookCount > numOfBooks) {
          setNextBooksLevel(booksLevels[i]);
          break;
        }
        // it means we have more books then every level
        if (i == booksLevels.length - 1) {
          let maxBookLevel = {
            level: "MAX",
            bookCount: numOfBooks,
          };
          setNextBooksLevel(maxBookLevel);
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
    return parseFloat(scaled.toFixed(1)) + suffix;
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
            style={{
              position: "relative",
            }}
            onPress={() => onAvatarSelected(item)}
          >
            {(numOfBooks < item.bookRequirement ||
              numOfPages < item.pageRequirement) && (
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
                opacity:
                  numOfBooks < item.bookRequirement ||
                  numOfPages < item.pageRequirement
                    ? 0.5
                    : 1,
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
              }}
            >
              {numOfBooks >= selectedAvatar.bookRequirement ||
              numOfPages >= selectedAvatar.pageRequirement ? (
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
              {selectedAvatar.bookRequirement == 0 ? (
                <Text style={{ fontSize: 16 }}>Thank you gift for joining</Text>
              ) : (
                <Text style={{ fontSize: 16 }}>
                  Read{" "}
                  {selectedAvatar.bookRequirement
                    ? `${selectedAvatar.bookRequirement} books`
                    : `${abbreviateNumber(
                        selectedAvatar.pageRequirement
                      )} pages`}{" "}
                  to unlock
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={{
                backgroundColor:
                  numOfBooks < selectedAvatar.bookRequirement ||
                  numOfPages < selectedAvatar.pageRequirement
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
                numOfPages < selectedAvatar.pageRequirement ||
                loadingAvatarChange
              }
            >
              <Text
                style={{
                  color:
                    numOfBooks < selectedAvatar.bookRequirement ||
                    numOfPages < selectedAvatar.pageRequirement
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

  function renderBooksMasteryLevelsSection() {
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
            height: 90,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#d86c41",
          }}
        >
          <Image
            source={require("../../assets/read.png")}
            resizeMode="contain"
            style={{ width: 50, height: 50, borderRadius: 10 }}
          />
          <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
            Lvl.{" "}
            {nextBooksLevel.level != "MAX"
              ? nextBooksLevel.level - 1
              : nextBooksLevel.level}
          </Text>
        </View>
        <View style={{ width: "70%", height: "100%", marginHorizontal: 10 }}>
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: COLORS.black }}
            >
              Books Mastery
            </Text>
            {nextBooksLevel.level != "MAX" ? (
              <Text style={{ fontSize: 14, color: COLORS.black }}>
                Read {nextBooksLevel.bookCount} books to unlock
              </Text>
            ) : (
              <Text style={{ fontSize: 14, color: COLORS.black }}>
                Max level reached
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "column",
              marginTop: 10,
              width: 175,
            }}
          >
            <ProgressBar
              progress={numOfBooks / nextBooksLevel.bookCount}
              color={COLORS.primary}
              style={{ height: 15, width: 175, borderRadius: 15 }}
            />
            <Text
              style={{
                color: COLORS.black,
              }}
            >
              {numOfBooks} / {nextBooksLevel.bookCount}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function renderPagesMasteryLevelsSection() {
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
            height: 90,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#d86c41",
          }}
        >
          <Image
            source={require("../../assets/stack8.png")}
            resizeMode="contain"
            style={{ width: 50, height: 50, borderRadius: 10 }}
          />
          <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
            Lvl.{" "}
            {nextPagesLevel.level != "MAX"
              ? nextPagesLevel.level - 1
              : nextPagesLevel.level}
          </Text>
        </View>
        <View style={{ width: "70%", height: "100%", marginHorizontal: 10 }}>
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: COLORS.black }}
            >
              Pages Mastery
            </Text>
            {nextPagesLevel.level != "MAX" ? (
              <Text style={{ fontSize: 14, color: COLORS.black }}>
                Read {abbreviateNumber(nextPagesLevel.pageCount)} pages to
                unlock
              </Text>
            ) : (
              <Text style={{ fontSize: 14, color: COLORS.black }}>
                Max level reached
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "column",
              marginTop: 10,
              width: 175,
            }}
          >
            <ProgressBar
              progress={numOfPages / nextPagesLevel.pageCount}
              color={COLORS.primary}
              style={{ height: 15, width: 175, borderRadius: 15 }}
            />
            <Text
              style={{
                color: COLORS.black,
              }}
            >
              {abbreviateNumber(numOfPages)} /{" "}
              {abbreviateNumber(nextPagesLevel.pageCount)}
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
            {renderBooksMasteryLevelsSection()}
            <View style={{ marginTop: 20 }}>
              {renderPagesMasteryLevelsSection()}
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
}

export default Profile;
