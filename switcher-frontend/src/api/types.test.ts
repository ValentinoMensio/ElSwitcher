import { describe, it, expect } from "vitest";
import { isError, ErrorType, Response } from "./types";

describe("isError", () => {
  it("should return true for ErrorType with detail as array", () => {
    const error: ErrorType = {
      detail: [{ type: "type1", msg: "message1" }]
    };
    expect(isError(error)).toBe(true);
  });

  it("should return true for ErrorType with detail as string", () => {
    const error: ErrorType = {
      detail: "An error occurred"
    };
    expect(isError(error)).toBe(true);
  });

  it("should return false for non-object values", () => {
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError(123)).toBe(false);
    expect(isError("string")).toBe(false);
  });

  it("should return false for object without detail property", () => {
    const obj = { type: "type1", msg: "message1" };
    expect(isError(obj)).toBe(false);
  });

  it("should return false for object with detail property of incorrect type", () => {
    const obj = { detail: 123 };
    expect(isError(obj)).toBe(false);
  });
});

describe("Response", () => {
  it("should create a Response with status and data as ResponseModel", () => {
    const response: Response = {
      status: 200,
      data: { roomID: 1 }
    };
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ roomID: 1 });
  });

  it("should create a Response with status and data as ErrorType", () => {
    const error: ErrorType = {
      detail: "An error occurred"
    };
    const response: Response = {
      status: 400,
      data: error
    };
    expect(response.status).toBe(400);
    expect(response.data).toEqual(error);
  });
});