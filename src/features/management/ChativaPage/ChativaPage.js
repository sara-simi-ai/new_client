import React from 'react';
import ManagementOptionsPage from '../ManagementOptionsPage/ManagementOptionsPage';
import { useChativaManagement } from '../ManagementOptionsPage/useChativaManagement';
import {
  CHATIVA_TITLE,
  CHATIVA_SUBTITLE,
  CHATIVA_SEARCH_PLACEHOLDER,
  CHATIVA_ADD_BUTTON,
  CHATIVA_ADD_MODAL_TITLE,
  CHATIVA_ADD_MODAL_DESC,
  CHATIVA_EDIT_MODAL_TITLE,
  CHATIVA_EDIT_MODAL_DESC,
  CHATIVA_DELETE_MODAL_TITLE,
  CHATIVA_ITEM_PLACEHOLDER,
  DUPLICATE_NAME_ERROR,
  CHATIVA_DELETE_CONFIRM_TEXT,
} from '../../../utils/Dec';

export default function ChativaPage({ onBack }) {
  const hook = useChativaManagement();

  return (
    <ManagementOptionsPage
      onBack={onBack}
      title={CHATIVA_TITLE}
      subtitle={CHATIVA_SUBTITLE}
      searchPlaceholder={CHATIVA_SEARCH_PLACEHOLDER}
      addButtonLabel={CHATIVA_ADD_BUTTON}
      addModalTitle={CHATIVA_ADD_MODAL_TITLE}
      addModalDescription={CHATIVA_ADD_MODAL_DESC}
      editModalTitle={CHATIVA_EDIT_MODAL_TITLE}
      editModalDescription={CHATIVA_EDIT_MODAL_DESC}
      deleteModalTitle={CHATIVA_DELETE_MODAL_TITLE}
      deleteModalDescription={(option) => `${CHATIVA_DELETE_CONFIRM_TEXT} "${option?.label}"?`}
      itemPlaceholder={CHATIVA_ITEM_PLACEHOLDER}
      options={hook.options}
      onToggleOptionActive={hook.handleToggleActive}
      duplicateErrorMessage={DUPLICATE_NAME_ERROR}
      asyncHook={hook}
      isAsync={true}
    />
  );
}
