import { IAuthState } from "@/store/auth-slice";
import { useAppSelector } from "@/store/hooks";
import { vi } from "vitest";

const defaultTestAuth: IAuthState = {
  isAuth: true,
  user: {
    name: "test user",
    auth_token: "test-access-token",
    refresh_token: "test-refresh-token",
  },
  error: null,
};

export const setStateMockValue = ({ auth }: { auth?: IAuthState }) => {
  const mockedUseAppSelector = vi.mocked(useAppSelector);
  mockedUseAppSelector.mockImplementation((selector) =>
    selector({
      auth: auth || defaultTestAuth,
    }),
  );
  return mockedUseAppSelector;
};
