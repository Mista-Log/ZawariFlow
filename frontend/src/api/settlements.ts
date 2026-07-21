import { apiRequest } from "./client";

export interface Settlement {
  id: string;
  purchase_order: string;
  supplier: string;
  amount: string;
  currency: string;
  status: string;
  created_at: string;
}

export const getSettlements = () => {
  return apiRequest("/api/payments/settlements/", {
    method: "GET",
  });
};

export const getSettlement = (id: string) => {
  return apiRequest(`/api/payments/settlements/${id}/`, {
    method: "GET",
  });
};

export const createSettlement = (data: {
  purchase_order: string;
  supplier: string;
  amount: number;
}) => {
  return apiRequest("/api/payments/settlements/create/", {
    method: "POST",
    body: data,
  });
};

export const processSettlement = (id: string) => {
  return apiRequest(
    `/api/payments/settlements/${id}/process/`,
    {
      method: "POST",
    }
  );
};