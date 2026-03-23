import { cn } from "@/lib/cn";
import type { SessionState } from "@/hooks/useDecart";
import css from "./SessionStatus.module.css";

/* ── Formatters (pure) ── */

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(2)}`;
}

/* ── Component ── */

interface SessionStatusProps {
  sessionState: SessionState;
  seconds: number;
  cost: number;
  onStop: () => void;
}

export function SessionStatus({
  sessionState,
  seconds,
  cost,
  onStop,
}: SessionStatusProps) {
  if (sessionState === "idle") return null;

  const isConnecting = sessionState === "connecting";
  const isError = sessionState === "error";

  return (
    <div className={css.container}>
      <span className={cn(css.stat, isConnecting && css.connectingText)}>
        {isConnecting ? "connecting" : isError ? "error" : formatTime(seconds)}
      </span>
      <span className={css.sep}>&middot;</span>
      <span className={css.stat}>{formatCost(cost)}</span>
      <span className={css.sep}>&middot;</span>
      <button className={css.stopBtn} onClick={onStop} type="button">
        {isError ? "reset" : "stop"}
      </button>
    </div>
  );
}
