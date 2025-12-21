import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { request } from "./requestUtil";

const RECEPTION_VISITS = `${API_BASE_URL}${API_ENDPOINTS.RECEPTION_VISITS}`;

export function fetchReceptionQueue(token, params = {}) {
  const url = new URL(RECEPTION_VISITS);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") {
      url.searchParams.set(k, v);
    }
  });

  return request(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function checkInVisit(token, payload) {
  return request(RECEPTION_VISITS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function cancelVisit(token, id) {
  return request(`${RECEPTION_VISITS}/${id}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}
