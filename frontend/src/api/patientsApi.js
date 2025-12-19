import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { request } from "./requestUtil";

const RECEPTION_BASE = `${API_BASE_URL}${API_ENDPOINTS.RECEPTION_PATIENTS}`;
const LOOKUP_BASE = `${API_BASE_URL}${API_ENDPOINTS.PATIENTS}`;

export function searchPatients(token, query = "", onlyActive = true) {
  const url = new URL(`${LOOKUP_BASE}/search`);
  if (query && query.trim()) url.searchParams.set("query", query.trim());
  if (onlyActive !== null && onlyActive !== undefined) {
    url.searchParams.set("onlyActive", String(onlyActive));
  }
  return request(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createPatient(token, payload) {
  return request(RECEPTION_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updatePatient(token, id, payload) {
  return request(`${RECEPTION_BASE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deactivatePatient(token, id) {
  return request(`${RECEPTION_BASE}/${id}/deactivate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function activatePatient(token, id) {
  return request(`${RECEPTION_BASE}/${id}/activate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
