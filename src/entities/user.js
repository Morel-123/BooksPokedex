class User {
  constructor(uid, firstName, lastName, userPhoneNumber, userEmail, gender) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = userEmail;
    this.phoneNumber = userPhoneNumber;
    this.gender = gender;
  }
}

export default User;

let currentUser = new User(
  "3",
  "orel",
  "zilberman",
  "0543333333",
  "orelsmail@gmail.com"
);

// const setCurrentUser = (user) => {
//   currentUser = user;
// };
// export { currentUser, setCurrentUser };
