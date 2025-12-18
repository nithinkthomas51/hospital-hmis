import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";

const STAFF_BASE_URL = `${API_BASE_URL}${API_ENDPOINTS.ADMIN_STAFF}`;

async function request(url, options = {}) {
  console.log(`URL in request API: ${url}`);
  const res = await fetch(url, options);
  const contentType = res.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export function listStaff(token, onlyActive = true) {
  const url = new URL(STAFF_BASE_URL);
  url.searchParams.set("onlyActive", onlyActive);
  console.log(url.toString());
  return request(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createStaff(token, payload) {
  return request(STAFF_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateStaff(token, staffId, payload) {
  return request(`${STAFF_BASE_URL}/${staffId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deactivateStaff(token, staffId) {
  return request(`${STAFF_BASE_URL}/${staffId}/deactivate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function activateStaff(token, staffId) {
  return request(`${STAFF_BASE_URL}/${staffId}/activate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
