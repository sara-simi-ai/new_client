import { apiFetch } from "../context/ApiContext";

const RESOURCE = "machlaka";

export async function insertMachlaka(machlaka) {
  const response = await apiFetch(`/${RESOURCE}/insertMachlaka`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(machlaka),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create machlaka.");
  }

  return response.json();
}

export async function updateMachlaka(id, machlaka) {
  if (!id) {
    throw new Error("Machlaka ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/updateMachlaka/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(machlaka),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update machlaka.");
  }

  return response.json();
}

export async function getMachlakaById(id) {
  if (!id || !id.toString().trim()) {
    throw new Error("Machlaka ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/getMachlakaById/${encodeURIComponent(id)}`);

  if (response.status === 404) {
    throw new Error(`Machlaka with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    throw new Error("An unexpected error occurred.");
  }

  return response.json();
}

export async function getAllMachlaka() {
  const response = await apiFetch(`/${RESOURCE}/getAllMachlaka`);

  if (response.status === 404) {
    throw new Error("No machlaka entries were found.");
  }

  if (!response.ok) {
    throw new Error("An unexpected error occurred.");
  }

  return response.json();
}

export async function toggleMachlakaActive(id) {
  if (!id) {
    throw new Error("Machlaka ID must not be empty.");
  }

  const response = await apiFetch(`/${RESOURCE}/toggleMachlakaActive/${encodeURIComponent(id)}`, {
    method: "PATCH",
  });

  if (response.status === 404) {
    throw new Error(`Machlaka with ID '${id}' was not found.`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to toggle machlaka active status.");
  }

  return response.json();
}

export const insertTsevetMevatsea = insertMachlaka;
export const updateTsevetMevatsea = updateMachlaka;
export const getTsevetMevatseaById = getMachlakaById;
export const getAllTsevetMevatsea = getAllMachlaka;
export const toggleTsevetMevatseaActive = toggleMachlakaActive;

export const insertMachlakaLegacy = insertMachlaka;
export const updateMachlakaLegacy = updateMachlaka;
export const getMachlakaByIdLegacy = getMachlakaById;
export const getAllMachlakaLegacy = getAllMachlaka;
export const toggleMachlakaActiveLegacy = toggleMachlakaActive;