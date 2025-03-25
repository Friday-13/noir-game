// __mocks__/store.ts
import { vi } from "vitest";
import { IAuthState } from "@/store/auth-slice";

vi.mock("@/store/hooks", () => ({
  useAppDispatch: vi.fn().mockReturnValue(vi.fn()),
  useAppSelector: vi.fn((selector) => {
    return selector({
      auth: { isAuth: false, user: null, error: null } as IAuthState,
    });
  }),
}));

vi.mock("@/store/auth-slice", () => ({
  checkAuth: vi.fn(),
  setAuth: vi.fn(),
}));
