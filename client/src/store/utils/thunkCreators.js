import axios from "axios";
import socket, { socketId } from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  setReadMessage,
} from "../conversations";
import { setReadMessageId } from "../readMessages";
import { incrementUnReadMessage, resetUnReadMessage } from "../unReadMessages";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", { id: data.id, socketId });
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);

    // session
    await localStorage.setItem("sessionID", data.sessionID);
    socket.auth = { sessionID: data.sessionID, token: data.token };
    socket.userId = data.userId;

    dispatch(gotUser(data));
    socket.emit("go-online", { id: data.id, socketId });
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);

    // session
    await localStorage.setItem("sessionID", data.sessionID);
    socket.auth = { sessionID: data.sessionID, token: data.token };
    socket.userId = data.userId;

    dispatch(gotUser(data));
    socket.emit("go-online", { id: data.id, socketId });
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const updateMessageStatus = async (senderId, activeConversationId) => {
  const { data } = await axios.patch("/api/messages/read", {
    senderId,
    activeConversationId,
  });
  return data;
};

const sendReadMessageStatus = (senderId, recipientId, conversationId) => {
  socket.emit("read-message", {
    senderId,
    recipientId,
    conversationId,
  });
};

export const updateMessageStatusHandler =
  (activeConversation, conversations, conversationId, senderId, recipientId) =>
  async (dispatch) => {
    try {
      // no active chat, not send read-message event
      if (activeConversation === "") return;

      const activeConvo = conversations.find(
        (convo) => convo.otherUser.username === activeConversation
      );

      // no convo found OR activeConversation is message conversationId, return
      if (!activeConvo || activeConvo.id !== conversationId) return;

      // update  read message status in db
      await updateMessageStatus(senderId, activeConvo.id);

      dispatch(setReadMessage(senderId, activeConvo.id));

      sendReadMessageStatus(senderId, recipientId, activeConvo.id);
    } catch (error) {
      console.error(error);
    }
  };

export const setReadMessageIdHandler =
  (conversations, conversationId) => (dispatch) => {
    try {
      if (!conversationId) return;
      const foundConvo = conversations.find(
        (convo) => convo.id === conversationId
      );

      if (!foundConvo) return;

      const foundReadMessage = foundConvo.messages.find(
        (message) =>
          message.senderId !== foundConvo.otherUser.id && message.readStatus
      );

      if (!foundReadMessage) return;

      dispatch(setReadMessageId(foundConvo.id, foundReadMessage.id));
    } catch (error) {
      console.error(error);
    }
  };

export const initializeReadMessageIdHandler =
  (conversation) => async (dispatch) => {
    try {
      let foundMessage = conversation.messages.find(
        (message) =>
          message.senderId !== conversation.otherUser.id && message.readStatus
      );

      if (!foundMessage) return;

      dispatch(setReadMessageId(conversation.id, foundMessage.id));
    } catch (error) {
      console.error(error);
    }
  };

export const unreadMessageHandler =
  (conversationId, conversations, activeConversation) => (dispatch) => {
    try {
      // no avtiveconversation, increment unread message
      if (activeConversation === "") {
        return dispatch(incrementUnReadMessage(conversationId));
      }

      // if active converesation found, then find convo and reset
      let foundConversation = conversations.find(
        (convo) => convo.otherUser.username === activeConversation
      );

      if (!foundConversation) return;

      if (foundConversation.id === conversationId)
        return dispatch(resetUnReadMessage(foundConversation.id));
      else return dispatch(incrementUnReadMessage(conversationId));
    } catch (error) {
      console.error(error);
    }
  };
