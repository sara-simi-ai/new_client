import { useCallback, useMemo, useState } from 'react';

/**
 * Hook for managing async CRUD operations on management list items
 * Converts between item model and UI option format {value, label, active}
 * @param {Function} getItems - Function that returns current items array
 * @param {Function} createItem - Async function(name) => item
 * @param {Function} updateItem - Async function(id, {name, ...rest}) => item
 * @param {Function} deleteItem - Async function(id) => void
 * @param {Function} toggleActive - Async function(id) => item
 * @param {Function} itemToOption - Function to convert item to {value, label, active}
 * @param {Function} optionToItem - Function to convert option back to item structure
 * @param {string} duplicateErrorMessage - Error message for duplicates
 * @param {string} allValue - Special "all" value to filter out
 */
export function useManagementListAsync({
  getItems,
  createItem,
  updateItem,
  deleteItem,
  toggleActive,
  itemToOption,
  optionToItem,
  duplicateErrorMessage = 'שם עם השם הזה כבר קיים',
  allValue = '__all__',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editOption, setEditOption] = useState(null);
  const [deleteOption, setDeleteOption] = useState(null);
  const [pendingName, setPendingName] = useState('');
  const [modalError, setModalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const options = useMemo(() => {
    const items = getItems();
    return (items || []).map(itemToOption);
  }, [getItems, itemToOption]);

  const optionList = useMemo(
    () => (options || []).filter((item) => item.value !== allValue),
    [options, allValue],
  );

  const filteredItems = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return optionList;
    return optionList.filter((item) => (item.label || '').toLowerCase().includes(q));
  }, [optionList, searchTerm]);

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
    setEditOption(null);
    resetModalState();
  }, [resetModalState]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteOption(null);
  }, []);

  const openAddModal = useCallback(() => {
    resetModalState();
    setAddModalOpen(true);
  }, [resetModalState]);

  const openEditModal = useCallback((option) => {
    setEditOption(option);
    setPendingName(option?.label || '');
    setModalError('');
    setEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((option) => {
    setDeleteOption(option);
    setDeleteModalOpen(true);
  }, []);

  const confirmAdd = useCallback(async () => {
    const clean = (pendingName || '').trim();
    if (!clean) return;

    // Check for duplicates in current options
    if ((options || []).some((item) => item.label === clean && item.value !== allValue)) {
      setModalError(duplicateErrorMessage);
      return;
    }

    setIsLoading(true);
    try {
      const newItem = await createItem(clean);
      const newOption = itemToOption(newItem);
      
      closeAddModal();
      setIsLoading(false);
    } catch (err) {
      setModalError(err.message || 'Failed to create item');
      setIsLoading(false);
    }
  }, [allValue, duplicateErrorMessage, options, pendingName, createItem, itemToOption, closeAddModal]);

  const confirmEdit = useCallback(async () => {
    const clean = (pendingName || '').trim();
    if (!clean || !editOption) return;

    // Check for duplicate names (excluding the current item)
    if ((options || []).some(
      (item) => item.label === clean && item.value !== editOption.value && item.value !== allValue
    )) {
      setModalError(duplicateErrorMessage);
      return;
    }

    setIsLoading(true);
    try {
      const updatedItem = await updateItem(editOption.value, { name: clean });
      const updatedOption = itemToOption(updatedItem);
      
      closeEditModal();
      setIsLoading(false);
    } catch (err) {
      setModalError(err.message || 'Failed to update item');
      setIsLoading(false);
    }
  }, [editOption, options, pendingName, allValue, duplicateErrorMessage, updateItem, itemToOption, closeEditModal]);

  const confirmDelete = useCallback(async () => {
    if (!deleteOption) return;

    setIsLoading(true);
    try {
      await deleteItem(deleteOption.value);
      closeDeleteModal();
      setIsLoading(false);
    } catch (err) {
      setModalError(err.message || 'Failed to delete item');
      setIsLoading(false);
    }
  }, [deleteOption, deleteItem, closeDeleteModal]);

  const handleToggleActive = useCallback(async (option) => {
    try {
      await toggleActive(option.value);
    } catch (err) {
      console.error('Failed to toggle active status:', err);
    }
  }, [toggleActive]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    pendingName,
    setPendingName,
    modalError,
    editOption,
    deleteOption,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAddModal,
    closeEditModal,
    closeDeleteModal,
    confirmAdd,
    confirmEdit,
    confirmDelete,
    isLoading,
    handleToggleActive,
  };
}
