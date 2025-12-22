import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { request } from "./requestUtil";

const BASE = `${API_BASE_URL}${API_ENDPOINTS.DOCTOR_VISITS}`;

export function fetchDoctorVisits(token, params = {}) {
  const url = new URL(BASE);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") {
      url.searchParams.set(k, v);
    }
  });

  return request(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getDoctorVisitDetails(token, visitId) {
  return request(`${BASE}/${visitId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function completeVisit(token, visitId) {
  return request(`${BASE}/${visitId}/complete`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}
