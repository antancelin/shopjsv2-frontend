import { User } from "@/schemas/user";

export type AuthUser = User;

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: AuthUser }
  | { type: "LOGIN_ERROR" }
  | { type: "LOGOUT" }
  | { type: "LOAD_USER"; payload: AuthUser }
  | { type: "LOAD_ERROR" };

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
