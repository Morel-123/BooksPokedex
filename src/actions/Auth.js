export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = (userID, user) => ({
  type: LOGIN,
  userID: userID,
  user: user
});

export const logout = () => ({
  type: LOGOUT,
});
