class User {
  constructor(uid, firstName, lastName, userPhoneNumber, userEmail) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userEmail = userEmail;
    this.userPhoneNumber = userPhoneNumber;
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
