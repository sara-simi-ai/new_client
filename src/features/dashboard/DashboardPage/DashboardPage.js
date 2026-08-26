import React from 'react';
import './DashboardPage.css';
import { useProjects } from '../../../services/context/ProjectsContext';
import { useExpandableProjectList } from '../hooks/useExpandableProjectList';
import { compareByRelativeGap } from '../../../utils/calculateProjectFinanceHelper';
import { INITIAL_VISIBLE_PROJECTS_COUNT } from '../constans/chartConstants';
import BudgetBySectorChart from '../charts/BudgetBySectorChart/BudgetBySectorChart';
import BudgetByUnitChart from '../charts/BudgetByUnitChart/BudgetByUnitChart';
import BudgetByDepartmentChart from '../charts/BudgetByDepartmentChart/BudgetByDepartmentChart';
import GapByProjectChart from '../charts/GapByProjectChart/GapByProjectChart';
import HRvsPlannedChart from '../charts/HRvsPlannedChart/HRvsPlannedChart';
import BudgetDistributionDonut from '../charts/BudgetDistributionDonut/BudgetDistributionDonut';
import MaslolTrackDistributionDonut from '../charts/TrackDistributionDonut/TrackDistributionDonut';
import ContinuationVsNewBudgetDonut from '../charts/ContinuationDistributionDonut/ContinuationDistributionDonut';
import FilterBar from '../../projects/FilterBar/FilterBar';

export default function DashboarPage() {
  const { filteredProjects, isLoading } = useProjects();

  const {
    sorted,
    showMore,
    toggleShowMore,
    visibleProjects,
    hiddenCount,
    hasExpandableProjects,
  } = useExpandableProjectList(
    filteredProjects,
    compareByRelativeGap,
    INITIAL_VISIBLE_PROJECTS_COUNT,
  );

  if (isLoading) return <div className="dashboard-empty">טוען נתונים...</div>;
  if (!filteredProjects.length) return <div className="dashboard-empty">אין נתונים לשנה זו</div>;

  return (
    <div className="dashboard" dir="rtl">
      <FilterBar />
      <div className="dashboard-top-grid">
        <HRvsPlannedChart
          sorted={sorted}
          visibleProjects={visibleProjects}
          showMore={showMore}
          hiddenCount={hiddenCount}
          hasExpandableProjects={hasExpandableProjects}
          toggleShowMore={toggleShowMore}
        />
        <GapByProjectChart
          sorted={sorted}
          visibleProjects={visibleProjects}
          showMore={showMore}
          hiddenCount={hiddenCount}
          hasExpandableProjects={hasExpandableProjects}
          toggleShowMore={toggleShowMore}
        />
      </div>
      <div className="dashboard-budget-grid">
        <BudgetBySectorChart />
        <BudgetByUnitChart />
        <BudgetByDepartmentChart />
      </div>
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
