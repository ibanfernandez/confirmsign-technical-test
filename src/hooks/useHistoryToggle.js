import { useState } from 'react';

/**
 * Custom hook to manage the expand/collapse state of the history panel.
 */
export function useHistoryToggle(initialExpanded = false) {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggle = () => setExpanded((prev) => !prev);
  const collapse = () => setExpanded(false);
  const expand = () => setExpanded(true);

  return { expanded, toggle, collapse, expand };
}