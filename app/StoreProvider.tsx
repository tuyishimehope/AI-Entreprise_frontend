"use client";

import { Provider } from "react-redux";
import makeStore from "./lib/store";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = makeStore();

  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
