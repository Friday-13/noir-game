import { IAuthState, ILogin, login } from "@/store/auth-slice";
import { mockNavigate } from "@tests/__mocks__/navigate";
import Login from "@components/pages/login";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setStateMockValue } from "@tests/__mocks__/state";

describe("login page", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderLoginPage = () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
  };

  it("render correctly", () => {
    const authState: IAuthState = {
      isAuth: false,
      user: null,
      error: null,
    };
    setStateMockValue({ auth: authState });

    renderLoginPage();
    const header = screen.getByRole("heading");
    expect(header).toBeInTheDocument();

    const form = header.parentElement;
    expect(form).toBeInTheDocument();

    const nameOrEmailInput = screen.getByPlaceholderText("name or email");
    const passwordInput = screen.getByPlaceholderText("password");
    const submitInput = screen.getByRole("button");

    expect(nameOrEmailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitInput).toBeInTheDocument();
  });

  it("Redirect when login successfull", () => {
    const navigateMock = mockNavigate();
    renderLoginPage();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("Print error message on error", () => {
    const authState: IAuthState = {
      isAuth: false,
      user: null,
      error: "test error",
    };
    setStateMockValue({ auth: authState });
    renderLoginPage();
    expect(screen.getByText("test error")).toBeInTheDocument();
  });

  it("Try to login with coorect name and password", () => {
    const authState: IAuthState = {
      isAuth: false,
      user: null,
      error: null,
    };
    setStateMockValue({ auth: authState });

    const loginMock = vi.mocked(login);

    renderLoginPage();

    const nameOrEmailInput = screen.getByPlaceholderText("name or email");
    const passwordInput = screen.getByPlaceholderText("password");

    fireEvent.change(nameOrEmailInput, { target: { value: "test name" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    const header = screen.getByRole("heading");
    const form = header.parentElement;
    expect(form).toBeInTheDocument();
    fireEvent.submit(form as HTMLFormElement);

    expect(loginMock).toHaveBeenCalledOnce();
    expect(loginMock).toHaveBeenCalledWith({
      nameOrEmail: "test name",
      password: "test-password",
    } as ILogin);
  });
});
