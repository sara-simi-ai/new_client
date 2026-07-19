import { useCallback, useMemo, useState } from 'react';

export function useManagementOptions({ options = [], setOptions, allValue = '__all__', duplicateErrorMessage = 'שם עם השם הזה כבר קיים' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editOption, setEditOption] = useState(null);
  const [deleteOption, setDeleteOption] = useState(null);
  const [pendingName, setPendingName] = useState('');
  const [modalError, setModalError] = useState('');

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

  const confirmAdd = useCallback(() => {
    const clean = (pendingName || '').trim();
    if (!clean) return;
    if ((options || []).some((item) => item.label === clean)) {
      setModalError(duplicateErrorMessage);
      return;
    }

    const newOption = { value: clean, label: clean };
    setOptions((prev) => [
      ...(prev || []).filter((item) => item.value === allValue),
      newOption,
      ...(prev || []).filter((item) => item.value !== allValue && item.label !== clean),
    ]);

    setPendingName('');
    setAddModalOpen(false);
  }, [allValue, duplicateErrorMessage, options, pendingName, setOptions]);

  const confirmEdit = useCallback(() => {
    const clean = (pendingName || '').trim();
    if (!clean || !editOption) return;
    setOptions((prev) =>
      (prev || []).map((item) =>
        item.value === editOption.value ? { ...item, label: clean, value: clean } : item,
      ),
    );
    setEditOption(null);
    setPendingName('');
    setEditModalOpen(false);
  }, [editOption, pendingName, setOptions]);

  const confirmDelete = useCallback(() => {
    if (!deleteOption) return;
    setOptions((prev) => (prev || []).filter((item) => item.value !== deleteOption.value));
    setDeleteOption(null);
    setDeleteModalOpen(false);
  }, [deleteOption, setOptions]);

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
  };
}
