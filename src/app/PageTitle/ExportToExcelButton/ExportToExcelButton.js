import React, { useState } from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { formatMoney } from "../../../utils/formatMoneyHelper";
import { formatGapDisplay } from "../../../utils/calculateProjectFinanceHelper";
import { getOptionLabelByValue } from "../../../utils/optionHelpers";
import { PROJECT_NAME_LABEL, AGAF_LABEL, TSEVET_LABEL, CONTINUATION_LABEL, CONTINUATION_TRUE_LABEL, CONTINUATION_FALSE_LABEL, MASLOL_LABEL, HR_BUDGET_LABEL, PROCUREMENT_BUDGET_LABEL, GAPS_LABEL, TOTAL_GAPS_LABEL, MASLOL_OPTIONS, TOTAL_BUDGET_LABEL } from "../../../utils/Dec";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import "./ExportToExcelButton.css";

export default function ExportToExcelButton() {
  const { selectedYear, filteredProjects, projectFinanceMap, summaryData } = useProjects();
  const [loading, setLoading] = useState(false);

  const THIN_BORDER = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  const handleExport = async () => {
    try {
      setLoading(true);

      const workbook = new ExcelJS.Workbook();

      const projectsSheet = workbook.addWorksheet("טבלת פרויקטים");
      projectsSheet.views = [{ rightToLeft: true }];

      const fileName = `פרויקטים לשנת ${selectedYear}`;

      const titleRow = projectsSheet.addRow([fileName]);
      const titleCell = titleRow.getCell(1);
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: "center", vertical: "center" };
      titleCell.border = THIN_BORDER;

      projectsSheet.mergeCells("A1:H1");

      const headers = [
        PROJECT_NAME_LABEL,
        AGAF_LABEL,
        TSEVET_LABEL,
        CONTINUATION_LABEL,
        MASLOL_LABEL,
        HR_BUDGET_LABEL,
        PROCUREMENT_BUDGET_LABEL,
        GAPS_LABEL,
      ];

      const headerRow = projectsSheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
        cell.alignment = { horizontal: "center", vertical: "center" };
        cell.border = THIN_BORDER;
      });

      filteredProjects.forEach((project) => {
        const financeData = projectFinanceMap[project.id] || {};
        const {
          pearim = 0,
          totalTakzivCoachAdam = 0,
          totalTakzivRechesh = 0,
        } = financeData;

        const row = projectsSheet.addRow([
          project.projectName || "",
          project.agaffName || "",
          project.tsevetMevatseaName || "",
          project.logHemsheci ? CONTINUATION_TRUE_LABEL : CONTINUATION_FALSE_LABEL,

          getOptionLabelByValue(MASLOL_OPTIONS, project.maslol, project.maslol || ""),
          formatMoney(totalTakzivCoachAdam),
          formatMoney(totalTakzivRechesh),
          formatGapDisplay(pearim, totalTakzivCoachAdam, { signStyle: "plusMinus" }),
        ]);

        row.eachCell((cell, colNumber) => {
          if (row.number % 2 === 0) {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F5" } };
          }
          cell.border = THIN_BORDER;
          if (colNumber >= 6) {
            cell.alignment = { horizontal: "center" };
          }
        });
      });

      projectsSheet.columns = [
        { width: 25 }, // projectName
        { width: 15 }, // agaff
        { width: 15 }, // yechidaMevatzat
        { width: 15 }, // hemsheci
        { width: 15 }, // maslol
        { width: 15 }, // hrBudget
        { width: 15 }, // procBudget
        { width: 20 }, // gaps
      ];

      const sheet2 = workbook.addWorksheet("תמונת מצב");
      sheet2.views = [{ rightToLeft: true }];

      const summaryTitle = `תמונת מצב לשנת ${selectedYear}`;
      const summaryTitleRow = sheet2.addRow([summaryTitle]);
      const summaryTitleCell = summaryTitleRow.getCell(1);
      summaryTitleCell.font = { bold: true, size: 14 };
      summaryTitleCell.alignment = { horizontal: "center", vertical: "center" };
      summaryTitleCell.border = THIN_BORDER;
      sheet2.mergeCells("A1:B1");

      const summaryHeaderRow = sheet2.addRow(["מדד", "ערך"]);
      summaryHeaderRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
        cell.alignment = { horizontal: "center", vertical: "center" };
        cell.border = THIN_BORDER;
      });

      const summaryItems = [
        ["סה\"כ פרויקטים", summaryData?.totalCount || 0],
        [HR_BUDGET_LABEL, formatMoney(summaryData?.totalHR || 0)],
        [PROCUREMENT_BUDGET_LABEL, formatMoney(summaryData?.totalProc || 0)],
        [TOTAL_BUDGET_LABEL, formatMoney(summaryData?.totalBudget || 0)],
        [TOTAL_GAPS_LABEL, formatGapDisplay(summaryData?.totalGap || 0, summaryData?.totalBudget || 0, { signStyle: "plusMinus" })],
      ];

      summaryItems.forEach((item) => {
        const row = sheet2.addRow(item);
        row.eachCell((cell, colNumber) => {
          cell.border = THIN_BORDER;
          cell.alignment = { horizontal: colNumber === 1 ? "right" : "center" };
        });
      });

      sheet2.columns = [
        { width: 20 },
        { width: 20 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}.xlsx`);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      alert("שגיאה בעת ייצוא לאקסל: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="export-excel-btn"
      onClick={handleExport}
      disabled={loading}
      title="ייצא פרויקטים לקובץ אקסל"
      aria-label="ייצא פרויקטים לאקסל"
      type="button"
    >
      <svg viewBox="0 0 24 24" className="export-excel-btn-icon" aria-hidden="true">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm1 15H9v-2h6v2Zm0-4H9v-2h6v2Zm-4-4V4.5L16.5 9H11Z" />
      </svg>
    </button>
  );
}