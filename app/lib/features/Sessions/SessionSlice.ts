import { SessionData } from "@/app/types/Session.type";
import { ChatsData } from "@/app/types/chat.type";
import {
  createSlice,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import {
  deleteSession,
  fetchSessionById,
  fetchSessions,
  getFileId,
  sendMessage,
  startSession,
} from "./SessionsThunks";

interface InitialState {
  sessions: SessionData[];
  currentSession: SessionData | null;
  data: ChatsData[];
  currentData: ChatsData | null;
  fileId: string;
  loading: boolean;
  error: string | undefined;
}

const initialState: InitialState = {
  sessions: [],
  currentSession: null,
  data: [],
  currentData: null,
  fileId: "",
  loading: false,
  error: "",
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,

  reducers: {
    streamChunk: (state, action: { payload: { text: string } }) => {
      const lastMsg = state.data[state.data.length - 1];
      if (lastMsg && lastMsg.id === "temp-id") {
        if (lastMsg.answer === "Thinking...") {
          lastMsg.answer = action.payload.text;
        } else {
          lastMsg.answer += action.payload.text;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.sessions.push(action.payload);
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter((s) => s.id !== action.meta.arg);
      })
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(getFileId.fulfilled, (state, action) => {
        state.fileId = action.payload;
      })
      .addCase(sendMessage.pending, (state, action) => {
        const question = action.meta.arg.get("question") as string;

        state.data.push({
          id: "temp-id",
          question: question,
          answer: "Thinking...",
        } as ChatsData);
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const index = state.data.findIndex((m) => m.id === "temp-id");
        if (index !== -1) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          state.data[index] = action.payload;
        }
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addMatcher(isAnyOf(isFulfilled, isRejected), (state, action) => {
        state.loading = false;
        if (isRejected(action)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          state.error = (action.payload as any)?.detail || action.error.message;
        }
      });
  },
});

export const { streamChunk } = sessionsSlice.actions;
export default sessionsSlice;
