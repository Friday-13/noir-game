import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import ServerApi from "@/utils/server-api";

export interface ICredentials {
  name: string;
  auth_token: string;
  refresh_token: string;
}

export interface IAuthState {
  isAuth: boolean;
  user: ICredentials | null;
  error: string | null;
}

const initialAuthState: IAuthState = {
  isAuth: false,
  user: null,
  error: null,
};

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const response = await ServerApi.getProtected();
  const code = response.status;
  return code;
});

interface ILogin {
  nameOrEmail: string;
  password: string;
}

interface IRegister {
  name: string;
  email: string;
  password: string;
}

export const login = createAsyncThunk<
  ICredentials,
  ILogin,
  { rejectValue: string }
>("auth/login", async (loginData: ILogin, { rejectWithValue }) => {
  const response = await ServerApi.login(
    loginData.nameOrEmail,
    loginData.password,
  );
  const content = await response.json();
  if (!response.ok) {
    return rejectWithValue(content?.detail?.message || "Authorization error");
  }
  return content as ICredentials;
});

export const register = createAsyncThunk<
  ICredentials,
  IRegister,
  { rejectValue: string }
>("auth/register", async (registerData: IRegister, { rejectWithValue }) => {
  const response = await ServerApi.register(
    registerData.name,
    registerData.email,
    registerData.password,
  );
  const content = await response.json();
  if (!response.ok) {
    return rejectWithValue(content?.detail?.message || "Registration error");
  }
  return content as ICredentials;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      state.user = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IAuthState>) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuth = false;
        state.user = null;
        state.error = action.payload || "Unknown authorization error";
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuth = false;
        state.user = null;
        state.error = action.payload || "Unknown registration error";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth.isAuth;
export default authSlice.reducer;
