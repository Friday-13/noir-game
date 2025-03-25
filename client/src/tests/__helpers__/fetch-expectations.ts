import { expect } from "vitest";

export const expectFetchMethod = (method?: string) => {
  expect(global.fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      method: method,
    }),
  );
};

export const expectFetchContainHeader = (
  header: string,
  value: string = expect.any(String),
) => {
  expect(global.fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      headers: expect.objectContaining({
        [header]: value,
      }),
    }),
  );
};

export const expectFetchContainCredentials = () => {
  expect(global.fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      credentials: "include",
    }),
  );
};
