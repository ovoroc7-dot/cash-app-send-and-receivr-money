import { Clock, CreditCard, DollarSign, Landmark, LineChart } from "lucide-react";

export type Tab = "money" | "card" | "pay" | "invest" | "activity";

const TABS: { id: Tab; label: string; Icon: typeof Clock }[] = [
  { id: "money", label: "Money", Icon: Landmark },
  { id: "card", label: "Cash Card", Icon: CreditCard },
  { id: "pay", label: "Pay", Icon: DollarSign },
  { id: "invest", label: "Investing", Icon: LineChart },
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
  return (
    <nav
      className={`absolute inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full px-2 py-2 shadow-lg backdrop-blur ${
        green ? "bg-cash-ink/10" : "bg-surface-raised/90"
      }`}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`grid size-12 place-items-center rounded-full transition-colors ${
              active ? (green ? "bg-cash-ink/15" : "bg-surface") : "opacity-60"
            }`}
          >
            <Icon className="size-5" strokeWidth={2.2} />
          </button>
        );
      })}
    </nav>
  );
}
