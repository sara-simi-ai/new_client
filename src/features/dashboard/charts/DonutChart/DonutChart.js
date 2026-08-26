import React from 'react';
import './DonutChart.css';
import { CIRCLE_RADIUS, CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_CIRCUMFERENCE } from '../../constans/dashConstants';

export default function DonutChart({ segments, items, label, extra, onSegmentClick }) {
  const safeSegments = Array.isArray(segments) ? segments : [];
  const safeItems = Array.isArray(items) ? items : [];
  const primarySegment = safeSegments[0] ?? { value: 0, color: '#9ca3af' };
  const totalRaw = safeSegments.reduce((sum, segment) => sum + (Number(segment.value) || 0), 0);
  const totalValue = totalRaw > 0 ? totalRaw : 0;
  const percentPrimary = totalValue > 0 ? Math.round((primarySegment.value / totalValue) * 100) : 0;

  const centerData = safeSegments.map((segment, index) => ({
    label: safeItems[index]?.label || segment.label || '',
    percent: totalValue > 0 ? Math.round((segment.value / totalValue) * 100) : 0,
    color: segment.color,
  }));

  const showMultiCenter = centerData.length === 2 && centerData.every((data) => data.label);

  let strokeOffset = 0;
  const arcElements = safeSegments.map((segment, i) => {
    const segValue = Number(segment.value) || 0;
    const arcLength = totalValue > 0 ? CIRCLE_CIRCUMFERENCE * segValue / totalValue : 0;
    const arcElement = segment.color === 'none' ? null : (
      <circle key={i}
        cx={CIRCLE_CENTER_X} cy={CIRCLE_CENTER_Y} r={CIRCLE_RADIUS}
        fill="none" stroke={segment.color} strokeWidth="13"
        strokeDasharray={`${arcLength} ${CIRCLE_CIRCUMFERENCE - arcLength}`}
        strokeDashoffset={-strokeOffset} strokeLinecap="round"
        transform={`rotate(-90 ${CIRCLE_CENTER_X} ${CIRCLE_CENTER_Y})`}
        style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
        onClick={onSegmentClick ? (e) => { e.stopPropagation(); onSegmentClick(i); } : undefined}
      />
    );
    strokeOffset += arcLength;
    return arcElement;
  });

  const hasData = totalValue > 0 && safeSegments.length > 0;

  return (
    <>
      <div className="donut-body">
        <svg className="donut-svg" width="130" height="130" viewBox="0 0 112 112" aria-label="donut chart">
          <circle cx={CIRCLE_CENTER_X} cy={CIRCLE_CENTER_Y} r={CIRCLE_RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="13" />
          {hasData ? arcElements : null}
          {hasData ? (
            showMultiCenter ? (
              <>
                <text x={CIRCLE_CENTER_X} y={CIRCLE_CENTER_Y - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill={centerData[0].color}>{centerData[0].label} {centerData[0].percent}%</text>
                <text x={CIRCLE_CENTER_X} y={CIRCLE_CENTER_Y + 10} textAnchor="middle" fontSize="10" fontWeight="700" fill={centerData[1].color}>{centerData[1].label} {centerData[1].percent}%</text>
              </>
            ) : (
              <>
                <text x={CIRCLE_CENTER_X} y={CIRCLE_CENTER_Y} textAnchor="middle" dominantBaseline="middle"
                  fontSize="15" fontWeight="700" fill={primarySegment.color}>{percentPrimary}%</text>
                <text x={CIRCLE_CENTER_X} y={CIRCLE_CENTER_Y + 14} textAnchor="middle" fontSize="9" fill="#6b7280">{label}</text>
              </>
            )
          ) : (
            <text x={CIRCLE_CENTER_X} y={CIRCLE_CENTER_Y} textAnchor="middle" dominantBaseline="middle"
              fontSize="11" fontWeight="700" fill="#94a3b8">אין נתונים</text>
          )}
        </svg>

        <div className="donut-legend">
          {safeItems.map((item, idx) => (
            <div key={item.label} className={`donut-leg-row${onSegmentClick ? ' clickable' : ''}`} role={onSegmentClick ? 'button' : undefined}
              onClick={onSegmentClick ? () => onSegmentClick(idx) : undefined}
              tabIndex={onSegmentClick ? 0 : undefined}
              onKeyDown={onSegmentClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onSegmentClick(idx); } : undefined}
              style={onSegmentClick ? { cursor: 'pointer' } : {}}
            >
              <div className="donut-leg-label-group">
                <span
                  className="donut-leg-dot"
                  style={item.color === 'none'
                    ? { background: 'transparent', border: `2px solid ${item.outline || '#94a3b8'}` }
                    : { background: item.color }
                  }
                />
                <span className="donut-leg-lbl">{item.label}</span>
              </div>
              {item.displayValue && <span className="donut-leg-value">{item.displayValue}</span>}
            </div>
          ))}
          {extra && <div className="donut-extra">{extra}</div>}
        </div>
      </div>
      {onSegmentClick && (
        <div className="donut-hint">לחץ על העיגול או על שם הקטגוריה כדי לראות את הפרויקטים.</div>
      )}
    </>
  );
}
