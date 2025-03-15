import { createAsyncThunk } from '@reduxjs/toolkit';
import { Utils } from '@services/utils/utils.service';
import { userService } from '@services/api/user/user.service';

const getUserSuggestions = createAsyncThunk('user/getSuggestions', async (name, { dispatch }) => {
  try {
    const response = await userService.getUserSuggestions();
    return response.data;
  } catch (error) {
    Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
  }
});

export { getUserSuggestions };
