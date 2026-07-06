// api/suppliers.ts

import { apiRequest } from "./client";

export interface PurchaseItemPayload {
  name: string;
  quantity: number;
  unit: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface PurchaseOrderPayload {
  buyer: string;
  amount: number;
  currency: string;
  suppliers: string[];
  notes: string;
  items: PurchaseItemPayload[];
}

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






export const createPurchaseOrder = async (
  data: PurchaseOrderPayload
) => {
  return apiRequest("/api/suppliers/purchase-orders/create/", {
    method: "POST",
    body: data,
  });
};

export const getPurchaseOrders = async () => {
  return apiRequest("/api/suppliers/purchase-orders/", {
    method: "GET",
  });
};