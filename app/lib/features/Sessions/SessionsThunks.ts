import { ChatsData } from "@/app/types/chat.type";
import { SessionData } from "@/app/types/Session.type";
import apiClient from "@/app/util/apiClient";
import { getErrorMessage } from "@/app/util/error";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { streamChunk } from "./SessionSlice";
import sessionsSlice from "./SessionSlice";
import { api } from "@/app/util/api";

export const startSession = createAsyncThunk<SessionData, FormData>(
  "sessions/startSession",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/session`, formData);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchSessions = createAsyncThunk<SessionData[]>(
  "sessions/fetchSession",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/session`);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteSession = createAsyncThunk(
  "sessions/deleteSession",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/session/${id}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getFileId = createAsyncThunk<string, string>(
  "sessions/getFileId",
  async (session_id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/session/${session_id}`);
      return response.data.document_id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchSessionById = createAsyncThunk<ChatsData[], string>(
  "sessions/fetchSessionById",
  async (session_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/history/${session_id}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const sendMessage = createAsyncThunk(
  "sessions/sendMessage",
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(api + "/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        fullText += chunk;

        dispatch(streamChunk({ text: chunk }));
      }

      return {
        id: crypto.randomUUID(),
        question: formData.get("question"),
        answer: fullText,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Stream failed:", error);
      return rejectWithValue(error.message);
    }
  },
);
