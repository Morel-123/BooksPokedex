export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SET_EXPO_PUSH_TOKEN = "SET_EXPO_PUSH_TOKEN";

export const signup = (user) => ({
  type: SIGNUP,
  user: user,
});

export const login = (user) => ({
  type: LOGIN,
  user: user,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setExpoPushToken = (token) => ({
  type: SET_EXPO_PUSH_TOKEN,
  token: token,
})