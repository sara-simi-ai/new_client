import React from 'react';
import './DonutChart.css';
import { CIRCLE_RADIUS, CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_CIRCUMFERENCE } from '../../constans/dashConstants';

export default function DonutChart({ segments, items, label, extra, onSegmentClick }) {
  const safeSegments = Array.isArray(segments) && segments.length > 0 ? segments : [];
  const primarySegment = safeSegments[0] ?? { value: 0, color: '#9ca3af' };
  const totalValue = safeSegments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const percentPrimary = Math.round(primarySegment.value / totalValue * 100);

  const centerData = safeSegments.map((segment, index) => ({
    label: items?.[index]?.label || segment.label || '',
    percent: Math.round(segment.value / totalValue * 100),
    color: segment.color,
  }));

  const showMultiCenter = centerData.length === 2 && centerData.every(data => data.label);

  let strokeOffset = 0;
  const arcElements = safeSegments.map((segment, i) => {
    const arcLength = CIRCLE_CIRCUMFERENCE * segment.value / totalValue;
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

  return (
    <>
      <div className="donut-body">

        <div className="donut-vals">
          {items.map(item => item.displayValue ? (
            <div key={item.label} className="donut-val-row">{item.displayValue}</div>
          ) : null)}
          {extra && <div className="donut-extra">{extra}</div>}
        </div>

        <div className="donut-legend">
          {items.map((item, idx) => (
            <div key={item.label} className={`donut-leg-row${onSegmentClick ? ' clickable' : ''}`} role={onSegmentClick ? 'button' : undefined}
              onClick={onSegmentClick ? () => onSegmentClick(idx) : undefined}
              tabIndex={onSegmentClick ? 0 : undefined}
              onKeyDown={onSegmentClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onSegmentClick(idx); } : undefined}
              style={onSegmentClick ? { cursor: 'pointer' } : {}}
            >
              <span
                className="donut-leg-dot"
                style={item.color === 'none'
                  ? { background: 'transparent', border: `2px solid ${item.outline || '#94a3b8'}` }
                  : { background: item.color }
                }
              />
              <span className="donut-leg-lbl">{item.label}</span>
            </div>
          ))}
        </div>

        <svg width="112" height="112" viewBox="0 0 112 112" style={{ flexShrink: 0 }}>
          <circle cx={CIRCLE_CENTER_X} cy={CIRCLE_CENTER_Y} r={CIRCLE_RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="13" />
          {arcElements}
          {showMultiCenter ? (
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
          )}
        </svg>

      </div>
      {onSegmentClick && (
        <div className="donut-hint">לחץ על העיגול או על שם הקטגוריה כדי לראות את הפרויקטים.</div>
      )}
    </>
  );
}
