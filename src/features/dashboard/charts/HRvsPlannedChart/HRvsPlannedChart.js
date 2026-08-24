import React, { useMemo } from 'react';
import './HRvsPlannedChart.css';
import BudgetNumbers from '../BudgetNumbers/BudgetNumbers';
import { useProjects } from '../../../../services/context/ProjectsContext';
import SegmentProjectsModal from '../../SegmentProjectsModal/SegmentProjectsModal';
import { getGapStatus, formatGapDisplay, hasMissingPlannedHrValue } from '../../../../utils/calculateProjectFinanceHelper';
import { BUDGET_COLORS, INITIAL_VISIBLE_PROJECTS_COUNT } from '../../constans/chartConstants';

const HRP_LEGEND_ITEMS = [
  { label: 'כ"א', color: BUDGET_COLORS.HR },
  { label: 'רכש', color: BUDGET_COLORS.PROC },
  { label: 'תכנון', color: BUDGET_COLORS.PLANNED },
];

export default function HrVsPlannedChart({
  sorted,
  visibleProjects,
  showMore,
  hiddenCount,
  hasExpandableProjects,
  toggleShowMore,
}) {
  const { filteredProjects, setSelectedProjectId } = useProjects();
  const openProjectDetail = (id) => setSelectedProjectId(id);
  const maxProjectBudget = useMemo(
    () => Math.max(...filteredProjects.map((p) => Math.max(p.totalTakzivCoachAdam || 0, p.totalTakzivRechesh || 0, p.coachAdam || 0)), 1),
    [filteredProjects],
  );

  return (
    <div className="hrp-card">
      <div className="hrp-header">
        <div>
          <span className="hrp-title">תקציב כ"א ורכש VS תכנון כ"א לפי פרויקט</span>
          <div className="hrp-legend">
            {HRP_LEGEND_ITEMS.map(({ label, color }) => (
              <span key={label} className="hrp-legend-item">
                <span className="hrp-legend-dot" style={{ background: color }} />{label}
              </span>
            ))}
          </div>
        </div>

        <div className="hrp-header-right">
          <div className="hrp-actions">
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

      <div className="hrp-info">
        {sorted.length === 0 ? (
          <div className="hrp-note">אין פרויקטים להצגה.</div>
        ) : (
          <div className="hrp-note">הפרויקטים מוצגים לפי הפער היחסי הגדול ביותר. לחץ על פרויקט לקבלת פרטים נוספים.</div>
        )}
      </div>

      <div className="hrp-rows">
        {visibleProjects.map(project => {
          const hrBudget = project.totalTakzivCoachAdam || 0;
          const procBudget = project.totalTakzivRechesh || 0;
          const planned = project.coachAdam || 0;
          const difference = hrBudget - planned;
          const plannedMissing = hasMissingPlannedHrValue(planned);
          const gapStatus = getGapStatus(difference, hrBudget); // 'takin' | 'odef' | 'geraon'
          const differenceClass = plannedMissing
            ? 'hrp-missing'
            : (gapStatus === 'takin' ? 'hrp-neutral' : gapStatus === 'odef' ? 'hrp-surplus' : 'hrp-over');
          const differenceLabel = formatGapDisplay(difference, hrBudget, { plannedValue: planned });

          return (
            <div
              key={project.id}
              className="hrp-row"
              role="button"
              tabIndex={0}
              onClick={() => openProjectDetail(project.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openProjectDetail(project.id);
                }
              }}
              aria-label={`פתח פרטי פרויקט ${project.projectName}`}
            >
              <div className="hrp-lbl" title={project.projectName}>{project.projectName}</div>
              <div className="hrp-bars">
                {[[hrBudget, BUDGET_COLORS.HR], [procBudget, BUDGET_COLORS.PROC], [planned, BUDGET_COLORS.PLANNED]].map(([val, color]) => (
                  <div key={`bar-${color}`} className="hrp-track">
                    <div className="hrp-fill" style={{ width: `${Math.round(val / maxProjectBudget * 100)}%`, background: color }} />
                  </div>
                ))}
                <BudgetNumbers
                  gapLabel={differenceLabel}
                  gapClass={differenceClass}
                  hrBudget={hrBudget}
                  procurementBudget={procBudget}
                  planningBudget={planned}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal rendered globally in App — chart only triggers selection */}

    </div>
  );
}
