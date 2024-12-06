import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpenSidebar: false,
  isOpenSearchBar: false
};

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setIsOpenSidebar: (state) => {
      state.isOpenSidebar = !state.isOpenSidebar;
    },
    setIsOpenSearchBar: (state) => {
      state.isOpenSearchBar = !state.isOpenSearchBar;
    }
  }
});

export const { setIsOpenSidebar, setIsOpenSearchBar } = navbarSlice.actions;
export default navbarSlice.reducer;
