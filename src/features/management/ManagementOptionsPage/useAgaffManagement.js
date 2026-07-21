import { useCallback, useEffect } from 'react';
import { useAgaff } from '../../../services/context/AgaffContext';
import { useManagementListAsync } from './useManagementListAsync';
import { DEPARTMENTS_DUPLICATE_ERROR } from '../../../utils/Dec';

export function useAgaffManagement() {
  const {
    isLoading: contextLoading,
    addNewAgaff,
    updateAgaffData,
    toggleAgaffStatus,
    updateFilter,
    agaffList,
  } = useAgaff();

  const getItems = useCallback(() => agaffList, [agaffList]);
  const createItem = useCallback((name) => addNewAgaff({ name, description: '' }), [addNewAgaff]);
  const updateItem = useCallback((id, payload) => updateAgaffData({ id, ...payload }), [updateAgaffData]);
  const itemToOption = useCallback(
    (agaff) => ({
      value: agaff.id,
      label: agaff.name || '—',
      active: agaff.active !== false,
    }),
    [],
  );

  const hook = useManagementListAsync({
    getItems,
    createItem,
    updateItem,
    toggleActive: toggleAgaffStatus,
    itemToOption,
    duplicateErrorMessage: DEPARTMENTS_DUPLICATE_ERROR,
  });

  useEffect(() => {
    updateFilter('search', hook.searchTerm);
  }, [hook.searchTerm, updateFilter]);

  return {
    ...hook,
    isLoading: hook.isLoading || contextLoading,
  };
}
