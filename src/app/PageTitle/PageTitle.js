import React from 'react';
import './PageTitle.css';
import YearSelector from './YearSelector/YearSelector';
import CopyProjectsButton from './CopyProjectsButton/CopyProjectsButton';
import ExportToExcelButton from './ExportToExcelButton/ExportToExcelButton';
import ManagementButton from './ManagementButton/ManagementButton';
import { useProjects } from '../../services/context/ProjectsContext';

const PageTitle = () => {
	const { selectedYear, summaryData } = useProjects();
	const displayYear = selectedYear ?? new Date().getFullYear();
	const projectCount = summaryData?.totalCount ?? 0;

	return (
		<header className="page-title-header" dir="rtl">
			<div className="page-title-inner container">
				<div className="page-title-right">
					<div className="page-title-title-wrap">
						<h1 className="page-title-title">תכ"ם</h1>
						<h2 className="page-title-subtitle">תכנון פרויקטים</h2>
						<div className="page-title-subwrap">
							<div className="page-title-meta">
								<span className="page-title-meta-count">{projectCount} פרויקטים</span>
								<span className="page-title-meta-dot">•</span>
								<span className="page-title-meta-year">שנת {displayYear}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="page-title-left">
					<div className="page-title-controls">
						<ExportToExcelButton />
						<ManagementButton />
						<CopyProjectsButton />
						<YearSelector />
					</div>
				</div>
			</div>
		</header>
	);
};

export default PageTitle;

