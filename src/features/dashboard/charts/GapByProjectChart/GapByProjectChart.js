import React, { useMemo } from 'react';
import './GapByProjectChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import Modal from '../../../../components/Modal/Modal';
import ProjectDetail from '../../../projects/ProjectDetail/ProjectDetail';
import { computeBudgetMinusPlanned, computeRelativeGap, compareByRelativeGap, isGapStatusExceeded, formatGapDisplay } from '../../../../utils/calculateProjectFinance';
import { useExpandableProjectList } from '../../hooks/useExpandableProjectList';
import { useProjectDetail } from '../../hooks/useProjectDetail';
import { INITIAL_VISIBLE_PROJECTS_COUNT } from '../../constans/chartConstants';

const MAX_VISIBLE_PROJECTS = INITIAL_VISIBLE_PROJECTS_COUNT;
const MAX_BAR_PERCENT = 42;
const LABEL_OFFSET_REM = 1.1;

const GAP_COLORS = {
  negative: 'var(--gap-negative)',
  positive: 'var(--gap-positive)',
  none: 'var(--gap-neutral)',
};

const gapLegend = [
  { label: 'חריגה במינוס', color: GAP_COLORS.negative },
  { label: 'חריגה בפלוס', color: GAP_COLORS.positive },
  { label: 'ללא חריגה', color: GAP_COLORS.none },
];

export default function GapByProjectChart() {
  const { filteredProjects } = useProjects();
  const { selectedProject, openProjectDetail, closeProjectDetail } = useProjectDetail(filteredProjects);

  const {
    sorted,
    showMore,
    toggleShowMore,
    visibleProjects,
    hiddenCount,
    hasExpandableProjects,
  } = useExpandableProjectList(filteredProjects, compareByRelativeGap, MAX_VISIBLE_PROJECTS);

  const maxRelativeGap = useMemo(
    () => Math.max(...sorted.map((p) => computeRelativeGap(p)), 1),
    [sorted],
  );

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
        {sorted.length === 0 ? (
          <div className="text-right text-sm text-slate-600">אין כרגע פרויקטים להצגה.</div>
        ) : (
          <div className="text-right text-sm text-slate-600">הפרויקטים מוצגים לפי הפער היחסי הגדול ביותר. לחץ על פרויקט לקבלת פרטים נוספים.</div>
        )}
      </div>

      <div className="gap-rows">
        {visibleProjects.map((p) => {
          const g = computeBudgetMinusPlanned(p);
          const rel = computeRelativeGap(p);
          const pct = Math.round((rel / maxRelativeGap) * MAX_BAR_PERCENT);
          const isPos = g >= 0;
          const isExceed = isGapStatusExceeded(p);
          let barColor = GAP_COLORS.none;
          if (isExceed) barColor = isPos ? GAP_COLORS.positive : GAP_COLORS.negative;

          const relativePercent = Math.round(rel * 100);
          const valueLabel = formatGapDisplay(g, p.totalTakzivCoachAdam);

          const effPct = Math.min(pct, MAX_BAR_PERCENT);

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
                    [isPos ? 'left' : 'right']: `calc(50% + ${effPct}% + ${LABEL_OFFSET_REM}rem)`,
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
        <Modal onClose={closeProjectDetail}>
          <ProjectDetail project={selectedProject} onClose={closeProjectDetail} />
        </Modal>
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
            onClick={toggleShowMore}
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
