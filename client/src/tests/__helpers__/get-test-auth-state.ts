import { IAuthState } from "@/store/auth-slice";

export const getTestAuthState = (partialState: Partial<IAuthState>) => {
  const state: IAuthState = {
    user: {
      name: "John Doe",
      refresh_token: "test-refresh-token-123",
      auth_token: "test-auth-token-456",
      ...partialState.user,
    },
    isAuth: partialState.isAuth ?? true,
    error: partialState.error ?? null,
  };

  return state;
};

export const getTestUnauthorizedAuthState = (error?: string) => {
  return getTestAuthState({ user: null, isAuth: false, error: error });
};
