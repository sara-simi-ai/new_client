import { apiFetch } from "../context/ApiContext";

const RESOURCE = "agaff";

export async function insertAgaff(agaff) {
  const response = await apiFetch(`/${RESOURCE}/insertAgaff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agaff),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create agaff.");
  }

  return response.json();
}

export async function updateAgaff(id, agaff) {
  if (!id) {
    throw new Error("Agaff ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/updateAgaff/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agaff),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update agaff.");
  }

  return response.json();
}

export async function getAgaffById(id) {
  if (!id || !id.toString().trim()) {
    throw new Error("Agaff ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/getAgaffById/${encodeURIComponent(id)}`);

  if (response.status === 404) {
    throw new Error(`Agaff with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    throw new Error("An unexpected error occurred.");
  }

  return response.json();
}

export async function getAllAgaff() {
  const response = await apiFetch(`/${RESOURCE}/getAllAgaff`);

  if (response.status === 404) {
    throw new Error("No agaff entries were found.");
  }

  if (!response.ok) {
    throw new Error("An unexpected error occurred.");
  }

  return response.json();
}

export async function toggleAgaffActive(id) {
  if (!id) {
    throw new Error("Agaff ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/toggleAgaffActive/${encodeURIComponent(id)}`, {
    method: "PATCH",
  });

  if (response.status === 404) {
    throw new Error(`Agaff with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to toggle agaff active status.");
  }

  return response.json();
}