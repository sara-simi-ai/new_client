import { useCallback, useEffect } from 'react';
import { useChativa } from '../../../services/context/ChativaContext';
import { useManagementListAsync } from './useManagementListAsync';
import { DUPLICATE_NAME_ERROR } from '../../../utils/Dec';

export function useChativaManagement() {
  const {
    isLoading: contextLoading,
    addNewChativa,
    updateChativaData,
    toggleChativaStatus,
    updateFilter,
    chativaList,
  } = useChativa();

  const getItems = useCallback(() => chativaList, [chativaList]);
  const createItem = useCallback((name) => addNewChativa({ name, description: '' }), [addNewChativa]);
  const updateItem = useCallback((id, payload) => updateChativaData({ id, ...payload }), [updateChativaData]);
  const itemToOption = useCallback(
    (chativa) => ({
      value: chativa.id,
      label: chativa.name || '—',
      active: chativa.active !== false,
    }),
    [],
  );

  const hook = useManagementListAsync({
    getItems,
    createItem,
    updateItem,
    toggleActive: toggleChativaStatus,
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
