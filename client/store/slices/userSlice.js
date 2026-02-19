import { createSlice } from "@reduxjs/toolkit";

const defaultUser = {
  id: "demo-user",
  name: "Harish"
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: defaultUser
  },
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
    },
    clearUser(state) {
      state.data = null;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
