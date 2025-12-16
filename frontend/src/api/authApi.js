import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";

export async function loginRequest(username, password) {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let message = "Login failed";
    try {
      const data = await res.json();
      if (data && data.message) {
        message = data.message;
      }
    } catch (e) {
      console.log("Parsing failed: ", e);
    }
    throw new Error(message);
  }

  const data = await res.json();
  return data;
}
