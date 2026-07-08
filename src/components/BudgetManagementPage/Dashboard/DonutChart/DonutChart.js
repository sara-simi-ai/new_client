import React from 'react';
import './DonutChart.css';
import { CIRCLE_RADIUS, CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_CIRCUMFERENCE } from '../dashUtils/dashUtils';

// items: [{ label, value, displayValue, color }]
export default function DonutChart({ segments, items, label, extra, onSegmentClick }) {
  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const percentPrimary = Math.round(segments[0].value / totalValue * 100);

  let strokeOffset = 0;
  const arcElements = segments.map((segment, i) => {
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

        {/* עמודת ערכים — משמאל */}
        <div className="donut-vals">
          {items.map(item => item.displayValue ? (
            <div key={item.label} className="donut-val-row">{item.displayValue}</div>
          ) : null)}
          {extra && <div className="donut-extra">{extra}</div>}
        </div>

        {/* עמודת לג'נד — dot + שם */}
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

        {/* עיגול — מימין */}
        <svg width="112" height="112" viewBox="0 0 112 112" style={{ flexShrink: 0 }}>
          <circle cx={CIRCLE_CENTER_X} cy={CIRCLE_CENTER_Y} r={CIRCLE_RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="13" />
          {arcElements}
          <text x={CIRCLE_CENTER_X} y={CIRCLE_CENTER_Y} textAnchor="middle" dominantBaseline="middle"
            fontSize="15" fontWeight="700" fill={segments[0].color}>{percentPrimary}%</text>
          <text x={CIRCLE_CENTER_X} y={CIRCLE_CENTER_Y + 14} textAnchor="middle" fontSize="9" fill="#6b7280">{label}</text>
        </svg>

      </div>
      {onSegmentClick && (
        <div className="donut-hint">לחץ על העיגול או על שם הקטגוריה כדי לראות את הפרויקטים.</div>
      )}
    </>
  );
}
