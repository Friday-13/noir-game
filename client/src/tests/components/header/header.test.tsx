import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import Header from "@/components/header/header";
import { MemoryRouter } from "react-router-dom";

describe("Header component", () => {
  const renderHeader = (initialLocation: string = "/") => {
    render(
      <MemoryRouter initialEntries={[`${initialLocation}`]}>
        <Header />
      </MemoryRouter>,
    );
  };
  it("should render correctly with initial value", () => {
    renderHeader();
    const header = screen.getByText("The Noir Game");
    expect(header).toBeInTheDocument();
  });
  it("show fold button on '/game' page", () => {
    renderHeader("/game");
    const foldButton = screen.getByAltText("fold-menu");
    expect(foldButton).toBeInTheDocument();
  });
  it("show menu on '/game' page", () => {
    renderHeader("/game");
    const menuOption = screen.getByText("Menu");
    expect(menuOption).toBeInTheDocument();
  });
});
