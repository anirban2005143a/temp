import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isResponseGenerating: false,
  chatMessages: [],
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    setisResponseGenerating: (state, action) => {
      state.isResponseGenerating = action.payload;
    },
  },
});

export const { addMessage, setisResponseGenerating } = chatSlice.actions;

export default chatSlice.reducer;