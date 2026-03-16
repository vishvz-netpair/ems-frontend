const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown
): Promise<T> {
  const token = localStorage.getItem("token");
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
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
  } catch {
    throw new Error("Unable to connect to the server");
  }

  const raw = await res.text();
  let data: unknown = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: unknown }).message || "Something went wrong")
        : "Something went wrong";

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    throw new Error(msg);
  }

  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: T }).data;
  }

  return data as T;
}

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};
