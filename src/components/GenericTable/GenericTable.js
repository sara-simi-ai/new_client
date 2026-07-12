import React from "react";

/**
 * Reusable generic table component
 *
 * Props:
 * - columns: Array of column configs: { key, label/header, render, headerClassName?, cellClassName?, renderTotal? }
 * - data: Array of row objects
 * - tableClassName: CSS class for <table>
 * - wrapperClassName: CSS class for wrapper div
 * - rowClassName: (row) => string - optional function to get CSS class for each row
 * - onRowClick: (row) => void - optional row click handler
 * - footerData: optional data to pass to column.renderTotal for footer row
 * - emptyMessage: optional message when data is empty
 */
export default function GenericTable({
  columns,
  data,
  tableClassName = "generic-table",
  wrapperClassName = "generic-table-wrap",
  rowClassName,
  onRowClick,
  footerData,
  emptyMessage = "אין נתונים להצגה",
}) {
  return (
    <div className={wrapperClassName}>
      {data.length === 0 ? (
        <div className="empty-message">{emptyMessage}</div>
      ) : (
        <table className={tableClassName}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.headerClassName}>
                  {col.label || col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className={rowClassName ? rowClassName(row) : ""}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.cellClassName}>
                    {col.render ? col.render(row) : col.renderCell?.(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {footerData && (
            <tfoot>
              <tr>
                {columns.map((col) => (
                  <td key={col.key} className={col.cellClassName}>
                    {col.renderTotal?.(footerData)}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      )}
    </div>
  );
}
