// src/lib/ApiError.ts
export class ApiError extends Error {
  public code: number;
  public fields?: Record<string, string[]>;

  constructor(message: string, code = 500, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.fields = fields;
  }
}
