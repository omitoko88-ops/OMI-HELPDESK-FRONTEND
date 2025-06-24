import { Meta } from "./Meta";

export interface ApiResponse<T> {
  meta: Meta;
  data: T | null;
}
