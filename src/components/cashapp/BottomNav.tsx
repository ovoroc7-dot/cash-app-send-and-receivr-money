import { Clock } from "lucide-react";

export type Tab = "money" | "pay" | "activity";

export function BottomNav({
  tab,
  onChange,
  green = false,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  green?: boolean;
}) {
  const moneyActive = tab === "money";
  const payActive = tab === "pay";
  const activityActive = tab === "activity";

  return (
    <nav
      className={`absolute inset-x-0 bottom-0 z-20 flex h-[84px] items-end pb-7 transition-colors duration-100 ease-out will-change-transform ${
        green
          ? "bg-cash shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
          : "bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      <button
        type="button"
        aria-label="Money"
        aria-current={moneyActive ? "page" : undefined}
        onClick={() => onChange("money")}
        className="relative flex flex-1 items-center justify-center pb-1"
      >
        <span
          className={`font-display text-[22px] font-bold leading-none ${
            moneyActive ? "text-cash-ink" : "text-cash-ink/35"
          }`}
        >
          $100
        </span>
      </button>

      <button
        type="button"
        aria-label="Pay"
        aria-current={payActive ? "page" : undefined}
        onClick={() => onChange("pay")}
        className="relative flex flex-1 items-center justify-center pb-1"
      >
        <span
          className={`font-display text-[28px] font-bold leading-none ${
            payActive ? "text-cash-ink" : "text-cash-ink/35"
          }`}
        >
          $
        </span>
      </button>

      <button
        type="button"
        aria-label="Activity"
        aria-current={activityActive ? "page" : undefined}
        onClick={() => onChange("activity")}
        className="relative flex flex-1 items-center justify-center pb-1"
      >
        <div className="relative">
          <Clock
            className={`size-[26px] ${
              activityActive ? "text-cash-ink" : "text-cash-ink/35"
            }`}
            strokeWidth={2.2}
          />
          <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-alert px-1 text-[11px] font-bold text-white">
            2
          </span>
        </div>
      </button>
    </nav>
  );
}
