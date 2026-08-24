import { formatGapDisplay, formatPlannedHrValue } from './utils/calculateProjectFinanceHelper';

describe('finance display helpers', () => {
  test('shows a dash placeholder when planned HR is zero', () => {
    expect(formatPlannedHrValue(0)).toBe('----');
  });

  test('uses dashes only when planned HR is missing, not when the gap is 100%', () => {
    expect(formatGapDisplay(100, 100, { plannedValue: 0 })).toBe('----');
    expect(formatGapDisplay(100, 100, { plannedValue: 50 })).toBe('▲ ₪100 (100%)');
    expect(formatGapDisplay(100, 100, { plannedValue: 0, showMissingPlanningPlaceholder: false })).toBe('▲ ₪100 (100%)');
  });
});
