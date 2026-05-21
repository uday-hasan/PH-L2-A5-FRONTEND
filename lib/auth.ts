import { api } from "./fetcher";
import type { User } from "@/types";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterInput) => api.post<User>("/auth/register", data),

  login: (data: LoginInput) => api.post<User>("/auth/login", data),

  logout: () => api.post<null>("/auth/logout", {}),

  getMe: () => api.get<User>("/auth/me"),
};
