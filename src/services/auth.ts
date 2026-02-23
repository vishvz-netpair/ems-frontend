type JwtPayload = {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
};

function base64UrlDecode(input: string) {
  // JWT uses base64url
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = base64 + (pad ? "=".repeat(4 - pad) : "");
  return atob(padded);
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = base64UrlDecode(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function saveSession(params: { username: string; token: string }) {
  const payload = decodeJwt(params.token);
  if (!payload) throw new Error("Invalid token");

  const user = {
    name: params.username, // backend login only returns token; we show username in header
    username: params.username,
    token: params.token,
    id: payload.id,
    role: payload.role
  };

  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export function getSession() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("user");
}