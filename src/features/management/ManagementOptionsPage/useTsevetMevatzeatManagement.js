import { useCallback, useEffect } from 'react';
import { useTsevetMevatzeat } from '../../../services/context/TsevetMevatzeatContext';
import { useManagementListAsync } from './useManagementListAsync';
import { DUPLICATE_NAME_ERROR } from '../../../utils/Dec';

export function useTsevetMevatzeatManagement() {
  const {
    isLoading: contextLoading,
    addNewTsevetMevatzeat,
    updateTsevetData,
    toggleTsevetStatus,
    updateFilter,
    tsevetMevatzeatList,
  } = useTsevetMevatzeat();

  const getItems = useCallback(() => tsevetMevatzeatList, [tsevetMevatzeatList]);
  const createItem = useCallback((name) => addNewTsevetMevatzeat({ name, description: '' }), [addNewTsevetMevatzeat]);
  const updateItem = useCallback((id, payload) => updateTsevetData({ id, ...payload }), [updateTsevetData]);
  const itemToOption = useCallback(
    (tsevet) => ({
      value: tsevet.id,
      label: tsevet.name || '—',
      active: tsevet.active !== false,
    }),
    [],
  );

  const hook = useManagementListAsync({
    getItems,
    createItem,
    updateItem,
    toggleActive: toggleTsevetStatus,
    itemToOption,
    duplicateErrorMessage: DUPLICATE_NAME_ERROR,
  });

  useEffect(() => {
    updateFilter('search', hook.searchTerm);
  }, [hook.searchTerm, updateFilter]);

  return {
    ...hook,
    isLoading: hook.isLoading || contextLoading,
  };
}
