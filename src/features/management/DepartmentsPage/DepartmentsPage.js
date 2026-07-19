import React from 'react';
import ManagementOptionsPage from '../ManagementOptionsPage/ManagementOptionsPage';
import { useProjects } from '../../../services/context/ProjectsContext';

export default function DepartmentsPage({ onBack }) {
  const { agaffOptions, setAgaffOptions } = useProjects();

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
      options={agaffOptions}
      setOptions={setAgaffOptions}
      duplicateErrorMessage="אגף עם השם הזה כבר קיים"
    />
  );
}
