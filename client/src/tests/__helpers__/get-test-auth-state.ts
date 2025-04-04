import {
  IAuthState,
  ICredentials,
  ILogin,
  IRegister,
} from "@/store/auth-slice";

const defaultName = "John Doe";
const defaultEmail = "john.doe@example.com";
const defaultPassword = "test-password-123";
const defaultRefreshToken = "test-refresh-token-123";
const defaultAuthToken = "test-auth-token-456";

export const getTestUserCrendentials = (
  partialCredentials: Partial<ICredentials> = {},
) => {
  const user = {
    name: defaultName,
    refresh_token: defaultRefreshToken,
    auth_token: defaultAuthToken,
    ...partialCredentials,
  };
  return user;
};

export const getTestAuthState = (partialState: Partial<IAuthState> = {}) => {
  const state: IAuthState = {
    user: getTestUserCrendentials(partialState.user ?? {}),
    isAuth: partialState.isAuth ?? true,
    error: partialState.error ?? null,
  };

  return state;
};

export const getTestUnauthorizedAuthState = (error: string | null = null) => {
  return getTestAuthState({ user: null, isAuth: false, error: error });
};

export const getTestLoginData = (partialData: Partial<ILogin> = {}) => {
  const data: ILogin = {
    nameOrEmail: defaultName,
    password: defaultPassword,
    ...partialData,
  };
  return data;
};

export const getTestRegisterData = (partialData: Partial<IRegister> = {}) => {
  const data: IRegister = {
    name: defaultName,
    email: defaultEmail,
    password: defaultPassword,
    ...partialData,
  };
  return data;
};
