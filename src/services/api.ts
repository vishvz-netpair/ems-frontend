//const API_URL = import.meta.env.API_URL;
const API_URL = "http://localhost:5000";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function getToken() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    return user?.token ?? null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  method: HttpMethod,
  body?: unknown
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "object" && data?.message ? data.message : "Request failed";
    throw new Error(message);
  }

  return data as T;
}