export const SET_CURRENT_BOOK = "SET_CURRENT_BOOK";

export const setCurrentBook = (book) => ({
  type: SET_CURRENT_BOOK,
  book: book,
});