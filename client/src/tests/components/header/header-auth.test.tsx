import { IAuthState, logout } from "@/store/auth-slice";
import { mockNavigate } from "@tests/__mocks__/navigate";
import HeaderAuth from "@components/header/header-auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setStateMockValue } from "@tests/__mocks__/state";
import ServerApi from "@utils/server-api";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as manageNickname from "@/utils/manage-nickname";

describe("Header auth button", async () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const renderHeaderAuth = () => {
    render(
      <MemoryRouter>
        <HeaderAuth />
      </MemoryRouter>,
    );
  };

  it("render logout if user authorized", () => {
    renderHeaderAuth();
    const logoutOption = screen.getByText("Logout");
    expect(logoutOption).toBeInTheDocument();
  });

  it("render login and register if user unauthorized", () => {
    const authState: IAuthState = {
      isAuth: false,
      user: null,
      error: null,
    };
    setStateMockValue({ auth: authState });
    renderHeaderAuth();
    const logoutOption = screen.getByText("Login");
    const registerOption = screen.getByText("Register");
    expect(logoutOption).toBeInTheDocument();
    expect(registerOption).toBeInTheDocument();
  });

  it("Remove user data when logout clicked", async () => {
    const logoutRequest = vi
      .spyOn(ServerApi, "logout")
      .mockImplementation(vi.fn());

    const logoutMock = vi.mocked(logout);
    const removeNameOrEmailMock = vi
      .spyOn(manageNickname, "removeNameOrEmail")
      .mockImplementation(vi.fn());
    const navigateMock = mockNavigate();
    renderHeaderAuth();
    const logoutOption = screen.getByText("Logout");
    fireEvent.click(logoutOption);
    await waitFor(() => {
      expect(logoutRequest).toHaveBeenCalledOnce();
      expect(logoutMock).toHaveBeenCalledOnce();
      expect(removeNameOrEmailMock).toHaveBeenCalledOnce();
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });
});
