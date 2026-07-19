import React from 'react';
import { DeleteIcon, EditIcon } from '../../../components/ActionIcons/ActionIcons';
import Modal from '../../../components/Modal/Modal';
import BackButton from '../../../components/BackButton/BackButton';
import '../ManagementShared.css';
import './ManagementOptionsPage.css';
import { useManagementOptions } from './useManagementOptions';

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
  addActionLabel = 'הוספה',
  saveActionLabel = 'שמור',
  deleteActionLabel = 'מחק',
  emptyText = 'לא נמצאו תוצאות',
  options,
  setOptions,
  duplicateErrorMessage,
  allValue = '__all__',
}) {
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
  } = useManagementOptions({
    options,
    setOptions,
    allValue,
    duplicateErrorMessage,
  });

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
            <button className="agaff-add-btn" type="button" onClick={openAddModal}>
              {addButtonLabel}
            </button>
          </div>

          <div className="agaff-list">
            {filteredItems.length === 0 && <div className="agaff-empty">{emptyText}</div>}
            {filteredItems.map((opt) => (
              <div className="agaff-item" key={opt.value}>
                <div className="agaff-name">{opt.label}</div>
                <div className="agaff-actions">
                  <button className="icon-btn" type="button" onClick={() => openDeleteModal(opt)} title="מחק" aria-label="מחק">
                    <DeleteIcon />
                  </button>
                  <button className="icon-btn" type="button" onClick={() => openEditModal(opt)} title="ערוך" aria-label="ערוך">
                    <EditIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {addModalOpen && (
          <Modal onClose={closeAddModal}>
            <h3>{addModalTitle}</h3>
            <p className="muted">{addModalDescription}</p>
            <input className="mgmt-input" value={pendingName} onChange={(e) => setPendingName(e.target.value)} placeholder={itemPlaceholder} />
            {modalError && <div style={{ color: '#ef4444', marginTop: 8 }}>{modalError}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <button className="mgmt-btn ghost" type="button" onClick={closeAddModal}>ביטול</button>
              <button className="mgmt-btn primary" type="button" onClick={confirmAdd}>{addActionLabel}</button>
            </div>
          </Modal>
        )}

        {editModalOpen && (
          <Modal onClose={closeEditModal}>
            <h3>{editModalTitle}</h3>
            <p className="muted">{editModalDescription}</p>
            <input className="mgmt-input" value={pendingName} onChange={(e) => setPendingName(e.target.value)} placeholder={itemPlaceholder} />
            {modalError && <div style={{ color: '#ef4444', marginTop: 8 }}>{modalError}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <button className="mgmt-btn ghost" type="button" onClick={closeEditModal}>ביטול</button>
              <button className="mgmt-btn primary" type="button" onClick={confirmEdit}>{saveActionLabel}</button>
            </div>
          </Modal>
        )}

        {deleteModalOpen && (
          <Modal onClose={closeDeleteModal}>
            <h3>{deleteModalTitle}</h3>
            <p className="muted">{deleteModalDescription(deleteOption)}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <button className="mgmt-btn ghost" type="button" onClick={closeDeleteModal}>ביטול</button>
              <button className="mgmt-btn primary" type="button" onClick={confirmDelete}>{deleteActionLabel}</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
