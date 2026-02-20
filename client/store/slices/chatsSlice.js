import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    messagesByChatId: {},
    taskInProgress: {}
  },
  reducers: {
    setChatMessages(state, action) {
      const { chatId, messages } = action.payload;
      state.messagesByChatId[chatId] = messages;
    },
    addChatMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.messagesByChatId[chatId]) {
        state.messagesByChatId[chatId] = [];
      }
      state.messagesByChatId[chatId].push(message);
    },
    setTaskInProgress(state, action) {
        const { chatId, data } = action.payload;
        state.taskInProgress[chatId] = data || {};
    },
    clearChatMessages(state, action) {
      const chatId = action.payload;
      delete state.messagesByChatId[chatId];
    }
  }
});

export const { setChatMessages, addChatMessage, clearChatMessages, setTaskInProgress } = chatsSlice.actions;

export default chatsSlice.reducer;
