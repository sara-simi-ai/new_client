import { useCallback, useMemo, useState, useEffect } from 'react';
import { useAgaff } from '../../../services/context/AgaffContext';

/**
 * Hook for managing Agaff list with ManagementOptionsPage integration
 */
export function useAgaffManagement() {
  const {
    filteredAgaff,
    isLoading: contextLoading,
    addNewAgaff,
    updateAgaffData,
    deleteAgaffData,
    toggleAgaffStatus,
    updateFilter,
    filters,
  } = useAgaff();

  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [pendingName, setPendingName] = useState('');
  const [modalError, setModalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Convert agaff items to management options format
  const options = useMemo(() => {
    return (filteredAgaff || []).map((agaff) => ({
      value: agaff.id,
      label: agaff.name || '—',
      active: agaff.active !== false,
    }));
  }, [filteredAgaff]);

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
    if ((filteredAgaff || []).some((a) => a.name === clean)) {
      setModalError('אגף עם השם הזה כבר קיים');
      return;
    }

    setIsLoading(true);
    try {
      await addNewAgaff({ name: clean, description: '' });
      closeAddModal();
    } catch (err) {
      setModalError(err.message || 'Failed to create agaff');
    } finally {
      setIsLoading(false);
    }
  }, [pendingName, filteredAgaff, addNewAgaff, closeAddModal]);

  const confirmEdit = useCallback(async () => {
    const clean = (pendingName || '').trim();
    if (!clean || !editItem) return;

    // Check for duplicate names (excluding current)
    if ((filteredAgaff || []).some((a) => a.name === clean && a.id !== editItem.value)) {
      setModalError('אגף עם השם הזה כבר קיים');
      return;
    }

    setIsLoading(true);
    try {
      await updateAgaffData({ id: editItem.value, name: clean });
      closeEditModal();
    } catch (err) {
      setModalError(err.message || 'Failed to update agaff');
    } finally {
      setIsLoading(false);
    }
  }, [pendingName, editItem, filteredAgaff, updateAgaffData, closeEditModal]);

  const confirmDelete = useCallback(async () => {
    if (!deleteItem) return;

    setIsLoading(true);
    try {
      await deleteAgaffData(deleteItem.value);
      closeDeleteModal();
    } catch (err) {
      setModalError(err.message || 'Failed to delete agaff');
    } finally {
      setIsLoading(false);
    }
  }, [deleteItem, deleteAgaffData, closeDeleteModal]);

  const handleToggleActive = useCallback(async (option) => {
    try {
      await toggleAgaffStatus(option.value);
    } catch (err) {
      console.error('Failed to toggle agaff active status:', err);
    }
  }, [toggleAgaffStatus]);

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
