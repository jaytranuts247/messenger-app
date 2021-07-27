import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setReadMessage,
} from "./store/conversations";
import { updateMessageStatusHandler } from "./store/utils/thunkCreators";

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
    store.dispatch(setReadMessage(data.conversationId, data.messages));
  });
});

export default socket;
