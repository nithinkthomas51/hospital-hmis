export async function request(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
