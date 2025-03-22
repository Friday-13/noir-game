import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./counter-slice";
import { authSlice } from "./auth-slice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
