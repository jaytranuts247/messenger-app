import { setReadMessageIdToStore } from "./utils/reducerFunctions";

const SET_READ_MESSAGE_ID = "SET_READ_MESSAGE_ID";

export const setReadMessageId = (conversationId, readMessageId) => {
  return {
    type: SET_READ_MESSAGE_ID,
    payload: { conversationId, readMessageId },
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case SET_READ_MESSAGE_ID: {
      return setReadMessageIdToStore(state, action.payload);
    }
    default:
      return state;
  }
};

export const selectReadMessages = (state) => state.readMessages;

export default reducer;
