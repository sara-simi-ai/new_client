import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { MANAGEMENT_DUPLICATE_NAME_ERROR } from '../../../utils/Dec';

export function useManagementListAsync({
  getItems,
  createItem,
  updateItem,
  toggleActive,
  itemToOption,
  duplicateErrorMessage = MANAGEMENT_DUPLICATE_NAME_ERROR,
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

  const optionList = useMemo(() => {
    const items = getItems();
    return (items || [])
      .map(itemToOption)
      .filter((item) => item.value !== allValue);
  }, [getItems, itemToOption, allValue]);

  const filteredItems = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return optionList;
    return optionList.filter((item) => (item.label || '').toLowerCase().includes(q));
  }, [optionList, searchTerm]);

  const resetModalState = useCallback(() => {
    setPendingName('');
    setModalError('');
  }, []);

  const isMountedRef = useRef(true);
  useEffect(() => () => {
    isMountedRef.current = false;
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

    const allItems = getItems() || [];
    if (allItems.some((item) => item.name === clean && item.value !== allValue)) {
      setModalError(duplicateErrorMessage);
      return;
    }

    if (isMountedRef.current) setIsLoading(true);
    try {
      await createItem(clean);
      if (isMountedRef.current) {
        closeAddModal();
        setIsLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) setModalError(err.message || 'Failed to create item');
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [allValue, duplicateErrorMessage, pendingName, createItem, closeAddModal, getItems]);

  const confirmEdit = useCallback(async () => {
    const clean = (pendingName || '').trim();
    if (!clean || !editOption) return;

    const allItems = getItems() || [];
    if (allItems.some(
      (item) => item.name === clean && item.value !== editOption.value && item.value !== allValue
    )) {
      setModalError(duplicateErrorMessage);
      return;
    }

    if (isMountedRef.current) setIsLoading(true);
    try {
      await updateItem(editOption.value, { name: clean });
      if (isMountedRef.current) {
        closeEditModal();
        setIsLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) setModalError(err.message || 'Failed to update item');
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [editOption, pendingName, allValue, duplicateErrorMessage, updateItem, closeEditModal, getItems]);

  const confirmDelete = useCallback(async () => {
    if (!deleteOption) return;

    if (isMountedRef.current) setIsLoading(true);
    try {
      await toggleActive(deleteOption.value);
      if (isMountedRef.current) {
        closeDeleteModal();
        setIsLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) setModalError(err.message || 'Failed to delete item');
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [deleteOption, closeDeleteModal, toggleActive]);

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
    options: optionList,
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
