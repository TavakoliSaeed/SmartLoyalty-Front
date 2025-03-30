import { FileEntity } from "./file-entity";
import { Role } from "./role";

export enum UserProviderEnum {
  EMAIL = "email",
  GOOGLE = "google",
}

export type User = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  owner_name: string;
  store_name: string;
  landline: string;
  mobile: string;
  province: number;
  city: number;
  address: string;
  postal_code: string;
  email: string;
  status: string;
  password: string;
  username: string;
  score: number;
};
