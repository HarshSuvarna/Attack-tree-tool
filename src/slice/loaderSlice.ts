import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const userSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    toggleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload; 
    },
  },
});

export const { toggleLoading } = userSlice.actions;
export default userSlice.reducer;
