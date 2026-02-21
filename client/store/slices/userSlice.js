import { createSlice } from "@reduxjs/toolkit";

const defaultLocationData = {
  city: "Hyderabad",
  area: "Hitech City",
  state: "Telangana",
  pincode: "500081",
  lat: 17.4474,
  long: 78.3762
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    locationData: defaultLocationData
  },
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
    },
    clearUser(state) {
      state.data = null;
    },
    setLocationData(state, action) {
      state.locationData = action.payload;
    }
  }
});

export const { setUser, clearUser, setLocationData } = userSlice.actions;

export default userSlice.reducer;
