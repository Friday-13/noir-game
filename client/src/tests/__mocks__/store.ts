// __mocks__/store.ts
import { vi } from "vitest";
import { IAuthState } from "@/store/auth-slice";

export const mockUseAppDispatch = vi.fn(() => vi.fn());
export const mockUseAppSelector = vi.fn((selector) => {
  return selector({
    auth: {
      isAuth: true,
      user: {
        name: "test name",
        auth_token: "test access token",
        refresh_token: "test refresh token",
      },
      error: null,
    } as IAuthState,
  });
});

vi.mock("@/store/hooks", () => ({
  useAppDispatch: mockUseAppDispatch,
  useAppSelector: mockUseAppSelector,
}));

vi.mock("@/store/auth-slice", () => ({
  checkAuth: vi.fn(),
  setAuth: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
}));
