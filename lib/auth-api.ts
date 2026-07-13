import { apiFetch, setToken, clearToken } from "./api";
import { User } from "./types";

export async function login(email: string, password: string) {
  const data = await apiFetch<{ user: User; token: string }>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  setToken(data.token);
  return data.user;
}

export async function register(email: string, password: string, fullName: string) {
  const data = await apiFetch<{ user: User; token: string }>("/auth/register", {
    method: "POST",
    body: { email, password, fullName },
    auth: false,
  });
  setToken(data.token);
  return data.user;
}

export async function fetchMe() {
  const data = await apiFetch<{ user: User }>("/auth/me");
  return data.user;
}

export function logout() {
  clearToken();
}
