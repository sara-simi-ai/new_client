import { useCallback, useMemo, useState } from 'react';

export function useExpandableProjectList(
  projects,
  compareFn,
  maxVisibleProjects = 4,
  controlledShowMore,
  controlledToggleShowMore,
) {
  const [internalShowMore, setInternalShowMore] = useState(false);

  const showMore = controlledShowMore !== undefined ? controlledShowMore : internalShowMore;
  const toggleShowMore = useCallback(
    () => (
      controlledToggleShowMore
        ? controlledToggleShowMore()
        : setInternalShowMore((prev) => !prev)
    ),
    [controlledToggleShowMore],
  );

  const sorted = useMemo(
    () => [...projects].sort(compareFn),
    [projects, compareFn],
  );

  const hiddenCount = useMemo(
    () => Math.max(sorted.length - maxVisibleProjects, 0),
    [sorted, maxVisibleProjects],
  );

  const visibleProjects = useMemo(
    () => (showMore ? sorted : sorted.slice(0, maxVisibleProjects)),
    [showMore, sorted, maxVisibleProjects],
  );

  const hasExpandableProjects = useMemo(
    () => hiddenCount > 0,
    [hiddenCount],
  );

  return {
    sorted,
    showMore,
    toggleShowMore,
    visibleProjects,
    hiddenCount,
    hasExpandableProjects,
  };
}
