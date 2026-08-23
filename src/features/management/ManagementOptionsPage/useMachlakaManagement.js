import { useCallback, useEffect } from 'react';
import { useMachlaka } from '../../../services/context/MachlakaContext';
import { useManagementListAsync } from './useManagementListAsync';
import { DUPLICATE_NAME_ERROR } from '../../../utils/Dec';

export function useMachlakaManagement() {
  const {
    isLoading: contextLoading,
    addNewMachlaka,
    updateMachlakaData,
    toggleMachlakaStatus,
    updateFilter,
    machlakaList,
  } = useMachlaka();

  const getItems = useCallback(() => machlakaList, [machlakaList]);
  const createItem = useCallback((name) => addNewMachlaka({ name, description: '' }), [addNewMachlaka]);
  const updateItem = useCallback((id, payload) => updateMachlakaData({ id, ...payload }), [updateMachlakaData]);
  const itemToOption = useCallback(
    (machlaka) => ({
      value: machlaka.id,
      label: machlaka.name || '—',
      active: machlaka.active !== false,
    }),
    [],
  );

  const hook = useManagementListAsync({
    getItems,
    createItem,
    updateItem,
    toggleActive: toggleMachlakaStatus,
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
