import { IAuthState } from "@/store/auth-slice";
import Register from "@components/pages/register";
import { render, screen } from "@testing-library/react";
import { setStateMockValue } from "@tests/__mocks__/state";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

describe("Registration page", () => {
  const renderRegisterPage = () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  };

  it("Render correctly", () => {
    const authState: IAuthState = {
      user: null,
      error: null,
      isAuth: false,
    };
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
});
