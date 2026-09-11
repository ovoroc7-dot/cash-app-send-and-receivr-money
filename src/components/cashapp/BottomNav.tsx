import { Clock, Landmark } from "lucide-react";
import type { CSSProperties } from "react";

export type Tab = "money" | "pay" | "activity";

const TABS: Tab[] = ["money", "pay", "activity"];

export function BottomNav({
  tab,
  onChange,
  green = false,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  green?: boolean;
}) {
  const index = TABS.indexOf(tab);

  // Colors per the recording: on the green keypad the pill is deep translucent
  // green with a slightly darker active highlight; on light screens it's white
  // with a light gray active highlight.
  const pillBg = green ? "bg-black/[0.12]" : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.05]";
  const hiBg = green ? "bg-black/[0.18]" : "bg-black/[0.08]";
  const iconOn = "text-cash-ink";
  const iconOff = green ? "text-cash-ink/45" : "text-cash-ink/60";

  const item = "relative z-10 flex h-11 w-[56px] items-center justify-center";

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-6">
      <div
        className={`pointer-events-auto relative flex items-center rounded-full px-1.5 py-1.5 backdrop-blur ${pillBg}`}
      >
        {/* sliding active highlight */}
        <span
          aria-hidden
          className={`absolute left-1.5 top-1.5 h-11 w-[56px] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${hiBg}`}
          style={{ transform: `translateX(${index * 56}px)` } as CSSProperties}
        />
        <button
          type="button"
          aria-label="Money"
          aria-current={tab === "money" ? "page" : undefined}
          onClick={() => onChange("money")}
          className={item}
        >
          <Landmark className={`size-[26px] ${tab === "money" ? iconOn : iconOff}`} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          aria-label="Pay"
          aria-current={tab === "pay" ? "page" : undefined}
          onClick={() => onChange("pay")}
          className={item}
        >
          <span
            className={`font-display text-[26px] font-bold leading-none ${
              tab === "pay" ? iconOn : iconOff
            }`}
          >
            $
          </span>
        </button>
        <button
          type="button"
          aria-label="Activity"
          aria-current={tab === "activity" ? "page" : undefined}
          onClick={() => onChange("activity")}
          className={item}
        >
          <Clock className={`size-[26px] ${tab === "activity" ? iconOn : iconOff}`} strokeWidth={2.2} />
        </button>
      </div>
    </nav>
  );
}
