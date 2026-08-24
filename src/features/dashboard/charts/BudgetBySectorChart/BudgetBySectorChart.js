import React, { useMemo, useState } from 'react';
import './BudgetBySectorChart.css';
import BudgetNumbers from '../BudgetNumbers/BudgetNumbers';
import { useProjects } from '../../../../services/context/ProjectsContext';
// Using direct project properties for backward compatibility (helper removed).
import { formatGapDisplay, getGapStatus } from '../../../../utils/calculateProjectFinanceHelper';
import { BUDGET_COLORS } from '../../constans/chartConstants';
import { GAP_STATUS_BY_VALUE } from '../../../../utils/Dec';
import SegmentProjectsModal from '../../SegmentProjectsModal/SegmentProjectsModal';

const legendItems = [
  { label: 'כ"א', color: BUDGET_COLORS.HR },
  { label: 'רכש', color: BUDGET_COLORS.PROC },
  { label: 'תכנון', color: BUDGET_COLORS.PLANNED }
];

export default function BudgetBySectorChart() {
  const { filteredProjects } = useProjects();
  const [activeSector, setActiveSector] = useState(null);

  const sectorsData = useMemo(() => {
    const sectorMap = new Map();

    filteredProjects.forEach(project => {
      // Use helper to read canonical agaff name with fallbacks.
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
      .sort((a, b) => a.sector.localeCompare(b.sector))
      .map(sectorItem => {
        const gapValue = sectorItem.hrBudget - sectorItem.planningBudget;
        const gapStatus = getGapStatus(gapValue, sectorItem.hrBudget);

        return {
          ...sectorItem,
          gapValue,
          gapStatus,
          gapLabel: formatGapDisplay(gapValue, sectorItem.hrBudget, { plannedValue: sectorItem.planningBudget })
        };
      });
  }, [filteredProjects]);

  const maxTotal = useMemo(() => {
    if (!sectorsData.length) {
      return 1;
    }

    const perSectorMaxes = sectorsData.map(item => Math.max(
      item.hrBudget || 0,
      item.procurementBudget || 0,
      item.planningBudget || 0
    ));

    return Math.max(...perSectorMaxes, 1);
  }, [sectorsData]);

  return (
    <div className="bbs-card">
      <div className="bbs-header">
        <div>
          <span className="bbs-title">תקציב לפי אגף</span>
          <div className="bbs-legend">
            {legendItems.map(item => (
              <span key={item.label} className="bbs-legend-item">
                <span className="bbs-legend-dot" style={{ background: item.color }} />{item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bbs-info">
        <div className="bbs-note">האגפים מוצגים לפי הפער היחסי הגדול ביותר. לחץ על אגף לקבלת פרטים נוספים.</div>
      </div>

      <div className="bbs-rows">
        {sectorsData.map(sectorItem => (
          <div
            key={sectorItem.sector}
            className="bbs-row"
            onClick={() => setActiveSector(sectorItem.sector)}
            role="button"
            tabIndex={0}
          >
            <div className="bbs-lbl" title={sectorItem.sector}>{sectorItem.sector}</div>
            <div className="bbs-bars">
              {[
                { label: 'hr', value: sectorItem.hrBudget, color: BUDGET_COLORS.HR },
                { label: 'procurement', value: sectorItem.procurementBudget, color: BUDGET_COLORS.PROC },
                { label: 'planning', value: sectorItem.planningBudget, color: BUDGET_COLORS.PLANNED }
              ].map(item => {
                const widthPercent = Math.round((item.value / maxTotal) * 100);
                return (
                  <div key={`${sectorItem.sector}-${item.label}`} className="bbs-track">
                    <div
                      className="bbs-fill"
                      style={{ width: `${widthPercent}%`, background: item.color }}
                    />
                  </div>
                );
              })}
                <BudgetNumbers
                  gapLabel={sectorItem.gapLabel}
                  gapClass={GAP_STATUS_BY_VALUE[sectorItem.gapStatus]?.className || ""}
                  hrBudget={sectorItem.hrBudget}
                  procurementBudget={sectorItem.procurementBudget}
                  planningBudget={sectorItem.planningBudget}
                />
            </div>
          </div>
        ))}
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

