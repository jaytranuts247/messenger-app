import {
  resetUnReadMessageToStore,
  incrementUnReadMessageToStore,
  setUnReadMessageToStore,
} from "./utils/reducerFunctions";

const SET_UNREAD_MESSAGE = "SET_UNREAD_MESSAGE";
const INCREMENT_UNREAD_MESSAGE = "INCREMENT_UNREAD_MESSAGE";
const RESET_UNREAD_MESSAGE = "RESET_UNREAD_MESSAGE";

export const setUnReadMessage = (conversationId, unReadMessageCount) => {
  return {
    type: SET_UNREAD_MESSAGE,
    payload: { conversationId, unReadMessageCount },
  };
};

export const incrementUnReadMessage = (conversationId) => {
  return {
    type: INCREMENT_UNREAD_MESSAGE,
    payload: conversationId,
  };
};

export const resetUnReadMessage = (conversationId) => {
  return {
    type: RESET_UNREAD_MESSAGE,
    payload: conversationId,
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case SET_UNREAD_MESSAGE:
      return setUnReadMessageToStore(state, action.payload);
    case INCREMENT_UNREAD_MESSAGE:
      return incrementUnReadMessageToStore(state, action.payload);
    case RESET_UNREAD_MESSAGE:
      return resetUnReadMessageToStore(state, action.payload);
    default:
      return state;
  }
};

export const selectUnReadMessages = (state) => state.unReadMessages;

export default reducer;
