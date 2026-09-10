import { Clock, DollarSign } from "lucide-react";

export type Tab = "money" | "pay" | "activity";

export function BottomNav({
  tab,
  onChange,
  green,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  green: boolean;
}) {
  return (
    <nav
      className={`absolute inset-x-0 bottom-0 z-20 ${
        green ? "bg-transparent" : "border-t border-black/[0.06] bg-surface"
      }`}
    >
      <div className="grid grid-cols-3 items-end pb-6 pt-3">
        <button
          type="button"
          aria-label="Money"
          aria-current={tab === "money" ? "page" : undefined}
          onClick={() => onChange("money")}
          className="flex flex-col items-center gap-2"
        >
          <span
            className={`font-display text-[24px] font-bold tracking-[-0.02em] ${
              tab === "money" ? "text-cash-ink" : "text-cash-ink/40"
            }`}
          >
            $100
          </span>
          <span
            className={`h-1 w-14 rounded-full ${tab === "money" ? "bg-cash" : "bg-transparent"}`}
          />
        </button>

        <button
          type="button"
          aria-label="Pay"
          aria-current={tab === "pay" ? "page" : undefined}
          onClick={() => onChange("pay")}
          className="flex flex-col items-center gap-2"
        >
          <DollarSign
            className={`size-8 ${tab === "pay" ? "text-cash-ink" : "text-cash-ink/40"}`}
            strokeWidth={3}
          />
          <span className={`h-1 w-14 rounded-full ${tab === "pay" ? "bg-cash" : "bg-transparent"}`} />
        </button>

        <button
          type="button"
          aria-label="Activity"
          aria-current={tab === "activity" ? "page" : undefined}
          onClick={() => onChange("activity")}
          className="flex flex-col items-center gap-2"
        >
          <span className="relative">
            <Clock
              className={`size-8 ${tab === "activity" ? "text-cash-ink" : "text-cash-ink/40"}`}
              strokeWidth={2.4}
            />
            <span className="absolute -right-2 -top-1 flex size-5 items-center justify-center rounded-full bg-alert font-display text-[11px] font-bold text-white">
              2
            </span>
          </span>
          <span
            className={`h-1 w-14 rounded-full ${tab === "activity" ? "bg-cash" : "bg-transparent"}`}
          />
        </button>
      </div>
    </nav>
  );
}
