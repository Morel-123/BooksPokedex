export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = userID => ({
  type: LOGIN,
  userID: userID
});

export const logout = () => ({
  type: LOGOUT,
});
