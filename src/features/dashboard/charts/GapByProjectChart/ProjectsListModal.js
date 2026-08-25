import React, { useMemo, useState } from 'react';
import Modal from '../../Modal/Modal';
import ProjectDetailModal from '../../../Common/ProjectDetailModal';
import { MASLOL_OPTIONS } from '../../../../constants/constants';
import { computeBudgetMinusPlanned, formatGapDisplay } from '../../../../../utils/calculateProjectFinance';
import { GapElement } from '../../../../components/GapElement/GapElement';
import { formatMoney } from '../../../../../utils/formatMoneyHelper';
import './ProjectsListModal.css';

export default function ProjectsListModal({ projects, onClose, initialFilters = {} }) {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [maslol, setMaslol] = useState(initialFilters.maslol || '');
  const [budgetType, setBudgetType] = useState(initialFilters.budgetType || 'all'); // all | hr | proc
  const [hemsheci, setHemsheci] = useState(initialFilters.hemsheci || 'all'); // all | yes | no
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    return (projects || []).filter((p) => {
      if (search) {
        const s = search.trim().toLowerCase();
        if (!(p.projectName?.toLowerCase().includes(s) || p.teur?.toLowerCase().includes(s))) return false;
      }
      if (maslol && String(p.maslol) !== String(maslol)) return false;
      if (hemsheci === 'yes' && p.logHemsheci !== true) return false;
      if (hemsheci === 'no' && p.logHemsheci !== false) return false;
      if (budgetType !== 'all') {
        const hr = Number(p.totalTakzivCoachAdam || 0);
        const proc = Number(p.totalTakzivRechesh || 0);
        if (budgetType === 'hr' && hr < proc) return false;
        if (budgetType === 'proc' && proc <= hr) return false;
      }
      return true;
    });
  }, [projects, search, maslol, budgetType, hemsheci]);

  if (!projects) return null;

  return (
    <Modal onClose={onClose} maxWidth="80%">
      <div className="pl-modal" dir="rtl">
        <div className="pl-header">
          <h3 className="pl-title">רשימת פרויקטים</h3>
          <button type="button" className="pl-close" onClick={onClose}>סגור</button>
        </div>

        {!selectedId && (
          <div className="pl-controls">
            <input
              placeholder="חיפוש בשם או בתיאור"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-input"
            />

            <div className="pl-filters">
              <select value={maslol} onChange={(e) => setMaslol(e.target.value)} className="pl-select">
                <option value="">כל המסלולים</option>
                  {MASLOL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select value={budgetType} onChange={(e) => setBudgetType(e.target.value)} className="pl-select">
                <option value="all">כל סוגי התקציב</option>
                <option value="hr">כ"א (תקציב כ"א גבוה יותר)</option>
                <option value="proc">רכש (תקציב רכש גבוה יותר)</option>
              </select>

              <select value={hemsheci} onChange={(e) => setHemsheci(e.target.value)} className="pl-select">
                <option value="all">כל הפרויקטים</option>
                <option value="yes">משכי</option>
                <option value="no">חדש</option>
              </select>
            </div>
          </div>
        )}

        <div className="pl-body">
          {!selectedId ? (
            <div className="pl-table">
              {filtered.length === 0 ? (
                <div className="pl-empty-message">לא נמצאו פרויקטים התואמים את המסננים.</div>
              ) : (
                filtered.map((p) => {
                  const gap = computeBudgetMinusPlanned(p);
                  return (
                    <div key={p.id} className="pl-row" role="button" tabIndex={0} onClick={() => setSelectedId(p.id)}>
                      <div className="pl-row-left">
                        <div className="pl-name">{p.projectName}</div>
                        <div className="pl-meta">{MASLOL_OPTIONS.find((o) => o.value === p.maslol)?.label || ''} • {p.machlaka || ''}</div>
                      </div>
                      <div className="pl-row-right"><GapElement financeData={{ pearim: gap, totalTakzivCoachAdam: p.totalTakzivCoachAdam }} /></div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="pl-detail">
              <button type="button" className="pl-back" onClick={() => setSelectedId(null)}>חזרה לרשימה</button>
              <ProjectDetailModal project={projects.find((x) => x.id === selectedId)} onClose={onClose} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
