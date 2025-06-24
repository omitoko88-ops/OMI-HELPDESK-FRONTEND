export interface Meta {
  success: boolean;
  code: number;
  message: string | Record<string, string[]>;
}
