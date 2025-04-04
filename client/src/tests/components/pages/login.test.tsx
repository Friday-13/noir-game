import { ILogin, login } from "@/store/auth-slice";
import Login from "@components/pages/login";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setStateMockValue } from "@tests/__mocks__/state";
import { mockUseOnlyUnauthorized } from "@tests/__mocks__/access-control";
import {
  getTestLoginData,
  getTestUnauthorizedAuthState,
} from "@tests/__helpers__/get-test-auth-state";

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
    const authState = getTestUnauthorizedAuthState();
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

  it("Access control implemeted", () => {
    const useOnlyUnauthorizedMock = mockUseOnlyUnauthorized();
    renderLoginPage();
    expect(useOnlyUnauthorizedMock).toHaveBeenCalledOnce();
  });

  it("Print error message on error", () => {
    const errorMessage = "test error";
    const authState = getTestUnauthorizedAuthState(errorMessage);
    setStateMockValue({ auth: authState });
    renderLoginPage();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("Try to login with correct name and password", () => {
    const authState = getTestUnauthorizedAuthState();
    const testUser = getTestLoginData();
    setStateMockValue({ auth: authState });

    const loginMock = vi.mocked(login);

    renderLoginPage();

    const nameOrEmailInput = screen.getByPlaceholderText("name or email");
    const passwordInput = screen.getByPlaceholderText("password");

    fireEvent.change(nameOrEmailInput, {
      target: { value: testUser.nameOrEmail },
    });
    fireEvent.change(passwordInput, { target: { value: testUser.password } });
    const header = screen.getByRole("heading");
    const form = header.parentElement;
    expect(form).toBeInTheDocument();
    fireEvent.submit(form as HTMLFormElement);

    expect(loginMock).toHaveBeenCalledOnce();
    expect(loginMock).toHaveBeenCalledWith({
      nameOrEmail: testUser.nameOrEmail,
      password: testUser.password,
    } as ILogin);
  });
});
