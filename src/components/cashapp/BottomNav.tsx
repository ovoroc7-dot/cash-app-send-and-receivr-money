import { Clock } from "lucide-react";
import { haptic, useCash } from "./store";
import dollarSign from "@/assets/dollar-sign.png";

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
  const { balance } = useCash();
  const balanceLabel = `$${Math.round(balance).toLocaleString("en-US")}`;
  const moneyActive = tab === "money";
  const payActive = tab === "pay";
  const activityActive = tab === "activity";
  const inkOn = green ? "text-cash-key" : "text-cash-ink";
  const inkOff = green ? "text-cash-key/35" : "text-cash-ink/35";
  const select = (t: Tab) => {
    haptic("tap");
    onChange(t);
  };

  return (
    <nav
      className={`absolute inset-x-0 bottom-0 z-20 flex h-[84px] items-end pb-7 transition-colors duration-100 ease-out will-change-transform ${
        green
          ? "bg-cash shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
          : "bg-surface-raised shadow-[0_-2px_12px_rgba(0,0,0,0.06)] dark:bg-black dark:shadow-none"
      }`}
    >
      <button
        type="button"
        aria-label={`Money, cash balance ${balanceLabel}`}
        aria-current={moneyActive ? "page" : undefined}
        onClick={() => select("money")}
        className="relative flex flex-1 items-center justify-center pb-1 transition-transform duration-75 ease-out active:scale-95 active:opacity-90"
      >
        <span
          className={`font-display text-[22px] font-bold leading-none transition-colors duration-100 ease-out ${
            moneyActive ? inkOn : inkOff
          }`}
        >
          {balanceLabel}
        </span>
      </button>

      <button
        type="button"
        aria-label="Pay"
        aria-current={payActive ? "page" : undefined}
        onClick={() => select("pay")}
        className="relative flex flex-1 items-center justify-center pb-1 transition-transform duration-75 ease-out active:scale-95 active:opacity-90"
      >
        <img
          src={dollarSign}
          alt=""
          aria-hidden="true"
          className={`h-[28px] w-auto object-contain transition-opacity duration-100 ease-out ${
            payActive ? "opacity-100" : "opacity-35"
          } ${green ? "" : "dark:invert sysdark:invert"}`}
        />
      </button>

      <button
        type="button"
        aria-label="Activity"
        aria-current={activityActive ? "page" : undefined}
        onClick={() => select("activity")}
        className="relative flex flex-1 items-center justify-center pb-1 transition-transform duration-75 ease-out active:scale-95 active:opacity-90"
      >
        <div className="relative">
          <Clock
            className={`size-[26px] transition-colors duration-100 ease-out ${
              activityActive ? inkOn : inkOff
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
