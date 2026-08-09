const API_BASE = import.meta.env.VITE_ERPNEXT_API_URL || "http://localhost:8000";
const API_KEY = import.meta.env.VITE_ERPNEXT_API_KEY || "";
const API_SECRET = import.meta.env.VITE_ERPNEXT_API_SECRET || "";
const DOCTYPE = "Inventory Item";

function authHeaders(extra = {}) {
  const headers = { ...extra };
  if (API_KEY && API_SECRET) {
    headers["Authorization"] = `token ${API_KEY}:${API_SECRET}`;
  }
  return headers;
}

async function handle(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body?.exception || body?.message || message;
    } catch (_) {
      /* ignore body parse errors */
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

const FIELDS = JSON.stringify([
  "name",
  "item_name",
  "description",
  "image",
  "tags",
  "date_added",
]);

/**
 * List inventory items with optional search / tag filter / sort.
 * @param {{search?: string, tag?: string, sortField?: 'item_name'|'date_added', sortOrder?: 'asc'|'desc'}} opts
 */
export async function listItems(opts = {}) {
  const { search = "", tag = "", sortField = "date_added", sortOrder = "desc" } = opts;

  const params = new URLSearchParams();
  params.set("fields", FIELDS);
  params.set("limit_page_length", "0");
  params.set("order_by", `${sortField} ${sortOrder}`);

  if (search) {
    params.set(
      "or_filters",
      JSON.stringify([
        ["item_name", "like", `%${search}%`],
        ["description", "like", `%${search}%`],
      ])
    );
  }

  if (tag) {
    params.set("filters", JSON.stringify([["tags", "like", `%${tag}%`]]));
  }

  const res = await fetch(`${API_BASE}/api/resource/${encodeURIComponent(DOCTYPE)}?${params}`, {
    headers: authHeaders(),
    credentials: "include",
  });
  const data = await handle(res);
  return data.data || [];
}

export async function getItem(name) {
  const res = await fetch(
    `${API_BASE}/api/resource/${encodeURIComponent(DOCTYPE)}/${encodeURIComponent(name)}`,
    { headers: authHeaders(), credentials: "include" }
  );
  const data = await handle(res);
  return data.data;
}

export async function createItem(payload) {
  const res = await fetch(`${API_BASE}/api/resource/${encodeURIComponent(DOCTYPE)}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await handle(res);
  return data.data;
}

export async function updateItem(name, payload) {
  const res = await fetch(
    `${API_BASE}/api/resource/${encodeURIComponent(DOCTYPE)}/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );
  const data = await handle(res);
  return data.data;
}

export async function deleteItem(name) {
  const res = await fetch(
    `${API_BASE}/api/resource/${encodeURIComponent(DOCTYPE)}/${encodeURIComponent(name)}`,
    { method: "DELETE", headers: authHeaders(), credentials: "include" }
  );
  await handle(res);
}

/**
 * Upload an image file and attach it to the given Inventory Item document.
 * Returns the file_url to store in the item's `image` field.
 */
export async function uploadImage(file, docname) {
  const form = new FormData();
  form.append("file", file);
  form.append("doctype", DOCTYPE);
  form.append("docname", docname || "");
  form.append("is_private", "0");

  const res = await fetch(`${API_BASE}/api/method/upload_file`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: form,
  });
  const data = await handle(res);
  return data.message?.file_url;
}

export function resolveImageUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}
