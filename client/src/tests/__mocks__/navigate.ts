import { useNavigate } from "react-router-dom";
import { vi } from "vitest";

export const mockNavigate = () => {
  vi.mock(import("react-router-dom"), async (importOriginal) => {
    const mod = await importOriginal();
    return {
      ...mod,
      useNavigate: vi.fn(),
    };
  });
  const useNavigateMock = vi.mocked(useNavigate);
  const navigateMock = vi.fn();
  useNavigateMock.mockReturnValue(navigateMock);
  return navigateMock;
};
