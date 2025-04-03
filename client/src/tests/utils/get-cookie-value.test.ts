import getCookieValue from "@utils/get-cookie-value";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("get cookie value", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockCookieValue = (value: string) => {
    vi.spyOn(document, "cookie", "get").mockReturnValue(value);
  };

  it("empty cookie return null", () => {
    mockCookieValue("");
    expect(getCookieValue("test cookie name")).toBeNull();
  });

  it("get correct value from cookie", () => {
    mockCookieValue("session_id=abc123xyz; user_token=def456uvw; theme=dark");
    expect(getCookieValue("user_token")).toBe("def456uvw");
  });
});
