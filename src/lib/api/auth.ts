import { apiPost } from "./client";
import {
  UserSchema,
  SignupSchema,
  LoginSchema,
  User,
  SignupData,
  LoginData,
} from "@/schemas/user";

/**
 * new user signup
 */
export async function signup(data: SignupData): Promise<User> {
  // validate data client side
  const validatedData = SignupSchema.parse(data);

  return apiPost<User>("/user/signup", validatedData, UserSchema);
}

/**
 * user login
 */
export async function login(data: LoginData): Promise<User> {
  // validate data client side
  const validatedData = LoginSchema.parse(data);

  return apiPost<User>("/user/login", validatedData, UserSchema);
}
