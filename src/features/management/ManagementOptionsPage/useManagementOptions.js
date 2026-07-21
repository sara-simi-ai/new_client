import { useCallback, useMemo, useState } from 'react';
import { MANAGEMENT_DUPLICATE_NAME_ERROR } from '../../../utils/Dec';

export function useManagementOptions({ options = [], setOptions, allValue = '__all__', duplicateErrorMessage = MANAGEMENT_DUPLICATE_NAME_ERROR }) {
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

    setOptions((prev) => {
      const list = prev || [];
      if (list.some((item) => item.label === clean && item.value !== allValue)) {
        setModalError(duplicateErrorMessage);
        return prev;
      }

      const newOption = { value: clean, label: clean, active: true };
      const updated = [
        ...list.filter((item) => item.value === allValue),
        newOption,
        ...list.filter((item) => item.value !== allValue && item.label !== clean),
      ];

      setPendingName('');
      setAddModalOpen(false);
      return updated;
    });
  }, [allValue, duplicateErrorMessage, pendingName, setOptions]);

  const confirmEdit = useCallback(() => {
    const clean = (pendingName || '').trim();
    if (!clean || !editOption) return;

    let duplicateFound = false;
    setOptions((prev) => {
      const list = prev || [];
      if (
        list.some(
          (item) =>
            item.value !== editOption.value &&
            item.value !== allValue &&
            item.label === clean,
        )
      ) {
        duplicateFound = true;
        setModalError(duplicateErrorMessage);
        return prev;
      }

      return list.map((item) =>
        item.value === editOption.value ? { ...item, label: clean, value: clean } : item,
      );
    });

    if (duplicateFound) return;

    setEditOption(null);
    setPendingName('');
    setEditModalOpen(false);
  }, [allValue, duplicateErrorMessage, editOption, pendingName, setOptions]);

  const confirmDelete = useCallback(() => {
    if (!deleteOption) return;

    setOptions((prev) =>
      (prev || []).map((item) =>
        item.value === deleteOption.value ? { ...item, active: false } : item,
      ),
    );
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
