import { SET_CURRENT_BOOK } from "../actions/Books";

const initialState = {
  book: null,
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case SET_CURRENT_BOOK:
      return {
        ...state,
        book: action.book,
      };
    default:
      return state;
  }
};
