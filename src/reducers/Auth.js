import { LOGIN, SIGNUP, LOGOUT } from "../actions/Auth";

const initialState = {
  userID: null,
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userID: action.userID,
      };
    case SIGNUP:
      return {
        ...state,
        userID: action.userID,
      };
    case LOGOUT:
      return {
        ...state,
        userID: null,
      };
    default:
      return state;
  }
};
