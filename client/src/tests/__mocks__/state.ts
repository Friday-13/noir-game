import { IAuthState } from "@/store/auth-slice";
import { ICounterState } from "@/store/counter-slice";
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

const defaultTestCounter: ICounterState = {
  value: 0,
};

export const setStateMockValue = ({
  auth,
  counter,
}: {
  auth?: IAuthState;
  counter?: ICounterState;
}) => {
  const mockedUseAppSelector = vi.mocked(useAppSelector);
  mockedUseAppSelector.mockImplementation((selector) =>
    selector({
      auth: auth || defaultTestAuth,
      counter: counter || defaultTestCounter,
    }),
  );
  return mockedUseAppSelector;
};
