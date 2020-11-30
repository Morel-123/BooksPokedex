import { LOGIN, SIGNUP, LOGOUT, SET_EXPO_PUSH_TOKEN } from "../actions/Auth";

const initialState = {
  user: null,
  expoPushToken: null,
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.user,
      };
    case SIGNUP:
      return {
        ...state,
        user: action.user,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    case SET_EXPO_PUSH_TOKEN:
      return {
        ...state,
        expoPushToken: action.token,
      }
    default:
      return state;
  }
};
