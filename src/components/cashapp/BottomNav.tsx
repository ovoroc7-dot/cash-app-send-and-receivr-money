import { Clock, DollarSign, Landmark } from "lucide-react";

export type Tab = "money" | "pay" | "activity";

const tabs: { id: Tab; label: string; Icon: typeof Clock }[] = [
  { id: "money", label: "Money", Icon: Landmark },
  { id: "pay", label: "Pay", Icon: DollarSign },
  { id: "activity", label: "Activity", Icon: Clock },
];

export function BottomNav({
  tab,
  onChange,
  green,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  green: boolean;
}) {
  const index = tabs.findIndex((t) => t.id === tab);

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-8">
      <div
        className={`pointer-events-auto relative flex items-center rounded-full p-1.5 ${
          green ? "bg-cash-deep/60" : "bg-surface-raised shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
        }`}
      >
        <span
          aria-hidden
          className={`absolute left-1.5 top-1.5 size-[60px] rounded-full transition-transform duration-300 ease-out ${
            green ? "bg-cash-lite" : "bg-black/[0.06]"
          }`}
          style={{ transform: `translateX(${index * 68}px)` }}
        />
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-current={tab === id ? "page" : undefined}
            onClick={() => onChange(id)}
            className="relative flex size-[60px] items-center justify-center rounded-full"
          >
            <span className="relative">
              <Icon
                className={`size-7 ${
                  tab === id ? "text-cash-ink" : green ? "text-cash-ink/50" : "text-cash-ink/45"
                }`}
                strokeWidth={id === "pay" ? 3 : 2.4}
              />
              {id === "activity" && (
                <span className="absolute -right-2.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-alert font-display text-[10px] font-bold text-white">
                  2
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
