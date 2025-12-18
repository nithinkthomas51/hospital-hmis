import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { request } from "./requestUtil";

const SCHEDULE_BASE_URL = `${API_BASE_URL}${API_ENDPOINTS.SHIFT_SCHEDULE}`;

export function listSchedules(token, onlyActive = true) {
  const url = new URL(SCHEDULE_BASE_URL);
  url.searchParams.set("onlyActive", String(onlyActive));
  return request(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createSchedule(token, payload) {
  return request(SCHEDULE_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateSchedule(token, scheduleId, payload) {
  return request(`${SCHEDULE_BASE_URL}/${scheduleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deactivateSchedule(token, scheduleId) {
  return request(`${SCHEDULE_BASE_URL}/${scheduleId}/deactivate`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function activateSchedule(token, scheduleId) {
  return request(`${SCHEDULE_BASE_URL}/${scheduleId}/activate`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}
