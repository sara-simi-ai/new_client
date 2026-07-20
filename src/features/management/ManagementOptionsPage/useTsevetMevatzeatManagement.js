import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTsevetMevatzeat } from '../../../services/context/TsevetMevatzeatContext';

/**
 * Hook for managing Tsevet Mevatzeat list with ManagementOptionsPage integration
 */
export function useTsevetMevatzeatManagement() {
  const {
    filteredTsevetMevatzeat,
    isLoading: contextLoading,
    addNewTsevetMevatzeat,
    updateTsevetData,
    deleteTsevetData,
    updateFilter,
    filters,
  } = useTsevetMevatzeat();

  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [pendingName, setPendingName] = useState('');
  const [modalError, setModalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Convert tsevet mevatzeat items to management options format
  const options = useMemo(() => {
    return (filteredTsevetMevatzeat || []).map((tsevet) => ({
      value: tsevet.id,
      label: tsevet.name || '—',
      active: tsevet.active !== false,
    }));
  }, [filteredTsevetMevatzeat]);

  // Update search filter when search term changes
  useEffect(() => {
    updateFilter('search', searchTerm);
  }, [searchTerm, updateFilter]);

  const resetModalState = useCallback(() => {
    setPendingName('');
    setModalError('');
  }, []);

  const closeAddModal = useCallback(() => {
    setAddModalOpen(false);
    resetModalState();
  }, [resetModalState]);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setEditItem(null);
    resetModalState();
  }, [resetModalState]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteItem(null);
  }, []);

  const openAddModal = useCallback(() => {
    resetModalState();
    setAddModalOpen(true);
  }, [resetModalState]);

  const openEditModal = useCallback((option) => {
    setEditItem(option);
    setPendingName(option?.label || '');
    setModalError('');
    setEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((option) => {
    setDeleteItem(option);
    setDeleteModalOpen(true);
  }, []);

  const confirmAdd = useCallback(async () => {
    const clean = (pendingName || '').trim();
    if (!clean) return;

    // Check for duplicate names
    if ((filteredTsevetMevatzeat || []).some((t) => t.name === clean)) {
      setModalError('צוות עם השם הזה כבר קיים');
      return;
    }

    setIsLoading(true);
    try {
      await addNewTsevetMevatzeat({ name: clean, description: '' });
      closeAddModal();
    } catch (err) {
      setModalError(err.message || 'Failed to create tsevet mevatzeat');
    } finally {
      setIsLoading(false);
    }
  }, [pendingName, filteredTsevetMevatzeat, addNewTsevetMevatzeat, closeAddModal]);

  const confirmEdit = useCallback(async () => {
    const clean = (pendingName || '').trim();
    if (!clean || !editItem) return;

    // Check for duplicate names (excluding current)
    if ((filteredTsevetMevatzeat || []).some((t) => t.name === clean && t.id !== editItem.value)) {
      setModalError('צוות עם השם הזה כבר קיים');
      return;
    }

    setIsLoading(true);
    try {
      await updateTsevetData({ id: editItem.value, name: clean });
      closeEditModal();
    } catch (err) {
      setModalError(err.message || 'Failed to update tsevet mevatzeat');
    } finally {
      setIsLoading(false);
    }
  }, [pendingName, editItem, filteredTsevetMevatzeat, updateTsevetData, closeEditModal]);

  const confirmDelete = useCallback(async () => {
    if (!deleteItem) return;

    setIsLoading(true);
    try {
      await deleteTsevetData(deleteItem.value);
      closeDeleteModal();
    } catch (err) {
      setModalError(err.message || 'Failed to delete tsevet mevatzeat');
    } finally {
      setIsLoading(false);
    }
  }, [deleteItem, deleteTsevetData, closeDeleteModal]);

  const handleToggleActive = useCallback(async (option) => {
    // Note: TsevetMevatzeatContext doesn't have toggleTsevetMevatzeatActive, only updateTsevetData
    // We would need to implement this in the API/Context if needed
    console.warn('Toggle active not yet implemented for Tsevet Mevatzeat');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems: options,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    pendingName,
    setPendingName,
    modalError,
    editOption: editItem,
    deleteOption: deleteItem,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAddModal,
    closeEditModal,
    closeDeleteModal,
    confirmAdd,
    confirmEdit,
    confirmDelete,
    isLoading: isLoading || contextLoading,
    handleToggleActive,
  };
}
