const BASE_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
  body?: any;
}

export async function apiRequest(
  endpoint: string,
  options: RequestOptions = {}
) {
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}