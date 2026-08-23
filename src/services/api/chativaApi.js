import { apiFetch } from "../context/ApiContext";

const RESOURCE = "chativa";

export async function insertChativa(chativa) {
  const response = await apiFetch(`/${RESOURCE}/insertChativa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chativa),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create chativa.");
  }

  return response.json();
}

export async function updateChativa(id, chativa) {
  if (!id) {
    throw new Error("Chativa ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/updateChativa/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chativa),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update chativa.");
  }

  return response.json();
}

export async function getChativaById(id) {
  if (!id || !id.toString().trim()) {
    throw new Error("Chativa ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/getChativaById/${encodeURIComponent(id)}`);

  if (response.status === 404) {
    throw new Error(`Chativa with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    throw new Error("An unexpected error occurred.");
  }

  return response.json();
}

export async function getAllChativa() {
  const response = await apiFetch(`/${RESOURCE}/getAllChativa`);

  if (response.status === 404) {
    throw new Error("No chativa entries were found.");
  }

  if (!response.ok) {
    throw new Error("An unexpected error occurred.");
  }

  return response.json();
}

export async function toggleChativaActive(id) {
  if (!id) {
    throw new Error("Chativa ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/toggleChativaActive/${encodeURIComponent(id)}`, {
    method: "PATCH",
  });

  if (response.status === 404) {
    throw new Error(`Chativa with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to toggle chativa active status.");
  }

  return response.json();
}
