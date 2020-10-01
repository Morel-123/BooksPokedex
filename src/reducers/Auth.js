import { LOGIN, SIGNUP, LOGOUT } from "../actions/Auth";

const initialState = {
  user: null,
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.user
      };
    case SIGNUP:
      return {
        ...state,
        user: action.user
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
