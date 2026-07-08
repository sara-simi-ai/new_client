import React, { useState } from "react";
import { useProjects } from "../../../../services/context/ProjectsContext";
import "./CopyProjectsButton.css";

export default function CopyProjectsButton() {
  const { selectedYear, copyFromPreviousYear } = useProjects();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!window.confirm(`האם להעתיק את הפרויקטים משנת ${selectedYear - 1} לשנת ${selectedYear}?`)) return;
    try {
      setLoading(true);
      await copyFromPreviousYear(selectedYear);
      // optionally show a toast; here we use alert for simplicity
      alert("העתקה הושלמה בהצלחה.");
    } catch (err) {
      console.error(err);
      alert(err.message || "שגיאה בעת העתקת פרויקטים.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="copy-projects-btn" onClick={handleClick} disabled={loading} title="העתק פרויקטים מהשנה הקודמת">
      {loading ? "מעבד..." : "העתק מהשנה הקודמת"}
    </button>
  );
}
