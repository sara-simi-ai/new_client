import React, { useState, useEffect } from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { formatGapDisplay, getGapStatus } from "../../../utils/calculateProjectFinanceHelper";
import { GAP_CLASSES, MASLOL_OPTIONS, PROCUREMENT_BUDGET_LABEL, HR_BUDGET_LABEL, TOTAL_BUDGET_LABEL, GAPS_LABEL, PLANNED_HR_LABEL } from "../../../utils/Dec";
import "./ProjectFormModal.css";

export default function ProjectForm({ initialData = {}, mode = "new", onSubmit, onCancel }) {
  const { agaffOptions, yechidaMevatzatOptions } = useProjects();
  const [form, setForm] = useState({
    projectName: "",
    agaff: "",
    yechidaMevatzat: "",
    maslol: MASLOL_OPTIONS[0].value,
    logHemsheci: false,
    teur: "",
    hearot: "",
    totalTakzivCoachAdam: 0,
    totalTakzivRechesh: 0,
    coachAdam: 0,
    active: true,
  });
  const [tab, setTab] = useState("פרטים");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        projectName: initialData.projectName || "",
        agaff: initialData.agaff || "",
        yechidaMevatzat: initialData.yechidaMevatzat || "",
        maslol: initialData.maslol || MASLOL_OPTIONS[0].value, 
        logHemsheci: initialData.logHemsheci || false,
        teur: initialData.teur || "",
        hearot: initialData.hearot || "",
        totalTakzivCoachAdam: initialData.totalTakzivCoachAdam || 0,
        totalTakzivRechesh: initialData.totalTakzivRechesh || 0,
        coachAdam: initialData.coachAdam || 0,
        active: initialData.active === false ? false : true,
      }));
    }
  }, [initialData]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleNumFocus = (field) => {
    if (Number(form[field]) === 0) set(field, "");
  };

  const handleNumBlur = (field) => {
    if (form[field] === "" || form[field] === null || form[field] === undefined) set(field, 0);
  };

  const totalBudget = Number(form.totalTakzivCoachAdam) + Number(form.totalTakzivRechesh);
  const gaps = Number(form.totalTakzivCoachAdam) - Number(form.coachAdam);
  const gapNum = Number(gaps) || 0;
  const gapDisplay = formatGapDisplay(gapNum, Number(form.totalTakzivCoachAdam));
  const gapStatus = getGapStatus(gapNum, Number(form.totalTakzivCoachAdam));

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.projectName.trim()) newErrors.projectName = true;
    if (!form.yechidaMevatzat.trim()) newErrors.yechidaMevatzat = true;
    if (!form.agaff.trim()) newErrors.agaff = true;
    if (Number(form.totalTakzivRechesh) === 0) newErrors.totalTakzivRechesh = true;
    if (Number(form.totalTakzivCoachAdam) === 0) newErrors.totalTakzivCoachAdam = true;
    if (Number(form.coachAdam) === 0) newErrors.coachAdam = true;

    const detailFields = ['projectName', 'yechidaMevatzat', 'agaff'];
    const budgetFields = ['totalTakzivRechesh', 'totalTakzivCoachAdam', 'coachAdam'];
    const hasDetailError = Object.keys(newErrors).some((field) => detailFields.includes(field));
    const hasBudgetError = Object.keys(newErrors).some((field) => budgetFields.includes(field));

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (hasDetailError) {
        setTab('פרטים');
      } else if (hasBudgetError) {
        setTab('תקציב');
      }
      return;
    }

    setErrors({});
    await onSubmit({ ...initialData, ...form });
  };

  return (
    <div>
      <div className="np-tabs" role="tablist">
        {['פרטים', 'תקציב'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`np-tab${tab === t ? ' np-tab--active' : ''}`}
            aria-selected={tab === t}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="np-panels">
        <div className={`np-panel${tab === 'פרטים' ? ' np-panel--active' : ''}`} aria-hidden={tab !== 'פרטים'}>
          <div className="np-field">
            <label className="np-label">שם הפרויקט *</label>
            <input className={`np-input${errors.projectName ? ' np-input--error' : ''}`} value={form.projectName} onChange={(e) => set('projectName', e.target.value)} />
          </div>

          <div className="np-row">
            <div className="np-field">
              <label className="np-label">יחידת פיתוח *</label>
              <select className={`np-select${errors.yechidaMevatzat ? ' np-input--error' : ''}`} value={form.yechidaMevatzat} onChange={(e) => set('yechidaMevatzat', e.target.value)}>
                <option value="">בחר יחידת פיתוח</option>
                {yechidaMevatzatOptions.filter(o => o.value !== "__all__").map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="np-field">
              <label className="np-label">אגף מבצע *</label>
                <select className={`np-select${errors.agaff ? ' np-input--error' : ''}`} value={form.agaff} onChange={(e) => set('agaff', e.target.value)}>
                <option value="">בחר אגף</option>
                {agaffOptions.filter(o => o.value !== "__all__").map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="np-row">
            <div className="np-field">
              <label className="np-label">סטטוס פרויקט</label>
              <select className="np-select" value={form.active} onChange={(e) => set('active', e.target.value === 'true')}>
                <option value="true">פעיל</option>
                <option value="false">לא פעיל</option>
              </select>
            </div>
          </div>

          <div className="np-row">
            <div className="np-field">
              <label className="np-label">המשכי</label>
              <select className="np-select" value={form.logHemsheci} onChange={(e) => set('logHemsheci', e.target.value === 'true')}>
                <option value="false">לא</option>
                <option value="true">כן</option>
              </select>
            </div>
            <div className="np-field">
              <label className="np-label">מסלול *</label>
              <select className="np-select" value={form.maslol} onChange={(e) => set('maslol', e.target.value)}>
                <option value="">בחר מסלול</option>
                {MASLOL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="np-field">
            <label className="np-label">תיאור הפרויקט</label>
            <textarea rows={4} className="np-textarea" value={form.teur} onChange={(e) => set('teur', e.target.value)} />
          </div>

          <div className="np-field np-field--last">
            <label className="np-label">הערות</label>
            <textarea rows={2} className="np-textarea" value={form.hearot} onChange={(e) => set('hearot', e.target.value)} />
          </div>
        </div>

        <div className={`np-panel${tab === 'תקציב' ? ' np-panel--active' : ''}`} aria-hidden={tab !== 'תקציב'}>
          <div className="np-row">
            <div className="np-field">
              <label className="np-label">{PROCUREMENT_BUDGET_LABEL} (₪) *</label>
              <input type="number" className={`np-input${errors.totalTakzivRechesh ? ' np-input--error' : ''}`} value={form.totalTakzivRechesh} onFocus={() => handleNumFocus('totalTakzivRechesh')} onBlur={() => handleNumBlur('totalTakzivRechesh')} onChange={(e) => set('totalTakzivRechesh', e.target.value)} />
            </div>
            <div className="np-field">
              <label className="np-label">{HR_BUDGET_LABEL} (₪) *</label>
              <input type="number" className={`np-input${errors.totalTakzivCoachAdam ? ' np-input--error' : ''}`} value={form.totalTakzivCoachAdam} onFocus={() => handleNumFocus('totalTakzivCoachAdam')} onBlur={() => handleNumBlur('totalTakzivCoachAdam')} onChange={(e) => set('totalTakzivCoachAdam', e.target.value)} />
            </div>
          </div>

          <div className="np-field">
            <label className="np-label">{TOTAL_BUDGET_LABEL} (אוטומטי)</label>
            <input className="np-input" readOnly value={`₪${totalBudget}`} style={{ backgroundColor: "#f9fafb", color: "#374151" }} />
          </div>

          <div className="np-row np-field--last">
            <div className="np-field" style={{ marginBottom: 0 }}>
              <label className="np-label">{GAPS_LABEL} (אוטומטי)</label>
              <input
                className={`np-input pc-gap ${GAP_CLASSES[gapStatus]}`}
                readOnly
                value={gapDisplay}
                style={{ backgroundColor: "#f9fafb" }}
              />
            </div>
            <div className="np-field" style={{ marginBottom: 0 }}>
              <label className="np-label">{PLANNED_HR_LABEL} (₪) *</label>
              <input type="number" className={`np-input${errors.coachAdam ? ' np-input--error' : ''}`} value={form.coachAdam} onFocus={() => handleNumFocus('coachAdam')} onBlur={() => handleNumBlur('coachAdam')} onChange={(e) => set('coachAdam', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="np-actions">
        <button type="button" className="np-btn-cancel" onClick={onCancel}>ביטול</button>
        <button type="button" className="np-btn-submit" onClick={handleSubmit}>{mode === 'edit' ? 'עדכן פרויקט' : 'הוסף פרויקט'}</button>
      </div>
    </div>
  );
}
