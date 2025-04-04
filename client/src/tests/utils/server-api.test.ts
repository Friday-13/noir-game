import {
  expectFetchContainCredentials,
  expectFetchContainHeader,
  expectFetchMethod,
} from "@tests/__helpers__/fetch-expectations";
import {
  getTestLoginData,
  getTestRegisterData,
} from "@tests/__helpers__/get-test-auth-state";
import { getFetchMock, getFetchWithRefreshMock } from "@tests/__mocks__/fetch";
import ServerApi from "@utils/server-api";
import { beforeEach, describe, expect, it, vi } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRefreshMock = (response: { status?: number; json?: any }) => {
  return vi.spyOn(ServerApi, "refresh").mockResolvedValue({
    ok: (response.status ?? 200) < 400,
    status: response.status ?? 200,
    json: () => Promise.resolve(response.json || {}),
  } as Response);
};

describe("login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Success login", async () => {
    const testUser = getTestLoginData();
    global.fetch = getFetchMock({ status: 200, json: { token: "mockToken" } });
    const response = await ServerApi.login(
      testUser.nameOrEmail,
      testUser.password,
    );
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  });
});

describe("logout ", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Correct logout method and headers", async () => {
    global.fetch = getFetchMock({ status: 200 });
    await ServerApi.logout();
    expectFetchMethod("POST");
    expectFetchContainHeader("x-csrf-token");
    expectFetchContainCredentials();
  });

  it("Success logout with refresh", async () => {
    const refreshMock = getRefreshMock({ status: 200, json: {} });
    global.fetch = getFetchWithRefreshMock(401, 200);
    await expect(ServerApi.logout()).resolves.not.toThrow();
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(refreshMock).toHaveBeenCalled();
  });

  it("Success logout without refresh", async () => {
    const refreshMock = getRefreshMock({ status: 200, json: {} });
    global.fetch = getFetchWithRefreshMock(200, 200);
    await expect(ServerApi.logout()).resolves.not.toThrow();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("Failed logout with refresh", async () => {
    const refreshMock = getRefreshMock({ status: 401, json: {} });
    global.fetch = getFetchMock({ status: 401, json: {} });
    await expect(ServerApi.logout()).rejects.toThrow("Unauthorized");
    expect(refreshMock).toHaveBeenCalled();
  });
});

describe("register", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Success register", async () => {
    const testUser = getTestRegisterData();
    global.fetch = getFetchMock({ status: 200, json: {} });
    const response = await ServerApi.register(
      testUser.name,
      testUser.email,
      testUser.password,
    );
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  });
});

describe("refresh", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Correct refresh method and headers", async () => {
    global.fetch = getFetchMock({ status: 200 });
    await ServerApi.refresh();
    expectFetchMethod("POST");
    expectFetchContainHeader("x-csrf-token");
    expectFetchContainCredentials();
  });

  it("Success refresh", async () => {
    global.fetch = getFetchMock({ status: 200, json: {} });
    const response = await ServerApi.refresh();
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  });
});

describe("protected", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Correct get protected method and headers", async () => {
    global.fetch = getFetchMock({ status: 200 });
    await ServerApi.getProtected();
    expectFetchMethod("GET");
    expectFetchContainHeader("x-csrf-token");
    expectFetchContainCredentials();
  });

  it("Success get protected", async () => {
    global.fetch = getFetchMock({ status: 200, json: {} });
    const response = await ServerApi.getProtected();
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  });
});
