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