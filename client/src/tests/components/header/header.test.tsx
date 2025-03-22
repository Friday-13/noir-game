import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import Header from "@/components/header/header";
import { MemoryRouter } from "react-router-dom";

describe("Header component", () => {
  it("should render correctly with initial value", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const header = screen.getByText("The Noir Game");
    expect(header).toBeInTheDocument();
  });
});
