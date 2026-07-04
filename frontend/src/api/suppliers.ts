// api/suppliers.ts

import { apiRequest } from "./client";

export interface SupplierPayload {
  name: string;
  category: string;
  country: string;
  account_number: string;
  transaction_volume: string;
  bank_name: string;
  status: string;
  email: string;
  phone_number: string;
  address: string;
}

export const createSupplier = async (
  data: SupplierPayload
) => {
  return apiRequest("/api/suppliers/", {
    method: "POST",
    body: data,
  });
};

export const getSuppliers = async () => {
  return apiRequest("/api/suppliers/", {
    method: "GET",
  });
};