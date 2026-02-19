import { createSlice } from "@reduxjs/toolkit";

const defaultUser = {
  id: "demo-user",
  name: "Harish"
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: defaultUser
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
