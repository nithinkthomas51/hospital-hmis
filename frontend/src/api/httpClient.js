const API_BASE_URL = "http://localhost:8080";

export async function getHealth() {
  const uri = `${API_BASE_URL}/api/health`;
  console.log(uri);
  const res = await fetch(uri);
  if (!res.ok) {
    throw new Error("Failed to reach backend");
  }
  return res.text();
}
