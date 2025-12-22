import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { request } from "./requestUtil";

const BASE = `${API_BASE_URL}${API_ENDPOINTS.CLINICAL_VISIT}`;

export function listVitals(token, visitId) {
  return request(`${BASE}/${visitId}/vitals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createVitals(token, visitId, payload) {
  return request(`${BASE}/${visitId}/vitals`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
