import { Clock, DollarSign } from "lucide-react";

export type Tab = "money" | "pay" | "activity";

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-8">
      <div className="pointer-events-auto flex items-center rounded-full bg-surface-raised p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
        <button
          type="button"
          aria-label="Money"
          aria-current={tab === "money" ? "page" : undefined}
          onClick={() => onChange("money")}
          className={`flex h-[60px] items-center justify-center rounded-full px-6 font-display text-[22px] font-semibold tracking-[-0.02em] text-cash-ink ${
            tab === "money" ? "bg-black/[0.07]" : ""
          }`}
        >
          $100
        </button>
        <button
          type="button"
          aria-label="Pay"
          aria-current={tab === "pay" ? "page" : undefined}
          onClick={() => onChange("pay")}
          className={`flex size-[60px] items-center justify-center rounded-full ${
            tab === "pay" ? "bg-black/[0.07]" : ""
          }`}
        >
          <DollarSign className="size-7 text-cash-ink" strokeWidth={3} />
        </button>
        <button
          type="button"
          aria-label="Activity"
          aria-current={tab === "activity" ? "page" : undefined}
          onClick={() => onChange("activity")}
          className={`flex size-[60px] items-center justify-center rounded-full ${
            tab === "activity" ? "bg-black/[0.07]" : ""
          }`}
        >
          <Clock className="size-7 text-cash-ink" strokeWidth={2.4} />
        </button>
      </div>
    </nav>
  );
}
