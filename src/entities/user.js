class User{
    constructor(userID, userName, userPassword, userPhoneNumber, userEmail, isActive){
        this.userID = userID;
        this.userPassword = userPassword;
        this.userName = userName;
        this.userPhoneNumber = userPhoneNumber;
        this.userEmail = userEmail;
        this.isActive = isActive;
    }
}

export default User;

// let currentUser = null;
let currentUser = new User(3, "no123456", "12345678", "0543333333", "mftcarpool@gmail.com", true)

const setCurrentUser = (user) => {
    currentUser = user;
}
export { currentUser, setCurrentUser }