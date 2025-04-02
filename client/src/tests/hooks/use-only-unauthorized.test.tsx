import { mockNavigate } from "@tests/__mocks__/navigate";
import { setStateMockValue } from "@tests/__mocks__/state";
import useOnlyUnauthorized from "@/hooks/use-only-unauthorized";
import { IAuthState } from "@/store/auth-slice";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Use only unauthorized hook test", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Don't redirect if user unauthorized", () => {
    const authState: IAuthState = {
      isAuth: false,
      user: null,
      error: null,
    };

    setStateMockValue({ auth: authState });
    const navigateMock = mockNavigate();
    renderHook(() => useOnlyUnauthorized(), { wrapper: MemoryRouter });
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("Redirect if user authorized", () => {
    const navigateMock = mockNavigate();
    renderHook(() => useOnlyUnauthorized(), { wrapper: MemoryRouter });
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
