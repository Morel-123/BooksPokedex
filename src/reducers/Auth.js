import { LOGIN, SIGNUP, LOGOUT } from "../actions/Auth";

const initialState = {
  userID: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        userID: action.userID,
      };
    case SIGNUP:
      return {
        userID: action.userID,
      };
    case LOGOUT:
      return {
        userID: null,
      };
    default:
      return state;
  }
};
