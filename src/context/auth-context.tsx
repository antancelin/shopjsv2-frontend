"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { AuthContextType, AuthState, AuthAction, AuthUser } from "@/types/auth";
import { login as apiLogin, signup as apiSignup } from "@/lib/api/auth";

// initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// reducer to manage auth state
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case "LOAD_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  }
};

// context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // load user from local storage
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("auth_user");
        if (userData) {
          const user: AuthUser = JSON.parse(userData);
          dispatch({ type: "LOAD_USER", payload: user });
        } else {
          dispatch({ type: "LOAD_ERROR" });
        }
      } catch (error: unknown) {
        console.error("Error loading user from local storage:", error);
        dispatch({ type: "LOAD_ERROR" });
      }
    };
    loadUser();
  }, []);

  // login function
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const userData = await apiLogin({ email, password });

      // save user to local storage
      localStorage.setItem("auth_user", JSON.stringify(userData));

      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
    } catch (error: unknown) {
      console.error("Login error:", error);
      dispatch({ type: "LOGIN_ERROR" });
      throw error;
    }
  }, []);

  // signup function
  const signup = useCallback(
    async (username: string, email: string, password: string) => {
      dispatch({ type: "LOGIN_START" });

      try {
        const userData = await apiSignup({ username, email, password });

        // save user to local storage
        localStorage.setItem("auth_user", JSON.stringify(userData));

        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      } catch (error: unknown) {
        console.error("Signup error:", error);
        dispatch({ type: "LOGIN_ERROR" });
        throw error;
      }
    },
    []
  );

  // logout function
  const logout = useCallback(() => {
    // clear local storage
    localStorage.removeItem("auth_user");
    dispatch({ type: "LOGOUT" });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// personlized hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
