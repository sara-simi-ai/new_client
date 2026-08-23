import React from "react";
import { DeleteIcon, EditIcon } from "../../../components/ActionIcons/ActionIcons";
import "./ProjectActionButtons.css";

export default function ProjectActionButtons({ onEdit, onDelete, className = "cf-actions" }) {
  if (!onEdit && !onDelete) return null;

  return (
    <div className={className}>
      {onDelete && (
        <button className="cf-delete-btn" onClick={onDelete} aria-label="מחק" title="מחק">
          <DeleteIcon />
        </button>
      )}
      {onEdit && (
        <button className="cf-edit-btn" onClick={onEdit} aria-label="עדכן" title="עדכן">
          <EditIcon />
        </button>
      )}
    </div>
  );
}
