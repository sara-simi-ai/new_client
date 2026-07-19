import React from 'react';
import ManagementOptionsPage from '../ManagementOptionsPage/ManagementOptionsPage';
import { useProjects } from '../../../services/context/ProjectsContext';

export default function TeamsPage({ onBack }) {
  const { yechidaMevatzatOptions, setYechidaMevatzatOptions } = useProjects();

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
      options={yechidaMevatzatOptions}
      setOptions={setYechidaMevatzatOptions}
      duplicateErrorMessage="צוות עם השם הזה כבר קיים"
    />
  );
}
