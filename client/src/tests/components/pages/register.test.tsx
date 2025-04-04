import { IAuthState, IRegister, register } from "@/store/auth-slice";
import Register from "@components/pages/register";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  getTestRegisterData,
  getTestUnauthorizedAuthState,
} from "@tests/__helpers__/get-test-auth-state";
import { mockUseOnlyUnauthorized } from "@tests/__mocks__/access-control";
import { setStateMockValue } from "@tests/__mocks__/state";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

describe("Registration page", () => {
  const renderRegisterPage = () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
  };

  it("Render correctly", () => {
    const authState = getTestUnauthorizedAuthState();
    setStateMockValue({ auth: authState });
    renderRegisterPage();
    const header = screen.getByRole("heading");
    expect(header).toBeInTheDocument();

    const form = header.parentElement;
    expect(form).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("name");
    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");
    const submitInput = screen.getByRole("button");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitInput).toBeInTheDocument();
  });

  it("Access control implemeted", () => {
    const useOnlyUnauthorizedMock = mockUseOnlyUnauthorized();
    renderRegisterPage();
    expect(useOnlyUnauthorizedMock).toHaveBeenCalledOnce();
  });

  it("Try to register", () => {
    const authState = getTestUnauthorizedAuthState();
    const testUser = getTestRegisterData();
    setStateMockValue({ auth: authState });
    const registerMock = vi.mocked(register);
    renderRegisterPage();

    const nameInput = screen.getByPlaceholderText("name");
    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    fireEvent.change(nameInput, { target: { value: testUser.name } });
    fireEvent.change(emailInput, { target: { value: testUser.email } });
    fireEvent.change(passwordInput, { target: { value: testUser.password } });

    const header = screen.getByRole("heading");
    const form = header.parentElement;
    fireEvent.submit(form as HTMLFormElement);

    expect(registerMock).toHaveBeenCalledOnce();
    expect(registerMock).toHaveBeenCalledWith({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
    } as IRegister);
  });
});
