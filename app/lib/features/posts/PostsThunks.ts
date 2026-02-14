import { createAsyncThunk } from "@reduxjs/toolkit";
import { Post } from "../../../types/Post.type";
import apiClient from "@/app/util/apiClient";

export const fetchPosts = createAsyncThunk<Post[]>(
  "posts/fetchPosts",
  async () => {
    const response = await apiClient.get(
      "https://jsonplaceholder.typicode.com/posts",
    );
    return response.data;
  },
);

export const fetchPost = createAsyncThunk<Post>(
  "posts/fetchPost",
  async (postId) => {
    const response = await apiClient.get(
      "https://jsonplaceholder.typicode.com/posts/" + postId,
    );
    return response.data;
  },
);

export const createPost = createAsyncThunk<Post>(
  "posts/createPost",
  async () => {
    const response = await apiClient.post(
      "https://jsonplaceholder.typicode.com/posts",
    );
    return response.data;
  },
);

export const deletePost = createAsyncThunk<Post>(
  "posts/deletePost",
  async (postId) => {
    const response = await apiClient.delete(
      "https://jsonplaceholder.typicode.com/posts" + postId,
    );
    return response.data;
  },
);
