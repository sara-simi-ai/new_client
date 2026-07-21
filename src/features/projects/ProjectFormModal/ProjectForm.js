import React, { useState, useEffect, useMemo } from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { useAgaff } from "../../../services/context/AgaffContext";
import { useTsevetMevatzeat } from "../../../services/context/TsevetMevatzeatContext";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { formatGapDisplay, getGapStatus } from "../../../utils/calculateProjectFinanceHelper";
import { GAP_STATUS_BY_VALUE, MASLOL_OPTIONS, PROCUREMENT_BUDGET_LABEL, HR_BUDGET_LABEL, TOTAL_BUDGET_LABEL, GAPS_LABEL, PLANNED_HR_LABEL } from "../../../utils/Dec";
import { formatNumberWithSeparators, parseFormattedNumber } from "../../../utils/formatMoneyHelper";
import { getOptionKey, getOptionLabel } from "../../../utils/optionHelpers";
import "./ProjectFormModal.css";

export default function ProjectForm({ initialData = {}, mode = "new", onSubmit, onCancel }) {
  const { agaffOptions: fallbackAgaffOptions, yechidaMevatzatOptions: fallbackYechidaOptions } = useProjects();
  const { agaffOptions } = useAgaff();
  const { tsevetMevatzeatOptions } = useTsevetMevatzeat();

  const effectiveAgaffOptions = useMemo(() => {
    if (agaffOptions && agaffOptions.length > 0) {
      return agaffOptions;
    }
    return fallbackAgaffOptions || [];
  }, [agaffOptions, fallbackAgaffOptions]);

  const effectiveYechidaOptions = useMemo(() => {
    if (tsevetMevatzeatOptions && tsevetMevatzeatOptions.length > 0) {
      return tsevetMevatzeatOptions;
    }
    return fallbackYechidaOptions || [];
  }, [tsevetMevatzeatOptions, fallbackYechidaOptions]);
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

  const resolveOptionValue = (initialValue, initialLabel, options) => {
    if (!initialValue && !initialLabel) return "";

    const normalizedInitial = String(initialValue || initialLabel || "").trim();
    const normalizedLabel = String(initialLabel || initialValue || "").trim();

    const match = options?.find((option) => {
      const optionKey = String(getOptionKey(option));
      const optionLabel = String(getOptionLabel(option));
      return (
        optionKey === normalizedInitial ||
        optionLabel === normalizedInitial ||
        optionKey === normalizedLabel ||
        optionLabel === normalizedLabel
      );
    });

    return match ? getOptionKey(match) : initialValue || initialLabel || "";
  };

  useEffect(() => {
    if (initialData) {
      console.log(initialData.agaff,initialData.agaffName);
      
      setForm((prev) => ({
        ...prev,
        projectName: initialData.projectName || "",
        agaff: initialData.agaff || initialData.agaffName || "",
        yechidaMevatzat: initialData.yechidaMevatzat || initialData.tsevetMevatseaName || "",
        maslol: initialData.maslol || MASLOL_OPTIONS[0].value,
        logHemsheci: initialData.logHemsheci || false,
        teur: initialData.teur || "",
        hearot: initialData.hearot || "",
        totalTakzivCoachAdam: Number(initialData.totalTakzivCoachAdam || 0),
        totalTakzivRechesh: Number(initialData.totalTakzivRechesh || 0),
        coachAdam: Number(initialData.coachAdam || 0),
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) return;

    setForm((prev) => {
      const resolvedAgaff = resolveOptionValue(
        initialData.agaff,
        initialData.agaffName,
        effectiveAgaffOptions
      );
      const resolvedYechida = resolveOptionValue(
        initialData.yechidaMevatzat,
        initialData.tsevetMevatseaName,
        effectiveYechidaOptions
      );

      if (prev.agaff === resolvedAgaff && prev.yechidaMevatzat === resolvedYechida) {
        return prev;
      }

      return {
        ...prev,
        agaff: resolvedAgaff,
        yechidaMevatzat: resolvedYechida,
      };
    });
  }, [initialData, effectiveAgaffOptions, effectiveYechidaOptions]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleNumFocus = (field) => {
    if (Number(form[field]) === 0) set(field, "");
  };

  const handleNumBlur = (field) => {
    const numValue = parseFormattedNumber(form[field]);
    set(field, numValue);
  };

  const handleNumChange = (field, value) => {
    set(field, value);
  };

  const getDisplayValue = (fieldValue) => {
    if (fieldValue === "" || fieldValue === null || fieldValue === undefined) {
      return "";
    }
    
    // If it looks like a raw number, format it
    const numValue = parseFormattedNumber(fieldValue);
    if (numValue === 0) return "";
    return formatNumberWithSeparators(numValue);
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
    const { active, ...payload } = { ...initialData, ...form };
    await onSubmit(payload);
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
              <Dropdown
                className={errors.yechidaMevatzat ? 'np-input--error' : ''}
                label="בחר יחידת פיתוח"
                allLabel="בחר יחידת פיתוח"
                options={effectiveYechidaOptions.filter((o) => o.value !== '__all__')}
                selected={form.yechidaMevatzat}
                onChange={(next) => set('yechidaMevatzat', next)}
                multi={false}
              />
            </div>
            <div className="np-field">
              <label className="np-label">אגף מבצע *</label>
              <Dropdown
                className={errors.agaff ? 'np-input--error' : ''}
                label="בחר אגף"
                allLabel="בחר אגף"
                options={effectiveAgaffOptions.filter((o) => o.value !== '__all__')}
                selected={form.agaff}
                onChange={(next) => set('agaff', next)}
                multi={false}
              />
            </div>
          </div>

          <div className="np-row">
            <div className="np-field">
              <label className="np-label">המשכי</label>
              <Dropdown
                label="בחר המשכי"
                allLabel="בחר המשכי"
                options={[
                  { value: 'false', label: 'לא' },
                  { value: 'true', label: 'כן' },
                ]}
                selected={form.logHemsheci.toString()}
                onChange={(next) => set('logHemsheci', next === 'true')}
                valueToLabel={(v) => (v === 'true' ? 'כן' : v === 'false' ? 'לא' : 'בחר המשכי')}
                multi={false}
              />
            </div>
            <div className="np-field">
              <label className="np-label">מסלול *</label>
              <Dropdown
                label="בחר מסלול"
                allLabel="בחר מסלול"
                options={MASLOL_OPTIONS}
                selected={form.maslol}
                onChange={(next) => set('maslol', next)}
                multi={false}
              />
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
              <input type="text" inputMode="numeric" className={`np-input${errors.totalTakzivRechesh ? ' np-input--error' : ''}`} value={getDisplayValue(form.totalTakzivRechesh)} onFocus={() => handleNumFocus('totalTakzivRechesh')} onBlur={() => handleNumBlur('totalTakzivRechesh')} onChange={(e) => handleNumChange('totalTakzivRechesh', e.target.value)} />
            </div>
            <div className="np-field">
              <label className="np-label">{HR_BUDGET_LABEL} (₪) *</label>
              <input type="text" inputMode="numeric" className={`np-input${errors.totalTakzivCoachAdam ? ' np-input--error' : ''}`} value={getDisplayValue(form.totalTakzivCoachAdam)} onFocus={() => handleNumFocus('totalTakzivCoachAdam')} onBlur={() => handleNumBlur('totalTakzivCoachAdam')} onChange={(e) => handleNumChange('totalTakzivCoachAdam', e.target.value)} />
            </div>
          </div>

          <div className="np-field">
            <label className="np-label">{TOTAL_BUDGET_LABEL} (אוטומטי)</label>
            <input className="np-input" readOnly value={`₪${formatNumberWithSeparators(totalBudget)}`} style={{ backgroundColor: "#f9fafb", color: "#374151" }} />
          </div>

          <div className="np-row np-field--last">
            <div className="np-field" style={{ marginBottom: 0 }}>
              <label className="np-label">{GAPS_LABEL} (אוטומטי)</label>
              <input
                className={`np-input pc-gap ${GAP_STATUS_BY_VALUE[gapStatus]?.className || ""}`}
                readOnly
                value={gapDisplay}
                style={{ backgroundColor: "#f9fafb" }}
              />
            </div>
            <div className="np-field" style={{ marginBottom: 0 }}>
              <label className="np-label">{PLANNED_HR_LABEL} (₪) *</label>
              <input type="text" inputMode="numeric" className={`np-input${errors.coachAdam ? ' np-input--error' : ''}`} value={getDisplayValue(form.coachAdam)} onFocus={() => handleNumFocus('coachAdam')} onBlur={() => handleNumBlur('coachAdam')} onChange={(e) => handleNumChange('coachAdam', e.target.value)} />
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