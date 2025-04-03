import * as hooks from "@/store/hooks";
import { render } from "@testing-library/react";
import { getFetchMock } from "@tests/__mocks__/fetch";
import useInitAuthState from "@utils/is-auth";
import ServerApi from "@utils/server-api";
import { describe, expect, it, vi } from "vitest";

describe("Init auth state", () => {
  it("isAuth is false when exist and correct", () => {
    ServerApi.getProtected = getFetchMock({
      status: 200,
      json: { name: "", auth_token: "", refresh_token: "" },
    });
    ServerApi.getCsrfRefreshToken = vi.fn().mockReturnValue("token");

    function TestComponent() {
      useInitAuthState();
      return <p>Test component</p>;
    }

    render(<TestComponent />);
    expect(ServerApi.getProtected).toHaveBeenCalledOnce();
    expect(hooks.useAppDispatch).toHaveBeenCalledOnce();
  });
});
