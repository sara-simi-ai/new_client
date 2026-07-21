import React from 'react';
import ManagementOptionsPage from '../ManagementOptionsPage/ManagementOptionsPage';
import { useTsevetMevatzeatManagement } from '../ManagementOptionsPage/useTsevetMevatzeatManagement';
import {
  TEAMS_TITLE,
  TEAMS_SUBTITLE,
  TEAMS_SEARCH_PLACEHOLDER,
  TEAMS_ADD_BUTTON,
  TEAMS_ADD_MODAL_TITLE,
  TEAMS_ADD_MODAL_DESC,
  TEAMS_EDIT_MODAL_TITLE,
  TEAMS_EDIT_MODAL_DESC,
  TEAMS_DELETE_MODAL_TITLE,
  TEAMS_ITEM_PLACEHOLDER,
  DUPLICATE_NAME_ERROR,
  TEAMS_DELETE_CONFIRM_TEXT,
} from '../../../utils/Dec';

export default function TeamsPage({ onBack }) {
  const hook = useTsevetMevatzeatManagement();

  return (
    <ManagementOptionsPage
      onBack={onBack}
      title={TEAMS_TITLE}
      subtitle={TEAMS_SUBTITLE}
      searchPlaceholder={TEAMS_SEARCH_PLACEHOLDER}
      addButtonLabel={TEAMS_ADD_BUTTON}
      addModalTitle={TEAMS_ADD_MODAL_TITLE}
      addModalDescription={TEAMS_ADD_MODAL_DESC}
      editModalTitle={TEAMS_EDIT_MODAL_TITLE}
      editModalDescription={TEAMS_EDIT_MODAL_DESC}
      deleteModalTitle={TEAMS_DELETE_MODAL_TITLE}
      deleteModalDescription={(option) => `${TEAMS_DELETE_CONFIRM_TEXT} "${option?.label}"?`}
      itemPlaceholder={TEAMS_ITEM_PLACEHOLDER}
      options={hook.options}
      onToggleOptionActive={hook.handleToggleActive}
      duplicateErrorMessage={DUPLICATE_NAME_ERROR}
      asyncHook={hook}
      isAsync={true}
    />
  );
}
