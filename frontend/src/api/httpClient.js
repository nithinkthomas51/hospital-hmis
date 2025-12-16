import { API_BASE_URL } from "../constants/api";
import { STORAGE_KEYS } from "../constants/storage";
function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error(`GET ${path} failed`);
  }
  return res.json();
}

// export async function getHealth() {
//   const uri = `${API_BASE_URL}/api/health`;
//   console.log(uri);
//   const res = await fetch(uri);
//   if (!res.ok) {
//     throw new Error("Failed to reach backend");
//   }
//   return res.text();
// }
