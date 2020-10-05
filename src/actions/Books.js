export const SET_CURRENT_BOOK = "SET_CURRENT_BOOK";
export const SET_HISTORY_BOOKS = "SET_HISTORY_BOOKS";

export const setCurrentBook = (book) => ({
  type: SET_CURRENT_BOOK,
  book: book,
});

export const setHistoryBooks = (books) => ({
  type: SET_HISTORY_BOOKS,
  books: books,
});