import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import User from "../entities/User";
import { useForm, Controller } from "react-hook-form";
import { Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { TouchableRipple, Snackbar } from "react-native-paper";
import { firebase } from "../firebase/Config";
import { useDispatch } from "react-redux";
import * as booksActions from "../actions/Books";
import Spinner from "../components/Spinner";

function NewBookForm(props) {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [submitPressed, setSubmitPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { control, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });

  const database = firebase.firestore();
  const dispatch = useDispatch();

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const btoa = (input) => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImageToFirebase = async () => {
    setLoading(true);
    if (Platform.OS == "android") {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });
      firebase
        .storage()
        .ref(bookName)
        .put(blob)
        .then((snapshot) => {
          blob.close();
          let imageRef = firebase.storage().ref("/" + bookName);
          imageRef
            .getDownloadURL()
            .then((url) => {
              let userBook = {};
              userBook["authors"] = [authorName];
              userBook["categories"] = null;
              userBook["description"] = description;
              userBook["pageCount"] = pageCount;
              userBook["title"] = bookName;
              userBook["imageLinks"] = { thumbnail: url };
              userBook["publishedDate"] = "";
              userBook["id"] = bookName;
              database
                .collection("books")
                .doc(bookName)
                .set(userBook)
                .then(() => {
                  dispatch(booksActions.setCurrentBook(userBook));
                  setLoading(false);
                  props.navigation.pop();
                  props.navigation.navigate("Book Info");
                })
                .catch((e) => {
                  console.log("unable to add new book1");
                  setLoading(false);
                });
            })
            .catch((e) => {
              console.log("unable to add new book1");
              setLoading(false);
            });
        })
        .catch((e) => {
          console.log("unable to add new book1");
          setLoading(false);
        });
      return;
    }
    firebase
      .storage()
      .ref(bookName)
      .putString(image, "data_url")
      .then((snapshot) => {
        let imageRef = firebase.storage().ref("/" + bookName);
        imageRef
          .getDownloadURL()
          .then((url) => {
            let userBook = {};
            userBook["authors"] = [authorName];
            userBook["categories"] = null;
            userBook["description"] = description;
            userBook["pageCount"] = pageCount;
            userBook["title"] = bookName;
            userBook["imageLinks"] = { thumbnail: url };
            userBook["publishedDate"] = "";
            userBook["id"] = bookName;
            database
              .collection("books")
              .doc(bookName)
              .set(userBook)
              .then(() => {
                dispatch(booksActions.setCurrentBook(userBook));
                setLoading(false);
                props.navigation.pop();
                props.navigation.navigate("Book Info");
              })
              .catch((e) => {
                console.log("unable to add new book1");
                setLoading(false);
              });
          })
          .catch((e) => {
            console.log("unable to add new book1");
            setLoading(false);
          });
      })
      .catch((e) => {
        console.log("unable to add new book1");
        setLoading(false);
      });
  };

  const handleSubmitPressed = async (data) => {
    if (!image) {
      return;
    }
    const bookRef = database.collection("books").doc(bookName);
    const result = await bookRef.get();
    if (result.exists) {
      onToggleSnackBar();
      return;
    }
    uploadImageToFirebase();
  };

  const isPageCountValid = (input) => {
    return /^([1-9]\d*)$/.test(input) || input == "";
  };

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading</Text>
        <Spinner
          size={Platform.OS === "android" ? 10 : "large"}
          color={Platform.OS === "android" ? "#448aff" : undefined}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.regform}>
        {image ? (
          <View
            style={{
              position: "relative",
              height: 220,
              width: 170,
              alignSelf: "center",
              marginBottom: 5,
            }}
          >
            <Image
              source={{ uri: image }}
              style={{
                height: 220,
                width: 150,
                marginLeft: 10,
                marginRight: 5,
              }}
              resizeMode="cover"
            />
            <TouchableRipple
              onPress={pickImage}
              rippleColor="rgba(0, 0, 0, .32)"
              style={styles.likeButton}
              borderless={true}
              centered={true}
            >
              <View style={styles.iconContainer}>
                <Icon
                  color="white"
                  type="ionicon"
                  name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
                  iconStyle={{ width: 26, textAlign: "center" }}
                />
              </View>
            </TouchableRipple>
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            style={[
              submitPressed && !image
                ? styles.uploadImageInvalid
                : styles.uploadImage,
            ]}
          >
            <View>
              <Icon
                color="black"
                type="ionicon"
                name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
                iconStyle={{ width: 26, textAlign: "center" }}
              />
            </View>
          </TouchableOpacity>
        )}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <View style={styles.inputMargin}>
              <TextInput
                placeholder="Book Name*"
                placeholderTextColor="#b2b2b2"
                style={styles.textInput}
                onChangeText={(value) => {
                  onChange(value);
                  setBookName(value);
                }}
                onBlur={onBlur}
                value={value}
              ></TextInput>
              {((errors.bookName && errors.bookName.type === "required") ||
                (submitPressed && bookName == "")) && (
                <Text style={styles.errorMessage}>Book name is required.</Text>
              )}
            </View>
          )}
          name="bookName"
          rules={{
            required: true,
          }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <View style={styles.inputMargin}>
              <TextInput
                placeholder="Author Name*"
                placeholderTextColor="#b2b2b2"
                style={(styles.inputMargin, styles.textInput)}
                onChangeText={(value) => {
                  onChange(value);
                  setAuthorName(value);
                }}
                onBlur={onBlur}
                value={value}
              ></TextInput>
              {((errors.authorName && errors.authorName.type === "required") ||
                (submitPressed && authorName == "")) && (
                <Text style={styles.errorMessage}>
                  Author name is required.
                </Text>
              )}
            </View>
          )}
          name="authorName"
          rules={{
            required: true,
          }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <View style={styles.inputMargin}>
              <TextInput
                placeholder="Number Of Pages"
                placeholderTextColor="#b2b2b2"
                style={styles.textInput}
                keyboardType="number-pad"
                onChangeText={(value) => {
                  onChange(value);
                  setPageCount(value);
                }}
                onBlur={onBlur}
                value={value}
              ></TextInput>
              {errors.pageCount && errors.pageCount.type === "validate" && (
                <Text style={styles.errorMessage}>
                  Insert a valid number of pages.
                </Text>
              )}
            </View>
          )}
          name="pageCount"
          rules={{
            validate: (value) => isPageCountValid(value),
          }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <View style={styles.inputMargin}>
              <TextInput
                placeholder="Description"
                placeholderTextColor="#b2b2b2"
                style={(styles.inputMargin, styles.textArea)}
                onChangeText={(value) => {
                  onChange(value);
                  setDescription(value);
                }}
                onBlur={onBlur}
                value={value}
                multiline={true}
              ></TextInput>
            </View>
          )}
          name="description"
          defaultValue=""
        />
        <TouchableOpacity
          title="Add Book"
          style={styles.registerButton}
          opacity={1}
          onPress={() => {
            setSubmitPressed(true);
            handleSubmit(handleSubmitPressed)();
          }}
        >
          <Text style={styles.registerButtonText}>Add Book</Text>
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={1500}
        style={{
          backgroundColor: "#448aff",
          position: "absolute",
          bottom: 10,
          width: "60%",
        }}
      >
        {"This book already exists."}
      </Snackbar>
    </View>
  );
}

