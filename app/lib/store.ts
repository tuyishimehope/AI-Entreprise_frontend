import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter/CounterSlice";
import postSlice from "./features/posts/PostsSlice";
import sessionsSlice from "./features/Sessions/SessionSlice";

const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice.reducer,
      posts: postSlice,
      sessions: sessionsSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default makeStore;
