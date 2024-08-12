import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  isAuthenticated: boolean;
  userData: Record<string, any> | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
