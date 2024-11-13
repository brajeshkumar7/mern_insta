import { createSlice } from "@reduxjs/toolkit";
import { PostState } from "../types//post";

const initialState: PostState = {
  post: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostData: (state, action) => {
      console.log(action.payload);
      const { post } = action.payload;
      state.post = post;
    },
    setPostActions: (state, action) => {
      if (state.post) {
        state.post = state.post.map((post) =>
          post._id === action.payload._id ? { ...post, ...action.payload } : post
        );
      }
    },
  },
});

export const { setPostData, setPostActions } = postSlice.actions;
export default postSlice.reducer;
