import { describe, expect, it, vi } from "vitest";
import reducer, { login, logout, register, setAuth } from "@/store/auth-slice";
import {
  getTestAuthState,
  getTestLoginData,
  getTestUnauthorizedAuthState,
  getTestUserCrendentials,
  getTestRegisterData,
} from "@tests/__helpers__/get-test-auth-state";

describe("Auth reducers test", async () => {
  vi.unmock("@/store/auth-slice");

  it("Set new auth state", () => {
    const initialState = getTestUnauthorizedAuthState();
    const finalState = getTestAuthState();

    const resultState = reducer(initialState, setAuth(finalState));
    expect(resultState.isAuth).toBeTruthy();
  });

  it("Logout", () => {
    const initialState = getTestAuthState();
    const logoutState = reducer(initialState, logout());

    expect(logoutState.isAuth).not.toBeTruthy();
    expect(logoutState.user).toBeNull();
  });

  it("Success login", () => {
    const userData = getTestLoginData();
    const state = reducer(
      undefined,
      login.fulfilled(getTestUserCrendentials(), "", userData),
    );
    expect(state.isAuth).toBeTruthy();
    expect(state.user?.name).toBe(userData.nameOrEmail);
    expect(state.error).toBeNull();
  });

  it("Failed login", async () => {
    const errorPayload = "Test error message";
    const state = reducer(
      undefined,
      login.rejected(null, "", getTestLoginData(), errorPayload),
    );
    expect(state.isAuth).toBeFalsy();
    expect(state.error).toBe(errorPayload);
  });

  it("Success registration", () => {
    const userData = getTestRegisterData();
    const state = reducer(
      undefined,
      register.fulfilled(getTestUserCrendentials(), "", userData),
    );

    expect(state.isAuth).toBeTruthy();
    expect(state.error).toBeNull();
    expect(state.user?.name).toBe(userData.name);
  });

  it("Failed registration", async () => {
    const errorPayload = "Test error message";
    const state = reducer(
      undefined,
      register.rejected(null, "", getTestRegisterData(), errorPayload),
    );
    expect(state.isAuth).toBeFalsy();
    expect(state.error).toBe(errorPayload);
  });
});
