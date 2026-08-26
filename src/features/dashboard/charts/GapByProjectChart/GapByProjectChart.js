import React, { useMemo } from 'react';
import './GapByProjectChart.css';
import { computeBudgetMinusPlanned, computeRelativeGap, isGapStatusExceeded, formatGapDisplay, hasMissingPlannedHrValue } from '../../../../utils/calculateProjectFinanceHelper';
import SegmentProjectsModal from '../../SegmentProjectsModal/SegmentProjectsModal';
import { useProjects } from '../../../../services/context/ProjectsContext';

const MAX_BAR_PERCENT = 42;
const LABEL_OFFSET_REM = 0.4;

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
  const { filteredProjects, setSelectedProjectId } = useProjects();
  const openProjectDetail = (id) => setSelectedProjectId(id);

  const maxRelativeGap = useMemo(() => {
    const rels = sorted.filter((p) => !hasMissingPlannedHrValue(p.coachAdam)).map((p) => computeRelativeGap(p));
    if (rels.length === 0) return 1;
    return Math.max(...rels, 1);
  }, [sorted]);

  return (
    <div className="gap-card">
      <div className="gap-header">
        <div className="gap-header-main">
          <span className="gap-title">פערים לפי פרויקט (תקציב כ&quot;א − תכנון)</span>
          <div className="gap-legend">
            {gapLegend.map((item) => (
              <span key={item.label} className="gap-legend-item">
                <span className="gap-legend-dot" style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="gap-rows">
        {visibleProjects.map((p) => {
          const g = computeBudgetMinusPlanned(p);
          const rel = computeRelativeGap(p);
          const pct = Math.round((rel / maxRelativeGap) * MAX_BAR_PERCENT);
          const isPos = g >= 0;
          const isExceed = isGapStatusExceeded(p);
          const plannedMissing = hasMissingPlannedHrValue(p.coachAdam);
          let barColor = GAP_COLORS.none;
          if (isExceed) barColor = isPos ? GAP_COLORS.positive : GAP_COLORS.negative;

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
                {!plannedMissing && (
                  <div
                    className="gap-bar"
                    style={{
                      [isPos ? 'left' : 'right']: '50%',
                      width: `${effPct}%`,
                      background: barColor,
                    }}
                  />
                )}
                <span
                  className="gap-val"
                  style={{
                    [isPos ? 'left' : 'right']: `calc(50% + ${effPct}% + ${LABEL_OFFSET_REM}rem)`,
                  }}
                >
                  {valueLabel}
                </span>
              </div>

              <div className="gap-value">{valueLabel}</div>
            </div>
          );
        })}
      </div>

      {/* Modal rendered globally in App — chart only triggers selection */}
      

    </div>
  );
}
