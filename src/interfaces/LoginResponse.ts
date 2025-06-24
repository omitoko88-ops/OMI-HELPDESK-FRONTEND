import { Meta } from "./Meta";
import { User } from "./User";

export interface LoginResponse {
  meta: Meta;
  data: {
    access_token: string;
    user: User;
    token_type: string;
  };
}
