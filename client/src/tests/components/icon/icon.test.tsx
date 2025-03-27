import Icon from "@components/icon/icon";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Icon component", () => {
  it("Contain correct props", () => {
    render(
      <Icon
        className="test_class__name"
        src="test/src"
        alt="test-alt"
        size={30}
        data-testid="test-icon"
      />,
    );
    const icon = screen.getByTestId("test-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("test_class__name");
    expect(icon).toHaveStyle("width: 30px");
  });

  it("Contain child with correct props", () => {
    render(
      <Icon src="test/src" alt="test-alt" size={30} data-testid="test-icon" />,
    );
    const icon = screen.getByTestId("test-icon");
    const img = icon.firstChild as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src === "test/src");
    expect(img.alt === "test-alt");
  });
});
