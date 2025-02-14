import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface ICredentials {
  name: string;
  auth_token: string;
  refresh_token: string;
}

export interface IAuthState {
  isAuth: boolean;
  user?: ICredentials;
}

const initialAuthState: IAuthState = {
  isAuth: false,
  user: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action: PayloadAction<ICredentials>) => {
      state.isAuth = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth.isAuth;
export default authSlice.reducer;
