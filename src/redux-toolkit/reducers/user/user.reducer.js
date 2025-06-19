import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  profile: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { token, profile } = action.payload;
      state.token = token;
      state.profile = profile;
    },
    clearUser: (state) => {
      state.token = '';
      state.profile = null;
    },
    updateUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    updatePersonalizeSettings: (state, action) => {
      state.profile.personalizeSettings.allowPersonalize = action.payload.allowPersonalize;
    }
  }
});

export const { addUser, clearUser, updateUserProfile, updatePersonalizeSettings } = userSlice.actions;
export default userSlice.reducer;
