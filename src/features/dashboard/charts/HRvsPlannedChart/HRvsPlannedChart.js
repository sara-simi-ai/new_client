import React, { useMemo } from 'react';
import './HRvsPlannedChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import { formatMoney } from '../../../../utils/formatMoneyHelper';
import { BUDGET_COLORS, INITIAL_VISIBLE_PROJECTS_COUNT } from '../../constans/chartConstants';

const HRP_LEGEND_ITEMS = [
  { label: 'כ"א', color: BUDGET_COLORS.HR },
  { label: 'תכנון', color: BUDGET_COLORS.PLANNED },
  { label: 'רכש', color: BUDGET_COLORS.PROC }
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
          <span className="hrp-title">תקציב כ"א ורכש לעומת תכנון כ"א לפי פרויקט</span>
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
                <div className="hrp-bar-group">
                  <div className="hrp-bar-header">
                    <div className="hrp-bar-info">₪{formatMoney(hrBudget)}</div>
                    <span className="hrp-bar-label">כ"א</span>
                  </div>
                  <div className="hrp-track">
                    <div
                      className="hrp-fill"
                      style={{
                        width: `${Math.max((hrBudget / maxProjectBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.HR,
                      }}
                    />
                  </div>
                </div>
                <div className="hrp-bar-group">
                  <div className="hrp-bar-header">
                    <div className="hrp-bar-info">₪{formatMoney(planned)}</div>
                    <span className="hrp-bar-label">תכנון</span>
                  </div>
                  <div className="hrp-track">
                    <div
                      className="hrp-fill"
                      style={{
                        width: `${Math.max((planned / maxProjectBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.PLANNED,
                      }}
                    />
                  </div>
                </div>
                <div className="hrp-bar-group">
                  <div className="hrp-bar-header">
                    <div className="hrp-bar-info">₪{formatMoney(procBudget)}</div>
                    <span className="hrp-bar-label">רכש</span>
                  </div>
                  <div className="hrp-track">
                    <div
                      className="hrp-fill"
                      style={{
                        width: `${Math.max((procBudget / maxProjectBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.PROC,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal rendered globally in App — chart only triggers selection */}

    </div>
  );
}
