import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { request } from "./requestUtil";

const STAFF_BASE_URL = `${API_BASE_URL}${API_ENDPOINTS.ADMIN_STAFF}`;

export function listStaff(token, onlyActive = true) {
  const url = new URL(STAFF_BASE_URL);
  url.searchParams.set("onlyActive", onlyActive);
  console.log(url.toString());
  return request(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function listStaffLookup(token) {
  return request(`${API_BASE_URL}${API_ENDPOINTS.STAFF_LOOKUP}`, {
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
