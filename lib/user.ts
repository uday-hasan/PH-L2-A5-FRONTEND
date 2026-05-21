import { api } from "./fetcher";
import type { User } from "@/types";

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatar?: string;
  notifyEmail?: boolean;
}

export const userApi = {
  updateProfile: (data: UpdateProfileInput) =>
    api.patch<User>("/users/me", data),
};
