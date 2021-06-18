export const SET_CURRENT_BOOK = "SET_CURRENT_BOOK";
export const SET_HISTORY_BOOKS = "SET_HISTORY_BOOKS";
export const SET_BUSINESS_BOOKS = "SET_BUSINESS_BOOKS";
export const SET_SELF_HELP_BOOKS = "SET_SELF_HELP_BOOKS";
export const SET_FANTASY_BOOKS = "SET_FANTASY_BOOKS";
export const ADD_FAVORITE_BOOK = "ADD_FAVORITE_BOOK";
export const REMOVE_FAVORITE_BOOK = "REMOVE_FAVORITE_BOOK";
export const SET_FAVORITE_BOOKS = "SET_FAVORITE_BOOKS";
export const ADD_TO_COLLECTION = "ADD_TO_COLLECTION";
export const REMOVE_FROM_COLLECTION = "REMOVE_FROM_COLLECTION";
export const SET_COLLECTION = "SET_COLLECTION";
export const ADD_TO_READING_LIST = "ADD_TO_READING_LIST";
export const REMOVE_FROM_READING_LIST = "REMOVE_FROM_READING_LIST";
export const SET_READING_LIST = "SET_READING_LIST";
export const ADD_FROM_READING_LIST_TO_COLLECTION =
  "ADD_FROM_READING_LIST_TO_COLLECTION";
export const REMOVE_BOOKS_FROM_READING_LIST = "REMOVE_BOOKS_FROM_READING_LIST";

export const setCurrentBook = (book) => ({
  type: SET_CURRENT_BOOK,
  book: book,
});

export const setHistoryBooks = (books) => ({
  type: SET_HISTORY_BOOKS,
  books: books,
});

export const setBusinessBooks = (books) => ({
  type: SET_BUSINESS_BOOKS,
  books: books,
});

export const setSelfHelpBooks = (books) => ({
  type: SET_SELF_HELP_BOOKS,
  books: books,
});

export const setFantasyBooks = (books) => ({
  type: SET_FANTASY_BOOKS,
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

export const addToCollection = (book) => ({
  type: ADD_TO_COLLECTION,
  addToCollection: book,
});

export const removeFromCollection = (book) => ({
  type: REMOVE_FROM_COLLECTION,
  removeFromCollection: book,
});

export const setCollection = (books) => ({
  type: SET_COLLECTION,
  collection: books,
});

export const addToReadingList = (book) => ({
  type: ADD_TO_READING_LIST,
  readingListBook: book,
});

export const removeFromReadingList = (book) => ({
  type: REMOVE_FROM_READING_LIST,
  readingListBook: book,
});

export const setReadingList = (books) => ({
  type: SET_READING_LIST,
  readingList: books,
});

export const addFromReadingListToCollection = (books) => ({
  type: ADD_FROM_READING_LIST_TO_COLLECTION,
  books: books,
});

export const removeBooksFromReadingList = (books) => ({
  type: REMOVE_BOOKS_FROM_READING_LIST,
  books: books,
});