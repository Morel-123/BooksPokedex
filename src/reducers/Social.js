import { ADD_FRIEND, REMOVE_FRIEND, SET_CURRENT_FRIEND, SET_FRIENDS } from "../actions/Social";

const initialState = {
  friends: {},
  selectedFriend: null,
};

export default (state = initialState, action) => {
  console.log(action);
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
    default:
      return state;
  }
};
