import { describe, expect, it, vi } from "vitest";
import reducer, {
  logout,
  setAuth,
} from "@/store/auth-slice";
import {
  getTestAuthState,
  getTestUnauthorizedAuthState,
} from "@tests/__helpers__/get-test-auth-state";

describe("Auth reducers test", async () => {
  vi.unmock("@/store/auth-slice");

  it("Set new auth state", () => {
    const initialState = getTestUnauthorizedAuthState();
    const finalState = getTestAuthState({});

    const resultState = reducer(initialState, setAuth(finalState));
    expect(resultState.isAuth).toBeTruthy();
  });

  it("Logout", () => {
    const initialState = getTestAuthState({});
    const logoutState = reducer(initialState, logout());

    expect(logoutState.isAuth).not.toBeTruthy();
    expect(logoutState.user).toBeNull();
  });

  // it("Success login", async () => {
  //   const state = reducer(
  //     undefined,
  //     login.fulfilled({ name: "", refresh_token: "", auth_token: "" }, "", {
  //       nameOrEmail: "",
  //       password: "",
  //     })
  //   );
  //   expect(state.isAuth).toBeTruthy();
  // });
});
