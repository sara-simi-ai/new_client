import React, { useMemo, useState } from 'react';
import './BudgetByDepartmentChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import { BUDGET_COLORS, INITIAL_VISIBLE_PROJECTS_COUNT } from '../../constans/chartConstants';
import { formatMoney } from '../../../../utils/formatMoneyHelper';
import DepartmentProjectsModal from './DepartmentProjectsModal/DepartmentProjectsModal';

const legendItems = [
  { label: 'כ"א', color: BUDGET_COLORS.HR },
  { label: 'רכש', color: BUDGET_COLORS.PROC },
  { label: 'תכנון', color: BUDGET_COLORS.PLANNED }
];

export default function BudgetByDepartmentChart() {
  const { filteredProjects } = useProjects();
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const departmentsData = useMemo(() => {
    const departmentMap = new Map();

    filteredProjects.forEach(project => {
      const department = project.machlakaName || project.MachlakaName || project.machlaka || 'ללא מחלקה';
      if (!department) return;

      const current = departmentMap.get(department) ?? {
        department,
        hrBudget: 0,
        procurementBudget: 0,
        planningBudget: 0
      };

      current.hrBudget += project.totalTakzivCoachAdam || 0;
      current.procurementBudget += project.totalTakzivRechesh || 0;
      current.planningBudget += project.coachAdam || 0;

      departmentMap.set(department, current);
    });

    return Array.from(departmentMap.values())
      .sort((a, b) => {
        const gapA = (a.hrBudget - a.planningBudget) / Math.max(a.hrBudget, 1);
        const gapB = (b.hrBudget - b.planningBudget) / Math.max(b.hrBudget, 1);
        return Math.abs(gapB) - Math.abs(gapA);
      });
  }, [filteredProjects]);

  const visibleDepartments = useMemo(
    () => (showMore ? departmentsData : departmentsData.slice(0, INITIAL_VISIBLE_PROJECTS_COUNT)),
    [showMore, departmentsData],
  );

  const hasExpandableDepartments = departmentsData.length > INITIAL_VISIBLE_PROJECTS_COUNT;

  return (
    <div className="bdc-card">
      <div className="bdc-header">
        <div>
          <span className="bdc-title">תקציב לפי מחלקה</span>
          <div className="bdc-legend">
            {legendItems.map(({ label, color }) => (
              <span key={label} className="bdc-legend-item">
                <span className="bdc-legend-dot" style={{ background: color }} />{label}
              </span>
            ))}
          </div>
        </div>

        <div className="bdc-header-right">
          <div className="bdc-actions">
            {hasExpandableDepartments ? (
              <button
                type="button"
                className="gap-action-btn"
                onClick={() => setShowMore((prev) => !prev)}
                aria-label={showMore ? 'הצג פחות מחלקות' : 'הצג מחלקות נוספות'}
              >
                {showMore ? 'הסתר' : 'הצג עוד'}
              </button>
            ) : (
              <span className="gap-action-btn" aria-hidden="true">הכל מוצג</span>
            )}
          </div>
        </div>
      </div>

      <div className="bdc-info">
        {departmentsData.length === 0 ? (
          <div className="bdc-note">אין מחלקות להצגה.</div>
        ) : (
          <div className="bdc-note"> לחץ על מחלקה לקבלת פרטים נוספים.</div>
        )}
      </div>

      <div className="bdc-rows">
        {visibleDepartments.map(department => {
          const hrBudget = department.hrBudget || 0;
          const procBudget = department.procurementBudget || 0;
          const planned = department.planningBudget || 0;
          const maxDepartmentBudget = Math.max(hrBudget, procBudget, planned, 1);

          return (
            <div
              key={department.department}
              className="bdc-row"
              role="button"
              tabIndex={0}
              onClick={() => setActiveDepartment(department.department)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveDepartment(department.department);
                }
              }}
              aria-label={`פתח פרטי מחלקה ${department.department}`}
            >
              <div className="bdc-lbl" title={department.department}>{department.department}</div>
              <div className="bdc-bars">
                <div className="bdc-bar-group">
                  <div className="bdc-bar-info">כ"א ₪{formatMoney(hrBudget)}</div>
                  <div className="bdc-track">
                    <div
                      className="bdc-fill"
                      style={{
                        width: `${Math.max((hrBudget / maxDepartmentBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.HR,
                      }}
                    />
                  </div>
                </div>
                <div className="bdc-bar-group">
                  <div className="bdc-bar-info">תכנון ₪{formatMoney(planned)}</div>
                  <div className="bdc-track">
                    <div
                      className="bdc-fill"
                      style={{
                        width: `${Math.max((planned / maxDepartmentBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.PLANNED,
                      }}
                    />
                  </div>
                </div>
                <div className="bdc-bar-group">
                  <div className="bdc-bar-info">רכש ₪{formatMoney(procBudget)}</div>
                  <div className="bdc-track">
                    <div
                      className="bdc-fill"
                      style={{
                        width: `${Math.max((procBudget / maxDepartmentBudget) * 100, 0)}%`,
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

      {activeDepartment && (
        <DepartmentProjectsModal
          departmentName={activeDepartment}
          projects={filteredProjects.filter(p => p.machlakaName === activeDepartment)}
          onClose={() => setActiveDepartment(null)}
        />
      )}
    </div>
  );
}
