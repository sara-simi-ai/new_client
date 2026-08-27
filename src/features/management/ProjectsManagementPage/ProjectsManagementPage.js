import React from 'react';
import ManagementOptionsPage from '../ManagementOptionsPage/ManagementOptionsPage';
import { useProjectsManagement } from '../ManagementOptionsPage/useProjectsManagement';
import ProjectFormModal from '../../projects/ProjectFormModal/ProjectFormModal';
import {
  PROJECTS_TITLE,
  PROJECTS_SUBTITLE,
  PROJECTS_SEARCH_PLACEHOLDER,
  PROJECTS_ADD_BUTTON,
  PROJECTS_ADD_MODAL_TITLE,
  PROJECTS_ADD_MODAL_DESC,
  PROJECTS_EDIT_MODAL_TITLE,
  PROJECTS_EDIT_MODAL_DESC,
  PROJECTS_DELETE_MODAL_TITLE,
  PROJECTS_ITEM_PLACEHOLDER,
  DUPLICATE_NAME_ERROR,
  PROJECTS_DELETE_CONFIRM_TEXT,
} from '../../../utils/Dec';

export default function ProjectsManagementPage({ onBack }) {
  const hook = useProjectsManagement();

  return (
    <ManagementOptionsPage
      onBack={onBack}
      title={PROJECTS_TITLE}
      subtitle={PROJECTS_SUBTITLE}
      searchPlaceholder={PROJECTS_SEARCH_PLACEHOLDER}
      addButtonLabel={PROJECTS_ADD_BUTTON}
      addModalTitle={PROJECTS_ADD_MODAL_TITLE}
      addModalDescription={PROJECTS_ADD_MODAL_DESC}
      editModalTitle={PROJECTS_EDIT_MODAL_TITLE}
      editModalDescription={PROJECTS_EDIT_MODAL_DESC}
      deleteModalTitle={PROJECTS_DELETE_MODAL_TITLE}
      deleteModalDescription={(option) => `${PROJECTS_DELETE_CONFIRM_TEXT} "${option?.label}"?`}
      itemPlaceholder={PROJECTS_ITEM_PLACEHOLDER}
      options={hook.options}
      onToggleOptionActive={hook.handleToggleActive}
      duplicateErrorMessage={DUPLICATE_NAME_ERROR}
      asyncHook={hook}
      isAsync={true}
      customAddComponent={ProjectFormModal}
      customAddComponentProps={{ mode: 'new', initialData: {} }}
    />
  );
}
