import { Clock, DollarSign } from "lucide-react";

export type Tab = "money" | "pay" | "activity";

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-around border-t border-black/[0.06] bg-surface-raised px-6 pb-7 pt-3">
      <button
        type="button"
        aria-label="Money"
        aria-current={tab === "money" ? "page" : undefined}
        onClick={() => onChange("money")}
        className="relative flex flex-col items-center"
      >
        <span
          className={`font-display text-[22px] font-semibold tracking-[-0.02em] ${
            tab === "money" ? "text-cash-ink" : "text-cash-ink/35"
          }`}
        >
          $100
        </span>
        <span
          className={`mt-1 h-[3px] w-10 rounded-full ${
            tab === "money" ? "bg-cash" : "bg-transparent"
          }`}
        />
      </button>
      <button
        type="button"
        aria-label="Pay"
        aria-current={tab === "pay" ? "page" : undefined}
        onClick={() => onChange("pay")}
        className="flex items-center justify-center pb-1"
      >
        <DollarSign
          className={`size-7 ${tab === "pay" ? "text-cash-ink" : "text-cash-ink/35"}`}
          strokeWidth={3}
        />
      </button>
      <button
        type="button"
        aria-label="Activity"
        aria-current={tab === "activity" ? "page" : undefined}
        onClick={() => onChange("activity")}
        className="relative flex items-center justify-center pb-1"
      >
        <Clock
          className={`size-7 ${tab === "activity" ? "text-cash-ink" : "text-cash-ink/35"}`}
          strokeWidth={2.4}
        />
        <span className="absolute -right-2.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-alert font-display text-[10px] font-bold text-white">
          2
        </span>
      </button>
    </nav>
  );
}
