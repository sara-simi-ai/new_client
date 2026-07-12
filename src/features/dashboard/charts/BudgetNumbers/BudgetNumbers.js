import React from 'react';
import './BudgetNumbers.css';
import { formatMoney } from '../../../../utils/formatMoney';

export default function BudgetNumbers({ gapLabel, gapClass, hrBudget, procurementBudget, planningBudget }) {
  return (
    <div className="hrp-nums" dir="ltr">
      <span className={`hrp-item hrp-gap ${gapClass}`}>
        <span className="hrp-item-value">{gapLabel}</span>
      </span>
      <span className="hrp-sep" aria-hidden="true">·</span>
      <span className="hrp-item hrp-budget">
        <span className="hrp-item-value">₪{formatMoney(hrBudget)}</span>
        <span className="hrp-item-label">תכנון</span>
      </span>
      <span className="hrp-sep" aria-hidden="true">·</span>
      <span className="hrp-item hrp-proc">
        <span className="hrp-item-value">₪{formatMoney(procurementBudget)}</span>
        <span className="hrp-item-label">רכש</span>
      </span>
      <span className="hrp-sep" aria-hidden="true">·</span>
      <span className="hrp-item hrp-plan">
        <span className="hrp-item-value">₪{formatMoney(planningBudget)}</span>
        <span className="hrp-item-label">כ"א</span>
      </span>
    </div>
  );
}
