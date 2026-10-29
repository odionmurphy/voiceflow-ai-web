const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const TOKEN_KEY = "voiceflow_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const payload =
      typeof data === "object" && data !== null
        ? (data as { error?: unknown })
        : null;
    const error = payload?.error;
    let message = `Request failed (${res.status})`;
    if (typeof error === "string") {
      message = error;
    } else if (typeof error === "object" && error !== null) {
      const formErrors = (error as { formErrors?: unknown }).formErrors;
      message = Array.isArray(formErrors)
        ? formErrors.filter((item): item is string => typeof item === "string").join(", ")
        : JSON.stringify(error);
    }
    throw new ApiError(message, res.status);
  }

  return data as T;
}
