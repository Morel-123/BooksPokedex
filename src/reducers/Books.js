import {
  SET_CURRENT_BOOK,
  SET_HISTORY_BOOKS,
  SET_BUSINESS_BOOKS,
  SET_SELF_HELP_BOOKS,
  SET_FANTASY_BOOKS,
  ADD_FAVORITE_BOOK,
  REMOVE_FAVORITE_BOOK,
  SET_FAVORITE_BOOKS,
  ADD_TO_COLLECTION,
  REMOVE_FROM_COLLECTION,
  SET_COLLECTION,
  ADD_TO_READING_LIST,
  REMOVE_FROM_READING_LIST,
  SET_READING_LIST,
  ADD_FROM_READING_LIST_TO_COLLECTION,
  REMOVE_BOOKS_FROM_READING_LIST,
} from "../actions/Books";

const initialState = {
  selectedBook: null,
  historyBooks: null,
  businessBooks: null,
  selfHelpBooks: null,
  fantasyBooks: null,
  favoriteBooks: {},
  collection: {},
  readingList: {},
};

export default (state = initialState, action) => {
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
    case SET_BUSINESS_BOOKS:
      return {
        ...state,
        businessBooks: action.books,
      };
    case SET_SELF_HELP_BOOKS:
      return {
        ...state,
        selfHelpBooks: action.books,
      };
    case SET_FANTASY_BOOKS:
      return {
        ...state,
        fantasyBooks: action.books,
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
    case ADD_TO_COLLECTION:
      let newCollection = { ...state.collection };
      newCollection[action.addToCollection.id] = action.addToCollection;
      return {
        ...state,
        collection: newCollection,
      };
    case REMOVE_FROM_COLLECTION:
      let updatedCollection = { ...state.collection };
      delete updatedCollection[action.removeFromCollection.id];
      return {
        ...state,
        collection: updatedCollection,
      };
    case SET_COLLECTION:
      return {
        ...state,
        collection: action.collection,
      };
    case ADD_TO_READING_LIST:
      let newReadingList = { ...state.readingList };
      newReadingList[action.readingListBook.id] = action.readingListBook;
      return {
        ...state,
        readingList: newReadingList,
      };
    case REMOVE_FROM_READING_LIST:
      let updatedReadingList = { ...state.readingList };
      delete updatedReadingList[action.readingListBook.id];
      return {
        ...state,
        readingList: updatedReadingList,
      };
    case SET_READING_LIST:
      return {
        ...state,
        readingList: action.readingList,
      };
    case ADD_FROM_READING_LIST_TO_COLLECTION:
      let updatedNewCollection = { ...state.collection };
      let updatedNewReadingList = { ...state.readingList };
      for (const book of action.books) {
        delete updatedNewReadingList[book.id];
        if(!updatedNewCollection[book.id]) {
          updatedNewCollection[book.id] = book;
        }
      }
      return {
        ...state,
        collection: updatedNewCollection,
        readingList: updatedNewReadingList,
      };
    case REMOVE_BOOKS_FROM_READING_LIST:
      let newUpdatedReadingList = { ...state.readingList };
      for (const book of action.books) {
        delete newUpdatedReadingList[book.id];
      }
      return {
        ...state,
        readingList: newUpdatedReadingList,
      };
    default:
      return state;
  }
};
