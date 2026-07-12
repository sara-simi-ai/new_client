import React from 'react';
import './DashboardPage.css';
import { useProjects } from '../../../services/context/ProjectsContext';
import BudgetBySectorChart from '../charts/BudgetBySectorChart/BudgetBySectorChart';
import GapByProjectChart from '../charts/GapByProjectChart/GapByProjectChart';
import HRvsPlannedChart from '../charts/HRvsPlannedChart/HRvsPlannedChart';
import BudgetDistributionDonut from '../charts/BudgetDistributionDonut/BudgetDistributionDonut';
import MaslolTrackDistributionDonut from '../charts/TrackDistributionDonut/TrackDistributionDonut';
import ContinuationVsNewBudgetDonut from '../charts/ContinuationDistributionDonut/ContinuationDistributionDonut';

export default function DashboarPage() {
  const { projects, isLoading } = useProjects();

  if (isLoading) return <div className="dashboard-empty">טוען נתונים...</div>;
  if (!projects.length) return <div className="dashboard-empty">אין נתונים לשנה זו</div>;

  return (
    <div className="dashboard" dir="rtl">
      <GapByProjectChart />
      <HRvsPlannedChart />
      <BudgetBySectorChart />
      <div className="dashboard-row-2">
        <BudgetDistributionDonut />
        <MaslolTrackDistributionDonut />
        <div className="dashboard-row-2-full">
          <ContinuationVsNewBudgetDonut />
        </div>
      </div>
    </div>
  );
}
