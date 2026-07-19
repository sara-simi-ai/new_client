import React from 'react';
import ManagementOptionsPage from '../ManagementOptionsPage/ManagementOptionsPage';
import { useTsevetMevatzeatManagement } from '../ManagementOptionsPage/useTsevetMevatzeatManagement';

export default function TeamsPage({ onBack }) {
  const hook = useTsevetMevatzeatManagement();

  return (
    <ManagementOptionsPage
      onBack={onBack}
      title="ניהול צוותות"
      subtitle="הוסף, ערוך או מחק צוותות במערכת."
      searchPlaceholder="חיפוש לפי שם צוות"
      addButtonLabel="הוספת צוות +"
      addModalTitle="הוספת צוות חדש"
      addModalDescription="הכנס שם לצוות החדש"
      editModalTitle="עריכת צוות"
      editModalDescription="ערוך את שם הצוות"
      deleteModalTitle="מחיקת צוות"
      deleteModalDescription={(option) => `האם אתה בטוח שברצונך למחוק את הצוות "${option?.label}"?`}
      itemPlaceholder="שם צוות"
      options={hook.filteredItems}
      setOptions={() => {}} // No-op for async version
      onToggleOptionActive={hook.handleToggleActive}
      duplicateErrorMessage="צוות עם השם הזה כבר קיים"
      // Pass the full hook state for async support
      __hook__={hook}
      __isAsync__={true}
    />
  );
}
