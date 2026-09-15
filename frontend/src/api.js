const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function getSessionUser() {
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !user?.role) return null;
  return user;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/${path.replace(/^\/+/, "")}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}
