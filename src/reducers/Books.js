import {
  SET_CURRENT_BOOK,
  SET_HISTORY_BOOKS,
  ADD_FAVORITE_BOOK,
  REMOVE_FAVORITE_BOOK,
  SET_FAVORITE_BOOKS,
} from "../actions/Books";

const initialState = {
  selectedBook: null,
  historyBooks: null,
  favoriteBooks: {},
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
    case ADD_FAVORITE_BOOK:
      let newFavoriteBooks = { ...state.favoriteBooks };
      newFavoriteBooks[action.favoriteBook.id] = action.favoriteBook;
      return {
        ...state,
        favoriteBooks: newFavoriteBooks,
      };
    case REMOVE_FAVORITE_BOOK:
      let updatedFavoriteBooks = { ...state.favoriteBooks };
      delete updatedFavoriteBooks[action.favoriteBook.id];
      return {
        ...state,
        favoriteBooks: updatedFavoriteBooks,
      };
    case SET_FAVORITE_BOOKS:
      return {
        ...state,
        favoriteBooks: action.favoriteBooks,
      };
    default:
      return state;
  }
};
