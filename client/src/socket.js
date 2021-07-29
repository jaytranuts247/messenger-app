import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setReadMessage,
  setIsTyping,
} from "./store/conversations";
import {
  setReadMessageIdHandler,
  updateMessageStatusHandler,
} from "./store/utils/thunkCreators";
import { incrementUnReadMessage } from "./store/unReadMessages";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    const { user, activeConversation, conversations } = store.getState();

    // if not recipient, return
    if (user.id !== data.recipientId) return;

    //  update new message
    store.dispatch(setNewMessage(data.message, data.sender));

    // remove typing indicator on new message receive
    store.dispatch(setIsTyping(data.message.conversationId, false));

    // increment unReadMessageCount
    store.dispatch(incrementUnReadMessage(data.message.conversationId));

    // emit read-message
    store.dispatch(
      updateMessageStatusHandler(
        activeConversation,
        conversations,
        data.message.conversationId,
        data.message.senderId
      )
    );
  });

  socket.on("read-message", async (data) => {
    store.dispatch(setReadMessage(data.senderId, data.conversationId));
    store.dispatch(
      setReadMessageIdHandler(
        store.getState().conversations,
        data.conversationId
      )
    );
  });

  // { isTyping, senderId, recipientId, conversationId }
  socket.on("is-typing", (data) => {
    const { conversationId, isTyping } = data;
    store.dispatch(setIsTyping(conversationId, isTyping));
  });
});

export default socket;
