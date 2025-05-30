import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "",
  isOpen: true,
  feeling: "",
  image: "",
  data: null,
  feelingsIsOpen: false,
  openFileDialog: false,
  openVideoDialog: false,
  gifModalIsOpen: false,
  reactionsModalIsOpen: false,
  commentsModalIsOpen: false,
  deleteDialogIsOpen: false,
  deleteDialogType: "",
  modalType: "createquestion",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { type, data, modalType } = action.payload;
      state.isOpen = true;
      state.type = type;
      state.data = data;
      state.modalType = modalType || "createquestion"; // Default to "createquestion" if modalType is not provided
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = "";
      state.feeling = "";
      state.image = "";
      state.data = null;
      state.feelingsIsOpen = false;
      state.gifModalIsOpen = false;
      state.reactionsModalIsOpen = false;
      state.commentsModalIsOpen = false;
      state.openFileDialog = false;
      state.openVideoDialog = false;
      state.deleteDialogIsOpen = false;
      state.deleteDialogType = "";
      state.modalType = "createquestion"
    },
    setModalType: (state, action) => {
      state.modalType = action.payload;
    },
    addPostFeeling: (state, action) => {
      const { feeling } = action.payload;
      state.feeling = feeling;
    },
    toggleImageModal: (state, action) => {
      state.openFileDialog = action.payload;
    },
    toggleVideoModal: (state, action) => {
      state.openVideoDialog = action.payload;
    },
    toggleFeelingModal: (state, action) => {
      state.feelingsIsOpen = action.payload;
    },
    toggleGifModal: (state, action) => {
      state.gifModalIsOpen = action.payload;
    },
    toggleReactionsModal: (state, action) => {
      state.reactionsModalIsOpen = action.payload;
    },
    toggleCommentsModal: (state, action) => {
      state.commentsModalIsOpen = action.payload;
    },
    toggleDeleteDialog: (state, action) => {
      const { data, toggle, dialogType = "" } = action.payload;
      state.deleteDialogIsOpen = toggle;
      state.deleteDialogType = dialogType;
      state.data = data;
    },
  },
});

export const {
  openModal,
  closeModal,
  setModalType,
  addPostFeeling,
  toggleImageModal,
  toggleVideoModal,
  toggleFeelingModal,
  toggleGifModal,
  toggleReactionsModal,
  toggleCommentsModal,
  toggleDeleteDialog,
} = modalSlice.actions;
export default modalSlice.reducer;
