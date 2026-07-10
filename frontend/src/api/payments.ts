import { apiRequest } from "./client";


export interface VirtualAccountPayload {
  supplier: string;
  expected_amount: number;
  expiry_date: string;
}

export interface VirtualAccount {
  id: string;
  supplier: string;
  company: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  provider: string;
  provider_account_id: string;
  account_reference: string;
  bank_account_name: string;
  account_holder_id: string;
  currency: string;
  status: string;
  expires_at: string;
  is_expired: boolean;
  created_at: string;
}

export const createVirtualAccount = (
  data: VirtualAccountPayload
) => {
  return apiRequest("/api/payments/virtual-accounts/create/", {
    method: "POST",
    body: data,
  });
};

export const getVirtualAccounts = () => {
  return apiRequest("/api/payments/virtual-accounts/", {
    method: "GET",
  });
};