export default NewBookForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36485f",
    paddingLeft: 60,
    paddingRight: 60,
    height: "100%",
    width: "100%",
  },
  regform: {
    alignSelf: "stretch",
    marginTop: 10,
    position: "relative",
  },
  header: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 10,
    marginTop: 25,
    alignSelf: "center",
  },
  opacity: {
    opacity: 0.3,
  },
  noOpacity: {
    opacity: 1,
  },
  textInput: {
    alignSelf: "stretch",
    height: 40,
    width: "100%",
    color: "#fff",
    borderBottomColor: "#f8f8f8",
    borderBottomWidth: 1,
  },
  inputMargin: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  backButtonIcon: {
    color: "#fff",
  },
  backButton: {
    marginTop: 20,
    position: "absolute",
    left: 20,
    top: 20,
  },
  buttonDisabled: {
    backgroundColor: "#4d4d4d",
  },
  buttonEnabled: {
    backgroundColor: "#2288dc",
  },
  registerButton: {
    width: "auto",
    height: "auto",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 25,
    backgroundColor: "#2288dc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  registerButtonText: {
    color: "#d4f4f3",
    alignSelf: "center",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: "absolute",
    bottom: 0,
    right: 2,
    backgroundColor: "#448aff",
  },
  uploadImage: {
    position: "relative",
    height: 220,
    width: 170,
    backgroundColor: "#e9e9e9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 5,
  },
  uploadImageInvalid: {
    position: "relative",
    height: 220,
    width: 170,
    backgroundColor: "#e9e9e9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 5,
    borderColor: "red",
    borderStyle: "solid",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  textArea: {
    alignSelf: "stretch",
    height: 60,
    width: "100%",
    color: "#fff",
    borderBottomColor: "#f8f8f8",
    borderBottomWidth: 1,
  },
  loadingContainer: {
    height: "60%",
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
