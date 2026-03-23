import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";
import css from "./PromptBar.module.css";

/* ── Icons ── */

function ClipIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.5 5L6.5 9a1.414 1.414 0 1 0 2 2l4-4a2.828 2.828 0 1 0-4-4l-4 4a4.243 4.243 0 1 0 6 6l3.5-3.5" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 12V2M2 6l5-4 5 4" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={css.spinner}
    >
      <circle
        cx="7"
        cy="7"
        r="5"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="18 14"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Component ── */

interface PromptBarProps {
  disabled: boolean;
  loading: boolean;
  image: File | null;
  defaultPrompt?: string;
  onSubmit: (prompt: string, image: File | null) => void;
  onImageChange: (file: File | null) => void;
}

export function PromptBar({
  disabled,
  loading,
  image,
  defaultPrompt = "",
  onSubmit,
  onImageChange,
}: PromptBarProps) {
  const [text, setText] = useState(defaultPrompt);
  const [focused, setFocused] = useState(false);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Derived
  const blocked = disabled || loading;
  const canSend = !blocked && (text.trim().length > 0 || image !== null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) return;
      onImageChange(file);
      setThumbUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      e.target.value = "";
    },
    [onImageChange]
  );

  const clearImage = useCallback(() => {
    onImageChange(null);
    setThumbUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [onImageChange]);

  const handleSubmit = useCallback(() => {
    if (!canSend) return;
    onSubmit(text.trim(), image);
    setText("");
  }, [canSend, text, image, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={css.wrapper}>
      <div
        className={cn(
          css.bar,
          focused && css.barFocused,
          blocked && css.barBlocked
        )}
      >
        <button
          className={css.iconBtn}
          onClick={() => fileRef.current?.click()}
          disabled={blocked}
          title="Upload reference image"
          type="button"
        >
          <ClipIcon />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          hidden
        />

        {image && thumbUrl && (
          <div className={css.pill}>
            <img src={thumbUrl} alt="" className={css.pillThumb} />
            <span className={css.pillName}>{image.name}</span>
            <button
              className={css.pillClose}
              onClick={clearImage}
              type="button"
            >
              &times;
            </button>
          </div>
        )}

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={
            image
              ? "describe the look or just send..."
              : "type a prompt or attach an image..."
          }
          className={css.input}
          disabled={blocked}
        />

        <button
          className={css.sendBtn}
          onClick={handleSubmit}
          disabled={!canSend}
          type="button"
        >
          {loading ? <SpinnerIcon /> : <ArrowUpIcon />}
        </button>
      </div>
    </div>
  );
}
