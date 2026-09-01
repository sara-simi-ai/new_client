import React, { useMemo, useState } from 'react';
import './BudgetBySectorChart.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import { BUDGET_COLORS, INITIAL_VISIBLE_PROJECTS_COUNT } from '../../constans/chartConstants';
import { formatMoney } from '../../../../utils/formatMoneyHelper';
import SegmentProjectsModal from '../../SegmentProjectsModal/SegmentProjectsModal';

const legendItems = [
  { label: 'כ"א', color: BUDGET_COLORS.HR },
  { label: 'רכש', color: BUDGET_COLORS.PROC },
  { label: 'תכנון', color: BUDGET_COLORS.PLANNED }
];

export default function BudgetBySectorChart() {
  const { filteredProjects } = useProjects();
  const [activeSector, setActiveSector] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const sectorsData = useMemo(() => {
    const sectorMap = new Map();

    filteredProjects.forEach(project => {
      const sector = project.agaffName || project.AgaffName || project.agaff || "";
      if (!sector) return;

      const current = sectorMap.get(sector) ?? {
        sector,
        hrBudget: 0,
        procurementBudget: 0,
        planningBudget: 0
      };

      current.hrBudget += project.totalTakzivCoachAdam || 0;
      current.procurementBudget += project.totalTakzivRechesh || 0;
      current.planningBudget += project.coachAdam || 0;

      sectorMap.set(sector, current);
    });

    return Array.from(sectorMap.values())
      .sort((a, b) => {
        const gapA = (a.hrBudget - a.planningBudget) / Math.max(a.hrBudget, 1);
        const gapB = (b.hrBudget - b.planningBudget) / Math.max(b.hrBudget, 1);
        return Math.abs(gapB) - Math.abs(gapA);
      });
  }, [filteredProjects]);

  const visibleSectors = useMemo(
    () => (showMore ? sectorsData : sectorsData.slice(0, INITIAL_VISIBLE_PROJECTS_COUNT)),
    [showMore, sectorsData],
  );

  const hasExpandableSectors = sectorsData.length > INITIAL_VISIBLE_PROJECTS_COUNT;

  return (
    <div className="bbs-card">
      <div className="bbs-header">
        <div>
          <span className="bbs-title">תקציב לפי אגף</span>
          <div className="bbs-legend">
            {legendItems.map(({ label, color }) => (
              <span key={label} className="bbs-legend-item">
                <span className="bbs-legend-dot" style={{ background: color }} />{label}
              </span>
            ))}
          </div>
        </div>

        <div className="bbs-header-right">
          <div className="bbs-actions">
            {hasExpandableSectors ? (
              <button
                type="button"
                className="gap-action-btn"
                onClick={() => setShowMore((prev) => !prev)}
                aria-label={showMore ? 'הצג פחות אגפים' : 'הצג אגפים נוספים'}
              >
                {showMore ? 'הסתר' : 'הצג עוד'}
              </button>
            ) : (
              <span className="gap-action-btn" aria-hidden="true">הכל מוצג</span>
            )}
          </div>
        </div>
      </div>

      <div className="bbs-info">
        {sectorsData.length === 0 ? (
          <div className="bbs-note">אין אגפים להצגה.</div>
        ) : (
          <div className="bbs-note"> לחץ על אגף לקבלת פרטים נוספים.</div>
        )}
      </div>

      <div className="bbs-rows">
        {visibleSectors.map(sector => {
          const hrBudget = sector.hrBudget || 0;
          const procBudget = sector.procurementBudget || 0;
          const planned = sector.planningBudget || 0;
          const maxSectorBudget = Math.max(hrBudget, procBudget, planned, 1);

          return (
            <div
              key={sector.sector}
              className="bbs-row"
              role="button"
              tabIndex={0}
              onClick={() => setActiveSector(sector.sector)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveSector(sector.sector);
                }
              }}
              aria-label={`פתח פרטי אגף ${sector.sector}`}
            >
              <div className="bbs-lbl" title={sector.sector}>{sector.sector}</div>
              <div className="bbs-bars">
                <div className="bbs-bar-group">
                  <div className="bbs-bar-info">כ"א ₪{formatMoney(hrBudget)}</div>
                  <div className="bbs-track">
                    <div
                      className="bbs-fill"
                      style={{
                        width: `${Math.max((hrBudget / maxSectorBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.HR,
                      }}
                    />
                  </div>
                </div>
                <div className="bbs-bar-group">
                  <div className="bbs-bar-info">תכנון ₪{formatMoney(planned)}</div>
                  <div className="bbs-track">
                    <div
                      className="bbs-fill"
                      style={{
                        width: `${Math.max((planned / maxSectorBudget) * 100, 0)}%`,
                        background: BUDGET_COLORS.PLANNED,
                      }}
                    />
                  </div>
                </div>
                <div className="bbs-bar-group">
                  <div className="bbs-bar-info">רכש ₪{formatMoney(procBudget)}</div>
                  <div className="bbs-track">
                    <div
                      className="bbs-fill"
                      style={{
                        width: `${Math.max((procBudget / maxSectorBudget) * 100, 0)}%`,
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

      {activeSector && (
        <SegmentProjectsModal
          title={`פרויקטים באגף — ${activeSector}`}
          initialProjects={filteredProjects.filter(p => (p.agaffName || p.AgaffName || p.agaff) === activeSector)}
          onClose={() => setActiveSector(null)}
        />
      )}
    </div>
  );
}

