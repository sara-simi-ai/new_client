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

  const response = await apiFetch(`/${RESOURCE}/updateTsevetMevatseaea/${encodeURIComponent(id)}`, {
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

export async function deleteTsevetMevatsea(id) {
  if (!id) {
    throw new Error("Tsevet Mevatsea ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/deleteTsevetMevatsea/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (response.status === 404) {
    throw new Error(`Tsevet Mevatsea with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete tsevet mevatsea.");
  }

  return response.json();
}
