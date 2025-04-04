import { IAuthState } from "@/store/auth-slice";
import { useAppSelector } from "@/store/hooks";
import { getTestAuthState } from "@tests/__helpers__/get-test-auth-state";
import { vi } from "vitest";

const defaultTestAuth = getTestAuthState();

export const setStateMockValue = ({ auth }: { auth?: IAuthState }) => {
  const mockedUseAppSelector = vi.mocked(useAppSelector);
  mockedUseAppSelector.mockImplementation((selector) =>
    selector({
      auth: auth || defaultTestAuth,
    }),
  );
  return mockedUseAppSelector;
};
