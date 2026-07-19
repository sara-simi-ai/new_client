import React from 'react';
import ManagementOptionsPage from '../ManagementOptionsPage/ManagementOptionsPage';
import { useAgaffManagement } from '../ManagementOptionsPage/useAgaffManagement';

export default function DepartmentsPage({ onBack }) {
  const hook = useAgaffManagement();

  return (
    <ManagementOptionsPage
      onBack={onBack}
      title="ניהול אגפים"
      subtitle="הוסף, ערוך או מחק אגפים במערכת."
      searchPlaceholder="חיפוש לפי שם אגף"
      addButtonLabel="הוספת אגף +"
      addModalTitle="הוספת אגף חדש"
      addModalDescription="הכנס שם לאגף החדש"
      editModalTitle="עריכת אגף"
      editModalDescription="ערוך את שם האגף"
      deleteModalTitle="מחיקת אגף"
      deleteModalDescription={(option) => `האם אתה בטוח שברצונך למחוק את האגף "${option?.label}"?`}
      itemPlaceholder="שם אגף"
      options={hook.filteredItems}
      setOptions={() => {}} // No-op for async version
      onToggleOptionActive={hook.handleToggleActive}
      duplicateErrorMessage="אגף עם השם הזה כבר קיים"
      // Pass the full hook state for async support
      __hook__={hook}
      __isAsync__={true}
    />
  );
}
