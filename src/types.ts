export type HttpException = {
  status: number;
  message: string;
};

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_verified: boolean;
}

export type PublicUser = Pick<
  User,
  "id" | "first_name" | "last_name" | "email" | "phone_number" | "is_verified"
>;
