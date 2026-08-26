import React, { useMemo, useState } from 'react';
import './BudgetByUnitChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import { BUDGET_COLORS, INITIAL_VISIBLE_PROJECTS_COUNT } from '../../constans/chartConstants';
import { formatMoney } from '../../../../utils/formatMoneyHelper';
import UnitProjectsModal from './UnitProjectsModal/UnitProjectsModal';

const legendItems = [
  { label: 'כ"א', color: BUDGET_COLORS.HR },
  { label: 'רכש', color: BUDGET_COLORS.PROC },
  { label: 'תכנון', color: BUDGET_COLORS.PLANNED }
];

export default function BudgetByUnitChart() {
  const { filteredProjects } = useProjects();
  const [activeUnit, setActiveUnit] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const unitsData = useMemo(() => {
    const unitMap = new Map();

    filteredProjects.forEach(project => {
      const unit = project.chativaName || project.ChativaName || project.chativa || 'ללא חטיבה';
      if (!unit) return;

      const current = unitMap.get(unit) ?? {
        unit,
        hrBudget: 0,
        procurementBudget: 0,
        planningBudget: 0
      };

      current.hrBudget += project.totalTakzivCoachAdam || 0;
      current.procurementBudget += project.totalTakzivRechesh || 0;
      current.planningBudget += project.coachAdam || 0;

      unitMap.set(unit, current);
    });

    return Array.from(unitMap.values())
      .sort((a, b) => {
        const gapA = (a.hrBudget - a.planningBudget) / Math.max(a.hrBudget, 1);
        const gapB = (b.hrBudget - b.planningBudget) / Math.max(b.hrBudget, 1);
        return Math.abs(gapB) - Math.abs(gapA);
      });
  }, [filteredProjects]);

  const visibleUnits = useMemo(
    () => (showMore ? unitsData : unitsData.slice(0, INITIAL_VISIBLE_PROJECTS_COUNT)),
    [showMore, unitsData],
  );

  const hasExpandableUnits = unitsData.length > INITIAL_VISIBLE_PROJECTS_COUNT;

  const maxUnitBudget = useMemo(
    () => Math.max(...unitsData.map((u) => Math.max(u.hrBudget || 0, u.procurementBudget || 0, u.planningBudget || 0)), 1),
    [unitsData],
  );

  return (
    <div className="buc-card">
      <div className="buc-header">
        <div>
          <span className="buc-title">תקציב לפי חטיבה</span>
          <div className="buc-legend">
            {legendItems.map(({ label, color }) => (
              <span key={label} className="buc-legend-item">
                <span className="buc-legend-dot" style={{ background: color }} />{label}
              </span>
            ))}
          </div>
        </div>

        <div className="buc-header-right">
          <div className="buc-actions">
            {hasExpandableUnits ? (
              <button
                type="button"
                className="gap-action-btn"
                onClick={() => setShowMore((prev) => !prev)}
                aria-label={showMore ? 'הצג פחות חטיבות' : 'הצג חטיבות נוספות'}
              >
                {showMore ? 'הסתר' : 'הצג עוד'}
              </button>
            ) : (
              <span className="gap-action-btn" aria-hidden="true">הכל מוצג</span>
            )}
          </div>
        </div>
      </div>

      <div className="buc-info">
        {unitsData.length === 0 ? (
          <div className="buc-note">אין חטיבות להצגה.</div>
        ) : (
          <div className="buc-note"> לחץ על חטיבה לקבלת פרטים נוספים.</div>
        )}
      </div>

      <div className="buc-rows">
        {visibleUnits.map(unit => {
          const hrBudget = unit.hrBudget || 0;
          const procBudget = unit.procurementBudget || 0;
          const planned = unit.planningBudget || 0;

          return (
            <div
              key={unit.unit}
              className="buc-row"
              role="button"
              tabIndex={0}
              onClick={() => setActiveUnit(unit.unit)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveUnit(unit.unit);
                }
              }}
              aria-label={`פתח פרטי חטיבה ${unit.unit}`}
            >
              <div className="buc-lbl" title={unit.unit}>{unit.unit}</div>
              <div className="buc-bars">
                <div className="buc-bar-group">
                  <div className="buc-bar-info">כ"א ₪{formatMoney(hrBudget)}</div>
                  <div className="buc-track">
                    <div
                      className="buc-fill"
                      style={{
                        width: `${Math.max((hrBudget / maxUnitBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.HR,
                      }}
                    />
                  </div>
                </div>
                <div className="buc-bar-group">
                  <div className="buc-bar-info">תכנון ₪{formatMoney(planned)}</div>
                  <div className="buc-track">
                    <div
                      className="buc-fill"
                      style={{
                        width: `${Math.max((planned / maxUnitBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.PLANNED,
                      }}
                    />
                  </div>
                </div>
                <div className="buc-bar-group">
                  <div className="buc-bar-info">רכש ₪{formatMoney(procBudget)}</div>
                  <div className="buc-track">
                    <div
                      className="buc-fill"
                      style={{
                        width: `${Math.max((procBudget / maxUnitBudget) * 100, 0)}%`,
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

      {activeUnit && (
        <UnitProjectsModal
          unitName={activeUnit}
          projects={filteredProjects.filter(p => p.chativaName === activeUnit)}
          onClose={() => setActiveUnit(null)}
        />
      )}
    </div>
  );
}
