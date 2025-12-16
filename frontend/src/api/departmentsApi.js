import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { STORAGE_KEYS } from "../constants/storage";

function authHeader() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listDepartments(onlyActive = true) {
  const res = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.ADMIN_DEPARTMENTS}?onlyActive=${onlyActive}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    }
  );
  if (!res.ok) throw new Error("Failed to load departments");
  return res.json();
}

export async function createDepartment(name, description) {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_DEPARTMENTS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ name, description }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to create department");
  }
  return res.json();
}

export async function updateDepartment(id, payload) {
  const res = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.ADMIN_DEPARTMENTS}/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deactivateDepartment(id) {
  const res = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.ADMIN_DEPARTMENTS}/${id}/deactivate`,
    {
      method: "PATCH",
      headers: {
        ...authHeader(),
      },
    }
  );
  if (!res.ok) throw new Error("Failed to deactivate department");
}
