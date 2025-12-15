const API_BASE_URL = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
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
