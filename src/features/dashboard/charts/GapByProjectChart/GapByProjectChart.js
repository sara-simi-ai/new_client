import React, { useMemo } from 'react';
import './GapByProjectChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import Modal from '../../../../components/Modal/Modal';
import ProjectDetail from '../../../projects/ProjectDetail/ProjectDetail';
import { computeBudgetMinusPlanned, computeRelativeGap, isGapStatusExceeded, formatGapDisplay } from '../../../../utils/calculateProjectFinanceHelper';
import { useProjectDetail } from '../../hooks/useProjectDetail';

const MAX_BAR_PERCENT = 42;

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
                <div
                  className="gap-bar"
                  style={{
                    [isPos ? 'left' : 'right']: '50%',
                    width: `${effPct}%`,
                    background: barColor,
                  }}
                />
              </div>

              <div className="gap-value">{valueLabel}</div>
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
