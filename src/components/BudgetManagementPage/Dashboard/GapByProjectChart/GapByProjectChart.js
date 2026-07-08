import React, { useState } from 'react';
import './GapByProjectChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import ProjectDetailModal from '../../../Common/ProjectDetailModal';
import { computeBudgetMinusPlanned, computeRelativeGap, isProjectShownInGapChart, isGapStatusExceeded } from '../dashUtils/dashUtils';

export default function GapByProjectChart() {
  const { projects } = useProjects();
  const [showMore, setShowMore] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const openProjectDetail = (id) => setSelectedProjectId(id);
  const closeProjectDetail = () => setSelectedProjectId(null);

  const sorted = [...projects].sort((a, b) => {
    const relDiff = computeRelativeGap(b) - computeRelativeGap(a);
    return relDiff !== 0 ? relDiff : computeBudgetMinusPlanned(b) - computeBudgetMinusPlanned(a);
  });

  const maxRelativeGap = Math.max(...sorted.map((p) => computeRelativeGap(p)), 1);
  const MAX_BAR_PCT = 42;
  const GAP_COLORS = {
    negative: '#dc2626',
    positive: '#f97316',
    none: 'var(--blue)',
  };

  const gapLegend = [
    { label: 'חריגה במינוס', color: GAP_COLORS.negative },
    { label: 'חריגה בפלוס', color: GAP_COLORS.positive },
    { label: 'ללא חריגה', color: GAP_COLORS.none },
  ];

  const highGapProjects = sorted.filter((p) => isProjectShownInGapChart(p));

  const lowGapProjects = sorted.filter((p) => !highGapProjects.includes(p));

  const visibleProjects = showMore ? [...highGapProjects, ...lowGapProjects] : highGapProjects;
  const hiddenCount = lowGapProjects.length;
  const hasExpandableProjects = lowGapProjects.length > 0;

  return (
    <div className="gap-card">
      <div className="gap-header">
        <span className="gap-title">פערים לפי פרויקט (תקציב כ"א − תכנון)</span>
        <div className="gap-legend">
          {gapLegend.map((item) => (
            <span key={item.label} className="gap-legend-item">
              <span className="gap-legend-dot" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="gap-info flex flex-col gap-2 mb-3">
        {highGapProjects.length === 0 ? (
          <div className="text-right text-sm text-slate-600">
            אין כרגע פרויקטים עם פער של יותר מ‑40%. לחץ על ההרחבה כדי לראות את כל הפרויקטים.
          </div>
        ) : (
          <div className="text-right text-sm text-slate-600">לחץ על פרויקט כדי לראות פרטים נוספים.</div>
        )}
      </div>

      <div className="gap-rows">
        {visibleProjects.map((p) => {
          const g = computeBudgetMinusPlanned(p);
          const rel = computeRelativeGap(p);
          const pct = Math.round((rel / maxRelativeGap) * MAX_BAR_PCT);
          const isPos = g >= 0;
          const isExceed = isGapStatusExceeded(p);
          let barColor = 'var(--blue)'; // default blue
          if (isExceed) barColor = isPos ? '#f97316' : '#dc2626';

          const relativePercent = Math.round(rel * 100);
          let valueLabel;
          if (g === 0) {
            valueLabel = `0%`;
          } else if (isExceed) {
            valueLabel = `חריגה ${isPos ? '▲' : '▼'} ${relativePercent}%`;
          } else {
            valueLabel = `${isPos ? '+' : '−'}${relativePercent}%`;
          }

          const effPct = Math.min(pct, MAX_BAR_PCT);
          const offset = 1.1;

          return (
            <div
              key={p.id}
              className="gap-row"
              role="button"
              tabIndex={0}
              onClick={() => openProjectDetail(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openProjectDetail(p.id);
                }
              }}
              aria-label={`פתח פרטי פרויקט ${p.projectName}`}
            >
              <div className="gap-lbl" title={p.projectName}>{p.projectName}</div>
              <div className="gap-axis">
                <div className="gap-zero" />
                <div
                  className="gap-bar"
                  style={{
                    [isPos ? 'left' : 'right']: '50%',
                    width: `${effPct}%`,
                    background: barColor,
                  }}
                />
                <span
                  className="gap-val"
                  style={{
                    [isPos ? 'left' : 'right']: `calc(50% + ${effPct}% + ${offset}rem)`,
                  }}
                >
                  {valueLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={closeProjectDetail} />
      )}

      {hasExpandableProjects && (
        <div className="gap-footer mt-4 flex items-center justify-between gap-3">
          <div className="text-right text-sm text-slate-600">
            {showMore
              ? 'לחץ שוב כדי להסתיר פרויקטים נוספים.'
              : `עוד ${hiddenCount} פרויקטים זמינים בהרחבה.`}
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            onClick={() => setShowMore((prev) => !prev)}
            aria-label={showMore ? 'הצג פחות פרויקטים' : 'הצג פרויקטים נוספים'}
          >
            <span
              className="transition-transform duration-200"
              style={{ transform: showMore ? 'rotate(225deg)' : 'rotate(45deg)' }}
            >
              ⇔
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
