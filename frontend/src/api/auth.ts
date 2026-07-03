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

export interface UpdateProfilePayload {
  role: string;

  company_name?: string;
  registration_number?: string;
  tax_identification_number?: string;
  industry?: string;
  country?: string;
  address?: string;
  phone_number?: string;
  website?: string;
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

export const getProfile = async () => {
  return apiRequest("/api/auth/profile/me", {
    method: "GET",
  });
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  return apiRequest("/api/auth/profile/", {
    method: "PATCH",
    body: data,
  });
};