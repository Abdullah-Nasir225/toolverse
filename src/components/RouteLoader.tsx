import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * Top-of-page progress bar + subtle overlay shown during route transitions.
 * Uses TanStack Router's `isLoading` / `isTransitioning` state.
 */
export function RouteLoader() {
  const isNavigating = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isNavigating) {
      if (visible) {
        setProgress(100);
        const t = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 250);
        return () => clearTimeout(t);
      }
      return;
    }

    setVisible(true);
    setProgress(15);
    let p = 15;
    const interval = setInterval(() => {
      p = Math.min(p + Math.random() * 12, 85);
      setProgress(p);
    }, 200);
    return () => clearInterval(interval);
  }, [isNavigating, visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100]"
    >
      <div className="h-0.5 w-full overflow-hidden bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary/70 via-primary to-primary/70 shadow-[0_0_10px_hsl(var(--primary)/0.6)] transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
