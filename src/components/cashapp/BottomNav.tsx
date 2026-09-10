import { Clock, Landmark, DollarSign } from "lucide-react";

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
  const items: { key: Tab; Icon: typeof Clock; label: string }[] = [
    { key: "money", Icon: Landmark, label: "Money" },
    { key: "pay", Icon: DollarSign, label: "Pay" },
    { key: "activity", Icon: Clock, label: "Activity" },
  ];

  return (
    <nav
      className={`absolute inset-x-0 bottom-0 z-20 flex justify-center pb-6 ${
        green ? "" : "px-4"
      }`}
    >
      <div
        className={`flex w-full max-w-[320px] items-center justify-between rounded-full p-1.5 ${
          green ? "" : "bg-surface-raised shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        }`}
      >
        {items.map(({ key, Icon, label }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              aria-label={label}
              aria-current={active ? "page" : undefined}
              onClick={() => onChange(key)}
              className={`flex h-12 flex-1 items-center justify-center rounded-full transition-colors ${
                active
                  ? green
                    ? "bg-cash-deep"
                    : "bg-black/[0.06]"
                  : "bg-transparent"
              }`}
            >
              <Icon
                className={`${key === "pay" ? "size-7" : "size-6"} text-cash-ink`}
                strokeWidth={key === "pay" ? 3 : 2.2}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
