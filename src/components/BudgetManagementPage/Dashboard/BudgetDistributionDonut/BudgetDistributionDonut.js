import React from 'react';
import './BudgetDistributionDonut.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import { DASH_COLORS, formatCompactNumber } from '../dashUtils/dashUtils';
import DonutChart from '../DonutChart/DonutChart';

export default function BudgetDistributionDonut() {
  const { projects } = useProjects();
  const totalHrBudget = projects.reduce((sum, p) => sum + (p.totalTakzuvCoachAdam || 0), 0);
  const totalProcurementBudget = projects.reduce((sum, p) => sum + (p.totalTakzivRechesh   || 0), 0);

  const segments = [
    { value: totalHrBudget, color: DASH_COLORS[0] },
    { value: totalProcurementBudget, color: DASH_COLORS[1] },
  ];

  const items = [
    { label: 'כ"א',  displayValue: `₪${formatCompactNumber(totalHrBudget)}`, color: DASH_COLORS[0] },
    { label: 'רכש',  displayValue: `₪${formatCompactNumber(totalProcurementBudget)}`, color: DASH_COLORS[1] },
  ];

  return (
    <div className="bdd-card">
      <div className="bdd-title">כ"א VS רכש</div>
      <DonutChart segments={segments} items={items} label='כ"א'
        extra={`סה"כ ₪${formatCompactNumber(totalHrBudget + totalProcurementBudget)}`}
      />
    </div>
  );
}
