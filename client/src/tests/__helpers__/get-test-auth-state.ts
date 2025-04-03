import {
  IAuthState,
  ICredentials,
  ILogin,
  IRegister,
} from "@/store/auth-slice";

export const getTestUserCrendentials = (
  partialCredentials: Partial<ICredentials> = {},
) => {
  const user = {
    name: "John Doe",
    refresh_token: "test-refresh-token-123",
    auth_token: "test-auth-token-456",
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
    nameOrEmail: "John Doe",
    password: "test-password-123",
    ...partialData,
  };
  return data;
};

export const getTestRegisterData = (partialData: Partial<IRegister> = {}) => {
  const data: IRegister = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "test-password-123",
    ...partialData,
  };
  return data;
};
