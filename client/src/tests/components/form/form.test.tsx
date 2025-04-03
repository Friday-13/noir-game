import Form from "@components/form/form";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Form component", () => {
  it("render", () => {
    render(<Form data-testid="test-form" />);
    const form = screen.getByTestId("test-form");
    expect(form).toBeInTheDocument();
  });
  it("render with correct props", () => {
    const onSubmitMock = vi.fn();
    render(
      <Form
        className="test_class__name"
        onSubmit={onSubmitMock}
        data-testid="test-form"
      />,
    );
    const form = screen.getByTestId("test-form") as HTMLFormElement;
    fireEvent.submit(form);
    expect(form).toBeInTheDocument();
    expect(onSubmitMock).toHaveBeenCalledOnce();
    expect(form).toHaveClass("test_class__name");
  });
});
