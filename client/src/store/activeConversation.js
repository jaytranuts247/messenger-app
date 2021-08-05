const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (username) => {
  return {
    type: SET_ACTIVE_CHAT,
    username,
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return action.username;
    }
    default:
      return state;
  }
};

export const selectActiveConversation = (state) => state.activeConversation;

export default reducer;
