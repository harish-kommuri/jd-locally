import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    selectedLocation: null
  },
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
    },
    clearUser(state) {
      state.data = null;
    },
    setSelectedLocation(state, action) {
      state.selectedLocation = action.payload;
    }
  }
});

export const { setUser, clearUser, setSelectedLocation } = userSlice.actions;

export default userSlice.reducer;
