export const ADD_FRIEND = "ADD_FRIEND";
export const REMOVE_FRIEND = "REMOVE_FRIEND";
export const SET_CURRENT_FRIEND = "SET_CURRENT_FRIEND";
export const SET_FRIENDS = "SET_FRIENDS";
export const ADD_FRIEND_COLLECTION = "ADD_FRIEND_COLLECTION";
export const ADD_FRIEND_READING_LIST = "ADD_FRIEND_READING_LIST";

export const addFriend = (friend) => ({
  type: ADD_FRIEND,
  friend: friend,
});

export const removeFriend = (friend) => ({
  type: REMOVE_FRIEND,
  friend: friend,
});

export const setCurrentFriend = (friend) => ({
  type: SET_CURRENT_FRIEND,
  friend: friend,
});

export const setFriends = (friends) => ({
  type: SET_FRIENDS,
  friends: friends,
});

export const addFriendCollection = (friendID, friendCollection) => ({
  type: ADD_FRIEND_COLLECTION,
  friendID: friendID,
  friendCollection: friendCollection,
});

export const addFriendReadingList = (friendID, friendReadingList) => ({
  type: ADD_FRIEND_READING_LIST,
  friendID: friendID,
  friendReadingList: friendReadingList,
});