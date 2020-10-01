import { LOGIN, SIGNUP, LOGOUT } from "../actions/Auth";

const initialState = {
  userID: null,
  user: null,
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userID: action.userID,
        user: action.user
      };
    case SIGNUP:
      return {
        ...state,
        userID: action.userID,
        user: action.user
      };
    case LOGOUT:
      return {
        ...state,
        userID: null,
        user: null,
      };
    default:
      return state;
  }
};
