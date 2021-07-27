import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  setReadMessage,
} from "../conversations";
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
      socket.emit("go-online", data.id);
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
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
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
  const { data } = await axios.patch("/api/messages", {
    senderId,
    activeConversationId,
  });
  return data;
};

const sendReadMessageStatus = (conversationId, messages) => {
  socket.emit("read-message", {
    conversationId,
    messages,
  });
};

export const updateMessageStatusHandler =
  (activeConversation, conversations, conversationId, senderId) =>
  async (dispatch) => {
    try {
      // no active chat, not send read-message event
      if (activeConversation === "") return;

      const activeConvo = conversations.find(
        (convo) => convo.otherUser.username === activeConversation
      );

      // no convo found OR activeConversation is message conversationId, return
      if (!activeConvo || activeConvo.id !== conversationId) return;

      const data = await updateMessageStatus(senderId, activeConvo.id);

      //  if not found messages to update, then return
      if (!Array.isArray(data.messages) || !data.messages.length) return;

      dispatch(setReadMessage(data.messages[0].conversationId, data.messages));

      sendReadMessageStatus(data.messages[0].conversationId, data.messages);
    } catch (error) {
      console.error(error);
    }
  };

export const updateMessageStatusClickHandler =
  (conversationId, otherUserId) => async (dispatch) => {
    try {
      const data = await updateMessageStatus(otherUserId, conversationId);

      //  if not found messages to update, then return
      if (!Array.isArray(data.messages) || !data.messages.length) return;

      dispatch(setReadMessage(conversationId, data.messages));
      sendReadMessageStatus(conversationId, data.messages);
    } catch (error) {
      console.error(error);
    }
  };
