import React, { useState } from 'react';
import { EditIcon } from '../../../components/ActionIcons/ActionIcons';
import Modal from '../../../components/Modal/Modal';
import BackButton from '../../../components/BackButton/BackButton';
import ToggleActiveButton from '../../../components/ToggleActiveButton/ToggleActiveButton';
import '../ManagementShared.css';
import './ManagementOptionsPage.css';
import { useManagementOptions } from './useManagementOptions';
import {
  MANAGEMENT_EMPTY_TEXT,
  MANAGEMENT_ADD_ACTION,
  MANAGEMENT_SAVE_ACTION,
  MANAGEMENT_DELETE_ACTION,
  MANAGEMENT_CANCEL_ACTION,
  MANAGEMENT_TOGGLE_INACTIVE,
  MANAGEMENT_TOGGLE_ACTIVE,
  MANAGEMENT_EDIT_ACTION,
} from '../../../utils/Dec';

function ManagementModal({
  title,
  description,
  children,
  error,
  onCancel,
  onConfirm,
  cancelLabel,
  confirmLabel,
  isLoading,
}) {
  return (
    <Modal onClose={onCancel}>
      <h3>{title}</h3>
      <p className="muted">{description}</p>
      {children}
      {error && <div className="mgmt-modal-error">{error}</div>}
      <div className="mgmt-modal-actions">
        <button className="mgmt-btn ghost" type="button" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </button>
        <button className="mgmt-btn primary" type="button" onClick={onConfirm} disabled={isLoading}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default function ManagementOptionsPage({
  onBack,
  title,
  subtitle,
  searchPlaceholder,
  addButtonLabel,
  addModalTitle,
  addModalDescription,
  editModalTitle,
  editModalDescription,
  deleteModalTitle,
  deleteModalDescription = () => '',
  itemPlaceholder,
  addActionLabel = MANAGEMENT_ADD_ACTION,
  saveActionLabel = MANAGEMENT_SAVE_ACTION,
  deleteActionLabel = MANAGEMENT_DELETE_ACTION,
  emptyText = MANAGEMENT_EMPTY_TEXT,
  options,
  setOptions = () => {},
  onToggleOptionActive,
  duplicateErrorMessage,
  allValue = '__all__',
  asyncHook = null,
  isAsync = false,
  customAddComponent = null,
  customAddComponentProps = {},
}) {
  const syncHook = useManagementOptions({
    options,
    setOptions,
    allValue,
    duplicateErrorMessage,
  });

  const hook = isAsync && asyncHook ? asyncHook : syncHook;

  const {
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
    isLoading = false,
  } = hook;

  const [customAddOpen, setCustomAddOpen] = useState(false);

  const handleAddClick = () => {
    if (customAddComponent) {
      setCustomAddOpen(true);
      return;
    }

    openAddModal();
  };

  const handleCustomAddClose = () => {
    setCustomAddOpen(false);
  };

  return (
    <div className="mgmt-page no-card-bg" dir="rtl">
      <div className="mgmt-page-header">
        <div>
          <h1 className="mgmt-page-title">{title}</h1>
          <p className="mgmt-page-subtitle">{subtitle}</p>
        </div>
        <BackButton onClick={onBack} />
      </div>

      <div className="mgmt-page-content">
        <div className="mgmt-card">
          <div className="agaff-controls">
            <div className="agaff-search">
              <input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle cx="11" cy="11" r="6" stroke="#6B7280" strokeWidth="1.6" fill="none" />
                  <path d="M20 20 L16.5 16.5" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <button className="agaff-add-btn" type="button" onClick={handleAddClick} disabled={isLoading}>
              {addButtonLabel}
            </button>
          </div>

          <div className="agaff-list">
            {filteredItems.length === 0 && <div className="agaff-empty">{emptyText}</div>}
            {filteredItems.map((opt) => (
              <div className="agaff-item" key={opt.value}>
                <div className="agaff-name">{opt.label}</div>
                <div className="agaff-actions">
                  <ToggleActiveButton
                    active={opt.active !== false}
                    onClick={() => onToggleOptionActive?.(opt)}
                    title={opt.active !== false ? MANAGEMENT_TOGGLE_INACTIVE : MANAGEMENT_TOGGLE_ACTIVE}
                  />
                  <button className="icon-btn" type="button" onClick={() => openEditModal(opt)} title={MANAGEMENT_EDIT_ACTION} aria-label={MANAGEMENT_EDIT_ACTION}>
                    <EditIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {customAddComponent && customAddOpen && React.createElement(customAddComponent, {
          open: true,
          onClose: handleCustomAddClose,
          mode: 'new',
          initialData: {},
          ...customAddComponentProps,
        })}

        {addModalOpen && !customAddComponent && (
          <ManagementModal
            title={addModalTitle}
            description={addModalDescription}
            error={modalError}
            onCancel={closeAddModal}
            onConfirm={confirmAdd}
            cancelLabel={MANAGEMENT_CANCEL_ACTION}
            confirmLabel={addActionLabel}
            isLoading={isLoading}
          >
            <input className="mgmt-input" value={pendingName} onChange={(e) => setPendingName(e.target.value)} placeholder={itemPlaceholder} />
          </ManagementModal>
        )}

        {editModalOpen && (
          <ManagementModal
            title={editModalTitle}
            description={editModalDescription}
            error={modalError}
            onCancel={closeEditModal}
            onConfirm={confirmEdit}
            cancelLabel={MANAGEMENT_CANCEL_ACTION}
            confirmLabel={saveActionLabel}
            isLoading={isLoading}
          >
            <input className="mgmt-input" value={pendingName} onChange={(e) => setPendingName(e.target.value)} placeholder={itemPlaceholder} />
          </ManagementModal>
        )}

        {deleteModalOpen && (
          <ManagementModal
            title={deleteModalTitle}
            description={deleteModalDescription(deleteOption)}
            onCancel={closeDeleteModal}
            onConfirm={confirmDelete}
            cancelLabel={MANAGEMENT_CANCEL_ACTION}
            confirmLabel={deleteActionLabel}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
