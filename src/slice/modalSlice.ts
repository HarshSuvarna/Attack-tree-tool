import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ModalState {
  isOpen: boolean;
  modalData: any;
}

const initialState: ModalState = {
  isOpen: false,
  modalData: null,
};

export const userSlice = createSlice({
  name: "showModal",
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.modalData = { nodeId: action.payload };
    },
    hideModal: (state) => {
      state.isOpen = false;
      state.modalData = null;
    },
  },
});

export const { showModal, hideModal } = userSlice.actions;
export default userSlice.reducer;
