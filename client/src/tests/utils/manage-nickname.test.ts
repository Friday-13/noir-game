import {
  getNameOrEmail,
  removeNameOrEmail,
  saveNameOrEmail,
} from "@/utils/manage-nickname";
import { describe, expect, it } from "vitest";

describe("Managing nickname or email in local storage", () => {
  const testName = "test name";
  it("Should save name or email in locale storage", () => {
    saveNameOrEmail(testName);
    expect(testName in localStorage);
  });

  it("Should return saved name or email", () => {
    const value = getNameOrEmail();
    expect(testName === value);
  });

  it("Should return remove saved name or email", () => {
    removeNameOrEmail();
    const value = getNameOrEmail();
    expect(value === null);
  });
});
