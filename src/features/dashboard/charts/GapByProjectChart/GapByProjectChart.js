import React, { useMemo } from 'react';
import './GapByProjectChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import Modal from '../../../../components/Modal/Modal';
import ProjectDetail from '../../../projects/ProjectDetail/ProjectDetail';
import { computeBudgetMinusPlanned, computeRelativeGap, isGapStatusExceeded, formatGapDisplay } from '../../../../utils/calculateProjectFinanceHelper';
import { useProjectDetail } from '../../hooks/useProjectDetail';

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

export default function GapByProjectChart({
  sorted,
  visibleProjects,
  showMore,
  hiddenCount,
  hasExpandableProjects,
  toggleShowMore,
}) {
  const { filteredProjects } = useProjects();
  const { selectedProject, openProjectDetail, closeProjectDetail } = useProjectDetail(filteredProjects);

  const maxRelativeGap = useMemo(
    () => Math.max(...sorted.map((p) => computeRelativeGap(p)), 1),
    [sorted],
  );

  return (
    <div className="gap-card">
      <div className="gap-header">
        <div>
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
        <div className="gap-header-right">
          <div className="gap-actions">
            {hasExpandableProjects ? (
              <button
                type="button"
                className="gap-action-btn"
                onClick={toggleShowMore}
                aria-label={showMore ? 'הצג פחות פרויקטים' : 'הצג פרויקטים נוספים'}
              >
                {showMore ? 'הסתר' : 'הצג עוד'}
              </button>
            ) : (
              <span className="gap-action-btn" aria-hidden="true">הכל מוצג</span>
            )}
          </div>
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

    </div>
  );
}
