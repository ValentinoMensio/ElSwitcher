import { describe, it, expect, beforeEach } from "vitest";
import handleRequest, { axiosClient } from "./httpClient";
import MockAdapter from "axios-mock-adapter";
import { ResponseModel } from "./types";

let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(axiosClient);
});

describe("handleRequest", () => {
  it("should handle GET request successfully", async () => {
    const data: ResponseModel = { roomID: 1 };
    mock.onGet("/test").reply(200, data);

    const result = await handleRequest("GET", null, "/test", 200);
    expect(result).toEqual(data);
  });

  it("should handle POST request successfully", async () => {
    const data: ResponseModel = { roomID: 1 };
    mock.onPost("/test").reply(200, data);

    const result = await handleRequest("POST", { roomID: 1 }, "/test", 200);
    expect(result).toEqual(data);
  });

  it("should handle PUT request successfully", async () => {
    const data: ResponseModel = { roomID: 1 };
    mock.onPut("/test").reply(200, data);

    const result = await handleRequest("PUT", { roomID: 1 }, "/test", 200);
    expect(result).toEqual(data);
  });

  it("should handle DELETE request successfully", async () => {
    const data: ResponseModel = { roomID: 1 };
    mock.onDelete("/test").reply(200, data);

    const result = await handleRequest("DELETE", null, "/test", 200);
    expect(result).toEqual(data);
  });

  it("should handle GET request with unexpected status", async () => {
    mock.onGet("/test").reply(404);

    try {
      await handleRequest("GET", null, "/test", 200);
    } catch (error) {
      expect((error as Error).message).toBe("Unexpected status code: 404");
    }
  });

  it("should handle POST request with unexpected status", async () => {
    mock.onPost("/test").reply(404);

    try {
      await handleRequest("POST", { roomID: 1 }, "/test", 200);
    } catch (error) {
      expect((error as Error).message).toBe("Unexpected status code: 404");
    }
  });

  it("should handle PUT request with unexpected status", async () => {
    mock.onPut("/test").reply(404);

    try {
      await handleRequest("PUT", { roomID: 1 }, "/test", 200);
    } catch (error) {
      expect((error as Error).message).toBe("Unexpected status code: 404");
    }
  });

  it("should handle DELETE request with unexpected status", async () => {
    mock.onDelete("/test").reply(404);

    try {
      await handleRequest("DELETE", null, "/test", 200);
    } catch (error) {
      expect((error as Error).message).toBe("Unexpected status code: 404");
    }
  });

  it("should handle GET request with network error", async () => {
    mock.onGet("/test").networkError();

    const result = await handleRequest("GET", null, "/test", 200);
    expect(result).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      detail: [{ type: "unknown", msg: expect.any(String) }],
    });
  });

  it("should handle POST request with network error", async () => {
    mock.onPost("/test").networkError();

    const result = await handleRequest("POST", { roomID: 1 }, "/test", 200);
    expect(result).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      detail: [{ type: "unknown", msg: expect.any(String) }],
    });
  });

  it("should handle PUT request with network error", async () => {
    mock.onPut("/test").networkError();

    const result = await handleRequest("PUT", { roomID: 1 }, "/test", 200);
    expect(result).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      detail: [{ type: "unknown", msg: expect.any(String) }],
    });
  });

  it("should handle DELETE request with network error", async () => {
    mock.onDelete("/test").networkError();

    const result = await handleRequest("DELETE", null, "/test", 200);
    expect(result).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      detail: [{ type: "unknown", msg: expect.any(String) }],
    });
  });
});