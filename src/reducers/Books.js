import { SET_CURRENT_BOOK, SET_HISTORY_BOOKS } from "../actions/Books";

const initialState = {
  selectedBook: null,
  historyBooks: null,
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case SET_CURRENT_BOOK:
      return {
        ...state,
        selectedBook: action.book,
      };
    case SET_HISTORY_BOOKS:
      return {
        ...state,
        historyBooks: action.books,
      };
    default:
      return state;
  }
};
