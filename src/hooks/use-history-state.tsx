import { useCallback, useRef, useState } from "react";

/**
 * useHistoryState — controlled value with undo/redo history.
 * Only commits distinct values to the history stack.
 */
export function useHistoryState(initial = "") {
  const [value, setValueState] = useState(initial);
  const historyRef = useRef<string[]>([initial]);
  const indexRef = useRef(0);
  const [, force] = useState(0);

  const setValue = useCallback((next: string) => {
    setValueState(next);
    const hist = historyRef.current;
    if (hist[indexRef.current] === next) return;
    const trimmed = hist.slice(0, indexRef.current + 1);
    trimmed.push(next);
    // Cap history to avoid unbounded memory
    const capped = trimmed.length > 200 ? trimmed.slice(trimmed.length - 200) : trimmed;
    historyRef.current = capped;
    indexRef.current = capped.length - 1;
    force((n) => n + 1);
  }, []);

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return;
    indexRef.current -= 1;
    setValueState(historyRef.current[indexRef.current]);
    force((n) => n + 1);
  }, []);

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current += 1;
    setValueState(historyRef.current[indexRef.current]);
    force((n) => n + 1);
  }, []);

  const reset = useCallback((next = "") => {
    historyRef.current = [next];
    indexRef.current = 0;
    setValueState(next);
    force((n) => n + 1);
  }, []);

  return {
    value,
    setValue,
    undo,
    redo,
    reset,
    canUndo: indexRef.current > 0,
    canRedo: indexRef.current < historyRef.current.length - 1,
  };
}
