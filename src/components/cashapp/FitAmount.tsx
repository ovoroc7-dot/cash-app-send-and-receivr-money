import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { speakMoney } from "./store";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Renders a money label that always fits inside its container width:
 * it measures the rendered text and shrinks the font until it fits.
 */
export function FitAmount({
  text,
  value,
  base,
  min = 24,
  className = "",
}: {
  text: string;
  value: number;
  base: number;
  min?: number;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const span = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(base);

  useIso(() => {
    const boxEl = box.current;
    const spanEl = span.current;
    if (!boxEl || !spanEl) return;

    let next = base;
    spanEl.style.fontSize = `${next}px`;
    const available = boxEl.clientWidth;
    let guard = 0;
    while (spanEl.scrollWidth > available && next > min && guard < 80) {
      next = Math.max(min, Math.floor(next * (available / spanEl.scrollWidth) - 0.5));
      spanEl.style.fontSize = `${next}px`;
      guard += 1;
    }
    setSize(next);
  }, [text, base, min]);

  return (
    <div ref={box} className="flex w-full min-w-0 justify-center overflow-hidden">
      <span
        ref={span}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Amount ${speakMoney(value)}`}
        style={{ fontSize: `${size}px` }}
        className={`block whitespace-nowrap text-center leading-none ${className}`}
      >
        {text}
      </span>
    </div>
  );
}
