import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import User from "../entities/User";
import { useForm, Controller } from "react-hook-form";
import { Icon } from "react-native-elements";
import { COLORS, FONTS, SIZES, icons } from "../constants";

function RevampedRegistration({
  isPasswordSignup,
  handleSignUp,
  handleGoogleAuthentication,
  handleOnBackPress,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("Female");
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const { control, handleSubmit, errors, register } = useForm({
    mode: "onTouched",
  });

  const isEmailAddressValid = (input) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      input
    );
  };

  const isPhoneNumberValid = (input) => {
    return /^05\d([-]{0,1})\d{7}$/.test(input);
  };

  const handleSignUpPressed = (data) => {
    handleSignUp(
      new User(null, firstName, lastName, email, phoneNumber, gender),
      password
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 40,
          position: "absolute",
          top: 0,
          left: 0,
          paddingLeft: 12,
          marginTop: SIZES.padding2,
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: SIZES.base }}
          onPress={() => handleOnBackPress()}
        >
          <Image
            source={icons.back_arrow_icon}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.regform}>
        <Text style={styles.header}>Registration</Text>
        <Text style={styles.genderTitle}>Who are you?</Text>
        <View style={styles.genderIconsContainer}>
          <View style={{ opacity: gender == "Male" ? 1 : 0.3 }}>
            <TouchableOpacity
              onPress={() => {
                setGender("Male");
              }}
            >
              <ImageBackground
                style={styles.maleIcon}
                resizeMode={"cover"}
                source={require("../../assets/icons/actor.png")}
              ></ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={{ opacity: gender == "Female" ? 1 : 0.3 }}>
            <TouchableOpacity
              onPress={() => {
                setGender("Female");
              }}
            >
              <ImageBackground
                style={styles.femaleIcon}
                resizeMode={"cover"}
                source={require("../../assets/icons/actress.png")}
              ></ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <View
              style={{
                marginHorizontal: 10,
              }}
            >
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#b2b2b2"
                style={styles.textInput}
                onChangeText={(value) => {
                  onChange(value);
                  setFirstName(value);
                }}
                onBlur={onBlur}
                value={value}
              ></TextInput>
              {errors.firstName && errors.firstName.type === "required" && (
                <Text style={styles.errorMessage}>First Name is required.</Text>
              )}
            </View>
          )}
          name="firstName"
          rules={{
            required: true,
          }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <View
              style={{
                marginHorizontal: 10,
              }}
            >
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#b2b2b2"
                style={(styles.inputMargin, styles.textInput)}
                onChangeText={(value) => {
                  onChange(value);
                  setLastName(value);
                }}
                onBlur={onBlur}
                value={value}
              ></TextInput>
              {errors.lastName && errors.lastName.type === "required" && (
                <Text style={styles.errorMessage}>Last Name is required.</Text>
              )}
            </View>
          )}
          name="lastName"
          rules={{
            required: true,
          }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <View
              style={{
                marginHorizontal: 10,
              }}
            >
              <TextInput
                placeholder="Email"
                placeholderTextColor="#b2b2b2"
                style={(styles.inputMargin, styles.textInput)}
                onChangeText={(email) => {
                  onChange(email.trim());
                  setEmail(email.trim());
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
            <View
              style={{
                marginHorizontal: 10,
              }}
            >
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#b2b2b2"
                style={(styles.inputMargin, styles.textInput)}
                onChangeText={(value) => {
                  onChange(value);
                  setPhoneNumber(value);
                }}
                onBlur={onBlur}
                value={value}
              />
              {errors.phoneNumber && errors.phoneNumber.type === "required" && (
                <Text style={styles.errorMessage}>
                  Phone Number is required.
                </Text>
              )}
              {errors.phoneNumber && errors.phoneNumber.type === "validate" && (
                <Text style={styles.errorMessage}>
                  Please provide a valid phone number.
                </Text>
              )}
            </View>
          )}
          name="phoneNumber"
          rules={{
            required: true,
            validate: (value) => isPhoneNumberValid(value),
          }}
          defaultValue=""
        />
        {isPasswordSignup ? (
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <View
                style={{
                  marginHorizontal: 10,
                }}
              >
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#b2b2b2"
                  style={(styles.inputMargin, styles.textInput)}
                  onChangeText={(password) => {
                    onChange(password.trim());
                    setPassword(password.trim());
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
                    color="#f8f8f8"
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
                    color="#f8f8f8"
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
        ) : null}
        <TouchableOpacity
          title="Register"
          style={styles.registerButton}
          opacity={1}
          onPress={handleSubmit(handleSignUpPressed)}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function completeRegistration(user) {}

export default RevampedRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingLeft: 60,
    paddingRight: 60,
    height: "100%",
    width: "100%",
  },
  regform: {
    alignSelf: "stretch",
    marginTop: SIZES.padding2,
    position: "relative",
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 28,
    color: "white",
    alignSelf: "center",
  },
  opacity: {
    opacity: 0.3,
  },
  noOpacity: {
    opacity: 1,
  },
  genderTitle: {
    color: "#fdfdfd7d",
    width: "100%",
    textAlign: "center",
  },
  genderIconsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  maleIcon: {
    height: 75,
    width: 75,
    marginRight: 20,
    backgroundColor: "#0e94a0",
    borderRadius: 10,
  },
  femaleIcon: {
    height: 75,
    width: 75,
    marginLeft: 20,
    backgroundColor: "#eb7735",
    borderRadius: 10,
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
    backgroundColor: COLORS.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  registerButtonText: {
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
  },
});
