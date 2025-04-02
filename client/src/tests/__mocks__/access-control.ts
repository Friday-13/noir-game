import { vi } from "vitest";
import * as accessControlHooks from "@/hooks/access-control";

export function mockUseOnlyUnauthorized() {
  const useOnlyUnauthorizedMock = vi.fn();
  vi.spyOn(accessControlHooks, "useOnlyUnauthorized").mockImplementation(
    useOnlyUnauthorizedMock,
  );
  return useOnlyUnauthorizedMock;
}
