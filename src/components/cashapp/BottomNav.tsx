import { Clock, DollarSign } from "lucide-react";

export type Tab = "money" | "pay" | "activity";

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const pill = (active: boolean) =>
    `flex h-12 w-[72px] items-center justify-center rounded-full transition-colors ${
      active ? "bg-black/[0.08]" : ""
    }`;

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-6">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/95 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.05] backdrop-blur">
        <button
          type="button"
          aria-label="Money"
          aria-current={tab === "money" ? "page" : undefined}
          onClick={() => onChange("money")}
          className={pill(tab === "money")}
        >
          <span
            className={`font-display text-[18px] font-bold tracking-[-0.01em] ${
              tab === "money" ? "text-cash-ink" : "text-cash-ink/60"
            }`}
          >
            $100
          </span>
        </button>
        <button
          type="button"
          aria-label="Pay"
          aria-current={tab === "pay" ? "page" : undefined}
          onClick={() => onChange("pay")}
          className={pill(tab === "pay")}
        >
          <DollarSign
            className={`size-7 ${tab === "pay" ? "text-cash-ink" : "text-cash-ink/60"}`}
            strokeWidth={2.8}
          />
        </button>
        <button
          type="button"
          aria-label="Activity"
          aria-current={tab === "activity" ? "page" : undefined}
          onClick={() => onChange("activity")}
          className={pill(tab === "activity")}
        >
          <Clock
            className={`size-7 ${tab === "activity" ? "text-cash-ink" : "text-cash-ink/60"}`}
            strokeWidth={2.4}
          />
        </button>
      </div>
    </nav>
  );
}
