const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown
): Promise<T> {
  const token = localStorage.getItem("token");
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body
      ? {
          body: isFormData ? (body as FormData) : JSON.stringify(body),
        }
      : {}),
  });

  const data = await res.json();

  if (!res.ok) {
  const msg = data?.message || "Something went wrong";

 if (res.status === 401) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}

  throw new Error(msg);
}

  return data.data ?? data;
}
export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};
