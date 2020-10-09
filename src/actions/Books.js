export const SET_CURRENT_BOOK = "SET_CURRENT_BOOK";
export const SET_HISTORY_BOOKS = "SET_HISTORY_BOOKS";
export const ADD_FAVORITE_BOOK = "ADD_FAVORITE_BOOK";
export const REMOVE_FAVORITE_BOOK = "REMOVE_FAVORITE_BOOK";
export const SET_FAVORITE_BOOKS = "SET_FAVORITE_BOOKS";

export const setCurrentBook = (book) => ({
  type: SET_CURRENT_BOOK,
  book: book,
});

export const setHistoryBooks = (books) => ({
  type: SET_HISTORY_BOOKS,
  books: books,
});

export const addFavoriteBook = (book) => ({
  type: ADD_FAVORITE_BOOK,
  favoriteBook: book,
});

export const removeFavoriteBook = (book) => ({
  type: REMOVE_FAVORITE_BOOK,
  favoriteBook: book,
});

export const setFavoriteBooks = (books) => ({
  type: SET_FAVORITE_BOOKS,
  favoriteBooks: books,
});