import { createSlice } from "@reduxjs/toolkit";
import { createPost, deletePost, fetchPost, fetchPosts } from "./PostsThunks";
import { Post } from "../../../types/Post.type";

interface InitialState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | undefined;
}
const initialState: InitialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: "",
};

const postsSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      ((state.loading = false), (state.posts = action.payload));
    });

    builder.addCase(fetchPost.fulfilled, (state, action) => {
      ((state.loading = false), (state.currentPost = action.payload));
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      ((state.loading = false),
        ((state.currentPost = action.payload),
        state.posts.push(action.payload)));
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      ((state.loading = false),
        (state.posts = state.posts.filter(
          (post) => post.id != action.payload.id,
        )));
    });

    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
      },
    );

    builder.addMatcher(
      (action) =>
        action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        if (action.type.endsWith("/rejected")) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          state.error = (action as any).error?.message;
        }
      },
    );
  },
});

export default postsSlice.reducer;
