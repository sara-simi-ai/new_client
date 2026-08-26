import React, { useState, useEffect, useMemo } from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { useAgaff } from "../../../services/context/AgaffContext";
import { useMachlaka } from "../../../services/context/MachlakaContext";
import { useChativa } from "../../../services/context/ChativaContext";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { MASLOL_OPTIONS, PROCUREMENT_BUDGET_LABEL, HR_BUDGET_LABEL, TOTAL_BUDGET_LABEL } from "../../../utils/Dec";
import { formatNumberWithSeparators, parseFormattedNumber } from "../../../utils/formatMoneyHelper";
import { getOptionKey, getOptionLabel } from "../../../utils/optionHelpers";
import "./ProjectFormModal.css";

export default function ProjectForm({ initialData = {}, mode = "new", onSubmit, onCancel }) {
  const { agaffOptions: fallbackAgaffOptions, machlakaOptions: fallbackMachlakaOptions } = useProjects();
  const { agaffOptions } = useAgaff();
  const { machlakaOptions } = useMachlaka();
  const { chativaOptions } = useChativa();

  const effectiveAgaffOptions = useMemo(() => {
    if (agaffOptions && agaffOptions.length > 0) {
      return agaffOptions;
    }
    return fallbackAgaffOptions || [];
  }, [agaffOptions, fallbackAgaffOptions]);

  const effectiveMachlakaOptions = useMemo(() => {
    if (machlakaOptions && machlakaOptions.length > 0) {
      return machlakaOptions;
    }
    return fallbackMachlakaOptions || [];
  }, [machlakaOptions, fallbackMachlakaOptions]);

  const effectiveChativaOptions = useMemo(() => {
    return chativaOptions || [];
  }, [chativaOptions]);

  const [form, setForm] = useState({
    projectName: "",
    agaff: "",
    machlaka: "",
    chativa: "",
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
        machlaka: initialData.machlaka || initialData.machlakaName || "",
        chativa: initialData.chativa || initialData.chativaName || initialData.ChativaName || "",
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
      const resolvedMachlaka = resolveOptionValue(
        initialData.machlaka,
        initialData.machlakaName,
        effectiveMachlakaOptions
      );
      const resolvedChativa = resolveOptionValue(
        initialData.chativa,
        initialData.chativaName,
        effectiveChativaOptions
      );

      if (
        prev.agaff === resolvedAgaff &&
        prev.machlaka === resolvedMachlaka &&
        prev.chativa === resolvedChativa
      ) {
        return prev;
      }

      return {
        ...prev,
        agaff: resolvedAgaff,
        machlaka: resolvedMachlaka,
        chativa: resolvedChativa,
      };
    });
  }, [initialData, effectiveAgaffOptions, effectiveMachlakaOptions, effectiveChativaOptions]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleNumFocus = (field) => {
    if (Number(form[field]) === 0) set(field, "");
  };

  const handleNumBlur = (field) => {
    const numValue = parseFormattedNumber(form[field]);
    set(field, numValue);
  };

  const handleNumChange = (field, value) => {
    // Parse input immediately for real-time budget calculation
    const numValue = parseFormattedNumber(value);
    set(field, numValue);
  };

  const getDisplayValue = (fieldValue) => {
    if (fieldValue === "" || fieldValue === null || fieldValue === undefined) {
      return "";
    }
    
    const numValue = Number(fieldValue) || 0;
    if (numValue === 0) return "";
    return formatNumberWithSeparators(numValue);
  };

  // Automatic budget calculation
  const parsedProcurement = parseFormattedNumber(form.totalTakzivRechesh);
  const parsedHr = parseFormattedNumber(form.totalTakzivCoachAdam);
  const totalBudget = parsedProcurement + parsedHr;
  const isValidBudgets = parsedProcurement > 0 && parsedHr > 0;

  const renderSelectField = ({ key, label, placeholder, errorKey, options, selected, onChange }) => (
    <div className="np-field np-field--compact" key={key}>
      <label className="np-label">{label}</label>
      <Dropdown
        className={errors[errorKey] ? 'np-input--error' : ''}
        label={placeholder}
        allLabel={placeholder}
        options={options.filter((o) => o.value !== '__all__')}
        selected={selected}
        onChange={onChange}
        multi={false}
      />
    </div>
  );

  const renderCurrencyField = ({ key, label, field, errorKey, readOnly = false, value }) => (
    <div className="np-field" key={key}>
      <label className="np-label">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        className={`np-input${errors[errorKey] ? ' np-input--error' : ''}${readOnly ? ' np-input--readonly' : ''}`}
        readOnly={readOnly}
        value={readOnly ? value : getDisplayValue(form[field])}
        onFocus={!readOnly ? () => handleNumFocus(field) : undefined}
        onBlur={!readOnly ? () => handleNumBlur(field) : undefined}
        onChange={!readOnly ? (event) => handleNumChange(field, event.target.value) : undefined}
        style={readOnly ? { backgroundColor: '#f9fafb', color: '#374151' } : undefined}
      />
    </div>
  );

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.projectName.trim()) newErrors.projectName = true;
    if (!form.machlaka.trim()) newErrors.machlaka = true;
    if (!form.agaff.trim()) newErrors.agaff = true;
    if (!form.chativa.trim()) newErrors.chativa = true;
    
    // Validate budgets
    if (parsedProcurement === 0) newErrors.totalTakzivRechesh = true;
    if (parsedHr === 0) newErrors.totalTakzivCoachAdam = true;

    const detailFields = ['projectName', 'machlaka', 'agaff', 'chativa'];
    const budgetFields = ['totalTakzivRechesh', 'totalTakzivCoachAdam'];
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
    const { active, ...payload } = { 
      ...initialData, 
      ...form,
      // Ensure we submit parsed numbers, not formatted strings
      totalTakzivRechesh: parseFormattedNumber(form.totalTakzivRechesh),
      totalTakzivCoachAdam: parseFormattedNumber(form.totalTakzivCoachAdam),
    };
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
          <div className="np-row np-row--two-col">
            <div className="np-field">
              <label className="np-label">שם הפרויקט *</label>
              <input className={`np-input${errors.projectName ? ' np-input--error' : ''}`} value={form.projectName} onChange={(e) => set('projectName', e.target.value)} />
            </div>
            {renderSelectField({
              key: 'agaff',
              label: 'אגף מבצע *',
              placeholder: 'בחר אגף',
              errorKey: 'agaff',
              options: effectiveAgaffOptions,
              selected: form.agaff,
              onChange: (next) => set('agaff', next),
            })}
          </div>

          <div className="np-row np-row--two-col">
            {renderSelectField({
              key: 'chativa',
              label: 'חטיבה *',
              placeholder: 'בחר חטיבה',
              errorKey: 'chativa',
              options: effectiveChativaOptions,
              selected: form.chativa,
              onChange: (next) => set('chativa', next),
            })}
            {renderSelectField({
              key: 'machlaka',
              label: 'מחלקה *',
              placeholder: 'בחר מחלקה',
              errorKey: 'machlaka',
              options: effectiveMachlakaOptions,
              selected: form.machlaka,
              onChange: (next) => set('machlaka', next),
            })}
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
            {renderCurrencyField({
              key: 'totalTakzivRechesh',
              label: `${PROCUREMENT_BUDGET_LABEL} (₪) *`,
              field: 'totalTakzivRechesh',
              errorKey: 'totalTakzivRechesh',
            })}
            {renderCurrencyField({
              key: 'totalTakzivCoachAdam',
              label: `${HR_BUDGET_LABEL} (₪) *`,
              field: 'totalTakzivCoachAdam',
              errorKey: 'totalTakzivCoachAdam',
            })}
          </div>

          <div className="np-field np-field--last">
            {renderCurrencyField({
              key: 'totalBudget',
              label: `${TOTAL_BUDGET_LABEL} (אוטומטי)`,
              field: 'totalBudget',
              errorKey: 'totalBudget',
              readOnly: true,
              value: `₪${formatNumberWithSeparators(totalBudget)}`,
            })}
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