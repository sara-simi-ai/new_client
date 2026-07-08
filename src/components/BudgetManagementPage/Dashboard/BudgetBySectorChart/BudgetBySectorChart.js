import React from 'react';
import './BudgetBySectorChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';

const COLOR_HR  = '#1e3a5f'; // כ"א — כחול כהה
const COLOR_PR  = '#3b82f6'; // רכש — כחול בינוני
const COLOR_PL  = '#93c5fd'; // תכנון — כחול בהיר

export default function BudgetBySectorChart() {
  const { projects } = useProjects();
  const sectors = [...new Set(projects.map(p => p.agaff))].filter(Boolean).sort();
  const maxTotal = Math.max(...sectors.map(s =>
    projects.filter(p => p.agaff === s).reduce((sum, p) => sum + (p.totalTakzuvCoachAdam || 0) + (p.totalTakzivRechesh || 0), 0)
  ), 1);

  const formatNumber = n => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(0)}K` : String(n);

  return (
    <div className="bbs-card">
      <div className="bbs-header">
        <span className="bbs-title">תקציב לפי אגף</span>
        <div className="bbs-legend">
          {[['כ"א', COLOR_HR], ['רכש', COLOR_PR], ['תכנון כ"א', COLOR_PL]].map(([lbl, c]) => (
            <span key={lbl} className="bbs-legend-item">
              <span className="bbs-legend-dot" style={{ background: c }} />{lbl}
            </span>
          ))}
        </div>
      </div>
      <div className="bbs-rows">
        {sectors.map(s => {
          const projectsInSector = projects.filter(p => p.agaff === s);
          const hrBudget = projectsInSector.reduce((sum, p) => sum + (p.totalTakzuvCoachAdam || 0), 0);
          const procurementBudget = projectsInSector.reduce((sum, p) => sum + (p.totalTakzivRechesh   || 0), 0);
          const planningBudget = projectsInSector.reduce((sum, p) => sum + (p.coachAdam            || 0), 0);
          const gapValue = hrBudget - planningBudget;
          const gapClass = gapValue > 0 ? 'bbs-gap--surplus' : gapValue < 0 ? 'bbs-gap--over' : 'bbs-gap--neutral';
          const gapLabel = gapValue === 0
            ? `₪0`
            : gapValue > 0
              ? `▲ ₪${formatNumber(gapValue)}`
              : `▼ ₪${formatNumber(Math.abs(gapValue))}`;

          return (
            <div key={s} className="bbs-row">
              <div className="bbs-lbl" title={s}>{s}</div>
              <div className="bbs-bars">
                {[[hrBudget, COLOR_HR], [procurementBudget, COLOR_PR], [planningBudget, COLOR_PL]].map(([val, c], i) => (
                  <div key={i} className="bbs-track">
                    <div className="bbs-fill" style={{ width: `${Math.round(val / maxTotal * 100)}%`, background: c }} />
                  </div>
                ))}
                <div className="bbs-nums">
                  <span className={`bbs-gap ${gapClass}`}>{gapLabel}</span>
                  <span>· כ"א ₪{formatNumber(hrBudget)}</span>
                  <span>· רכש ₪{formatNumber(procurementBudget)}</span>
                  <span>· תכנון ₪{formatNumber(planningBudget)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
