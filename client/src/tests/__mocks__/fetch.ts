import { vi } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFetchMock = (response: { status?: number; json?: any }) => {
  return vi.fn(() =>
    Promise.resolve({
      ok: (response.status ?? 200) < 400,
      status: response.status ?? 200,
      json: () => Promise.resolve(response.json || {}),
    } as Response),
  );
};

export const getFetchWithRefreshMock = (status1: number, status2: number) => {
  return vi
    .fn()
    .mockResolvedValueOnce({ ok: status1 === 200, status: status1 })
    .mockResolvedValueOnce({ ok: status2 === 200, status: status2 });
};
