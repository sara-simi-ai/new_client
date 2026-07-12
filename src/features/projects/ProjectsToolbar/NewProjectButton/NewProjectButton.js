import { useState } from "react";
import ProjectFormModal from "../../../projects/ProjectFormModal/ProjectFormModal";
import "./NewProjectButton.css";

export default function NewProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="np-trigger" onClick={() => setOpen(true)}>
        פרויקט חדש
      </button>

      <ProjectFormModal open={open} onClose={() => setOpen(false)} mode="new" />
    </>
  );
}
