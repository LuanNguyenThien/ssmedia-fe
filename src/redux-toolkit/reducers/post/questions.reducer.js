import { getQuestions } from "@/redux-toolkit/api/posts";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  totalQuestionsCount: 0,
  isLoading: false
};

const questionsSlice = createSlice({
  name: 'allQuestions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.questions = action.payload.questions;
        state.totalQuestionsCount = action.payload.totalQuestions;
        state.isLoading = false;
      })
      .addCase(getQuestions.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default questionsSlice.reducer;