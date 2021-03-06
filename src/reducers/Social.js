import {
  ADD_FRIEND,
  REMOVE_FRIEND,
  SET_CURRENT_FRIEND,
  SET_FRIENDS,
  ADD_FRIEND_COLLECTION,
  ADD_FRIEND_READING_LIST,
} from "../actions/Social";

const initialState = {
  friends: {},
  friendsCollections: {},
  friendsReadingLists: {},
  selectedFriend: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_FRIEND:
      return {
        ...state,
        selectedFriend: action.friend,
      };
    case ADD_FRIEND:
      let newFriends = { ...state.friends };
      newFriends[action.friend.uid] = action.friend;
      return {
        ...state,
        friends: newFriends,
      };
    case REMOVE_FRIEND:
      let updatedFriends = { ...state.friends };
      delete updatedFriends[action.friend.uid];
      return {
        ...state,
        friends: updatedFriends,
      };
    case SET_FRIENDS:
      return {
        ...state,
        friends: action.friends,
      };
    case ADD_FRIEND_COLLECTION:
      let newFriendsCollections = { ...state.friendsCollections };
      newFriendsCollections[action.friendID] = action.friendCollection;
      return {
        ...state,
        friendsCollections: newFriendsCollections,
      };
    case ADD_FRIEND_READING_LIST:
      let newFriendsReadingLists = { ...state.friendsReadingLists };
      newFriendsReadingLists[action.friendID] = action.friendReadingList;
      return {
        ...state,
        friendsReadingLists: newFriendsReadingLists,
      };
    default:
      return state;
  }
};
