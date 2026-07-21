import React from 'react';
import ManagementOptionsPage from '../ManagementOptionsPage/ManagementOptionsPage';
import { useAgaffManagement } from '../ManagementOptionsPage/useAgaffManagement';
import {
  DEPARTMENTS_TITLE,
  DEPARTMENTS_SUBTITLE,
  DEPARTMENTS_SEARCH_PLACEHOLDER,
  DEPARTMENTS_ADD_BUTTON,
  DEPARTMENTS_ADD_MODAL_TITLE,
  DEPARTMENTS_ADD_MODAL_DESC,
  DEPARTMENTS_EDIT_MODAL_TITLE,
  DEPARTMENTS_EDIT_MODAL_DESC,
  DEPARTMENTS_DELETE_MODAL_TITLE,
  DEPARTMENTS_ITEM_PLACEHOLDER,
  DUPLICATE_NAME_ERROR,
  DEPARTMENTS_DELETE_CONFIRM_TEXT,
} from '../../../utils/Dec';

export default function DepartmentsPage({ onBack }) {
  const hook = useAgaffManagement();

  return (
    <ManagementOptionsPage
      onBack={onBack}
      title={DEPARTMENTS_TITLE}
      subtitle={DEPARTMENTS_SUBTITLE}
      searchPlaceholder={DEPARTMENTS_SEARCH_PLACEHOLDER}
      addButtonLabel={DEPARTMENTS_ADD_BUTTON}
      addModalTitle={DEPARTMENTS_ADD_MODAL_TITLE}
      addModalDescription={DEPARTMENTS_ADD_MODAL_DESC}
      editModalTitle={DEPARTMENTS_EDIT_MODAL_TITLE}
      editModalDescription={DEPARTMENTS_EDIT_MODAL_DESC}
      deleteModalTitle={DEPARTMENTS_DELETE_MODAL_TITLE}
      deleteModalDescription={(option) => `${DEPARTMENTS_DELETE_CONFIRM_TEXT} "${option?.label}"?`}
      itemPlaceholder={DEPARTMENTS_ITEM_PLACEHOLDER}
      // Pass full, unfiltered options to avoid duplicating the derived `filteredItems` provided by the async hook
      options={hook.options}
      onToggleOptionActive={hook.handleToggleActive}
      duplicateErrorMessage={DUPLICATE_NAME_ERROR}
      // Pass the full hook state for async support
      asyncHook={hook}
      isAsync={true}
    />
  );
}
