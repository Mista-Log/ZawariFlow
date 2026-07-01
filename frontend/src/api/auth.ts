import { apiRequest } from "./client";

export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export async function signup(data: SignupPayload) {
  return apiRequest("/api/auth/signup/", {
    method: "POST",
    body: data,
  });
}

export const signin = async (data: SigninPayload) => {
  return apiRequest("/api/auth/signin/", {
    method: "POST",
    body: data,
  });
}