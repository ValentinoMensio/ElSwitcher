import { Player } from "../types/playerTypes";
import { RoomID } from "../types/roomTypes";

export type ResponseModel = Player | RoomID;

export interface Response {
  status: number;
  data: ResponseModel | ErrorType;
}

export interface ErrorDetail {
  type: string;
  msg: string;
  input?: string;
}

export interface ErrorType {
  detail: ErrorDetail[]| string;
}

export function isError(obj: unknown): obj is ErrorType {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "detail" in obj &&
    (Array.isArray((obj as ErrorType).detail) || typeof (obj as ErrorType).detail === "string")
  );
}
