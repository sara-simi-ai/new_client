
import { apiFetch } from "../context/ApiContext";

const RESOURCE = "tsevetmevatsea";

export async function insertTsevetMevatsea(tsevetMevatsea) {
  const response = await apiFetch(`/${RESOURCE}/insertTsevetMevatsea`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tsevetMevatsea),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create tsevet mevatsea.");
  }

  return response.json();
}

export async function updateTsevetMevatsea(id, tsevetMevatsea) {
  if (!id) {
    throw new Error("Tsevet Mevatsea ID must not be empty.");
  }

  // Fixed: route previously had a typo ("updateTsevetMevatseaea") that did not
  // match TsevetMevatseaController's "updateTsevetMevatsea/{id:guid}" route.
  const response = await apiFetch(`/${RESOURCE}/updateTsevetMevatsea/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tsevetMevatsea),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update tsevet mevatsea.");
  }

  return response.json();
}

export async function getTsevetMevatseaById(id) {
  if (!id || !id.toString().trim()) {
    throw new Error("Tsevet Mevatsea ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/getTsevetMevatseaById/${encodeURIComponent(id)}`);

  if (response.status === 404) {
    throw new Error(`Tsevet Mevatsea with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    throw new Error("An unexpected error occurred.");
  }

  return response.json();
}

export async function getAllTsevetMevatsea() {
  const response = await apiFetch(`/${RESOURCE}/getAllTsevetMevatsea`);

  if (response.status === 404) {
    throw new Error("No tsevet mevatsea entries were found.");
  }

  if (!response.ok) {
    throw new Error("An unexpected error occurred.");
  }

  return response.json();
}

// NOTE: There is no DELETE endpoint on TsevetMevatseaController, so
// deleteTsevetMevatsea() was removed — calling it would always 404.
// Use toggleTsevetMevatseaActive() to deactivate a team instead of deleting it.

export async function toggleTsevetMevatseaActive(id) {
  if (!id) {
    throw new Error("Tsevet Mevatsea ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/toggleTsevetMevatseaActive/${encodeURIComponent(id)}`, {
    method: "PATCH",
  });

  if (response.status === 404) {
    throw new Error(`Tsevet Mevatsea with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to toggle tsevet mevatsea active status.");
  }

  return response.json();
}



