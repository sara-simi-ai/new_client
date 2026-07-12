import React, { useState, useEffect } from "react";
import { formatGapDisplay } from "../../../utils/calculateProjectFinance";
import "./ProjectFormModal.css";
import { AGAF_OPTIONS, MASLOL_OPTIONS, YECHIDA_MEVATSAAT_OPTIONS } from "../../../constants/constants"; 

export default function ProjectForm({ initialData = {}, mode = "new", onSubmit, onCancel }) {
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
  const gapColor = gapNum === 0 ? "#1e5f8e" : (gapNum > 0 ? "#059669" : "#dc2626");

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
                {YECHIDA_MEVATSAAT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="np-field">
              <label className="np-label">אגף מבצע *</label>
                <select className={`np-select${errors.agaff ? ' np-input--error' : ''}`} value={form.agaff} onChange={(e) => set('agaff', e.target.value)}>
                <option value="">בחר אגף</option>
                {AGAF_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
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
              <label className="np-label">תקציב רכש (₪) *</label>
              <input type="number" className={`np-input${errors.totalTakzivRechesh ? ' np-input--error' : ''}`} value={form.totalTakzivRechesh} onFocus={() => handleNumFocus('totalTakzivRechesh')} onBlur={() => handleNumBlur('totalTakzivRechesh')} onChange={(e) => set('totalTakzivRechesh', e.target.value)} />
            </div>
            <div className="np-field">
              <label className="np-label">תקציב כ"א (₪) *</label>
              <input type="number" className={`np-input${errors.totalTakzivCoachAdam ? ' np-input--error' : ''}`} value={form.totalTakzivCoachAdam} onFocus={() => handleNumFocus('totalTakzivCoachAdam')} onBlur={() => handleNumBlur('totalTakzivCoachAdam')} onChange={(e) => set('totalTakzivCoachAdam', e.target.value)} />
            </div>
          </div>

          <div className="np-field">
            <label className="np-label">סה"כ תקציב (אוטומטי)</label>
            <input className="np-input" readOnly value={`₪${totalBudget}`} style={{ backgroundColor: "#f9fafb", color: "#374151" }} />
          </div>

          <div className="np-row np-field--last">
            <div className="np-field" style={{ marginBottom: 0 }}>
              <label className="np-label">פערים (אוטומטי)</label>
              <input className="np-input" readOnly value={gapDisplay} style={{ backgroundColor: "#f9fafb", color: gapColor }} />
            </div>
            <div className="np-field" style={{ marginBottom: 0 }}>
              <label className="np-label">תכנון כ"א (₪) *</label>
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
