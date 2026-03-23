import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { SessionState } from "@/hooks/useDecart";
import css from "./VideoPanel.module.css";

interface VideoPanelProps {
  stream: MediaStream | null;
  label: string;
  muted?: boolean;
  mirror?: boolean;
  status?: SessionState;
  placeholderText?: string;
  errorText?: string;
  className?: string;
}

export function VideoPanel({
  stream,
  label,
  muted = false,
  mirror = false,
  status,
  placeholderText = "offline",
  errorText,
  className,
}: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Browser API: srcObject can only be set imperatively
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.srcObject = stream;
  }, [stream]);

  const isConnecting = status === "connecting";
  const isConnected = status === "connected";
  const isError = status === "error";

  return (
    <div
      className={cn(
        css.panel,
        isConnected && css.active,
        isConnecting && css.connecting,
        className
      )}
    >
      <span className={css.label}>{label}</span>

      {status && (
        <div className={css.statusDot}>
          <div
            className={cn(
              css.dot,
              isConnected && css.dotConnected,
              isConnecting && css.dotConnecting,
              isError && css.dotError
            )}
          />
        </div>
      )}

      {stream ? (
        <video
          ref={videoRef}
          className={cn(css.video, mirror && css.mirror)}
          autoPlay
          playsInline
          muted={muted}
          disablePictureInPicture
        />
      ) : (
        <div className={css.placeholder}>
          {errorText ? (
            <span className={css.errorText}>{errorText}</span>
          ) : (
            <span
              className={cn(
                css.placeholderText,
                isConnecting && css.placeholderPulse
              )}
            >
              {isConnecting ? "connecting..." : placeholderText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
