import * as hooks from "@/store/hooks";
import { render } from "@testing-library/react";
import useInitAuthState from "@utils/is-auth";
import ServerApi from "@utils/server-api";
import { describe, expect, it, vi } from "vitest";

describe("Init auth state", () => {
  it("isAuth is false when exist and correct", () => {
    const apiMock = vi.spyOn(ServerApi, "getProtected").mockResolvedValue({
      ok: true,
      status: 200,
    } as Response);
    ServerApi.getCsrfRefreshToken = vi.fn().mockResolvedValue("token");

    function TestComponent() {
      useInitAuthState();
      return <p>Test component</p>;
    }

    render(<TestComponent />);
    expect(apiMock).toHaveBeenCalledOnce();
    expect(hooks.useAppDispatch).toHaveBeenCalledOnce();
  });
});
