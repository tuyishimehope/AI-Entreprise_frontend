import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    add: (state) => {
      state.value += 1;
    },
    subtract: (state) => {
      state.value -= 1;
    },
  },
});

export const { add, subtract } = counterSlice.actions;

export default counterSlice;
