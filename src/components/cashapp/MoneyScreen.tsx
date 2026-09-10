import { useState } from "react";
import { ChevronRight, EyeOff, Eye, Landmark, Search, Sparkles } from "lucide-react";
import { Sheet } from "./Sheet";
import { money, useCash } from "./store";

const PRESETS = [20, 50, 100, 250];

export function MoneyScreen() {
  const { balance, hidden, toggleHidden, addMoney } = useCash();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("50");

  const deposit = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    addMoney(n);
    setOpen(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-surface pb-28">
      <header className="flex items-center justify-between px-5 pb-4 pt-5">
        <h1 className="font-display text-2xl font-bold tracking-tight">Money</h1>
        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="grid size-10 place-items-center rounded-full bg-surface-raised shadow-sm"
          >
            <Search className="size-5" strokeWidth={2.6} />
          </button>
          <button
            aria-label="Profile"
            className="grid size-10 place-items-center rounded-full bg-magenta font-bold text-white"
          >
            J
          </button>
        </div>
      </header>

      <section className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1 text-sm font-medium">
            Cash balance <ChevronRight className="size-4" />
          </button>
          <button onClick={toggleHidden} aria-label="Toggle balance visibility">
            {hidden ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        <p className="mt-1 font-display text-5xl font-bold tracking-tight">
          {hidden ? "••••" : money(balance)}
        </p>
      </section>

      <div className="mt-8 flex items-center gap-2 px-5">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-surface-raised px-8 py-4 font-display text-base font-semibold shadow-sm"
        >
          Add money
        </button>
        <button
          disabled={balance <= 0}
          className="rounded-full px-8 py-4 font-display text-base font-semibold text-muted-foreground disabled:opacity-50"
        >
          Withdraw
        </button>
      </div>

      <div className="mt-6 space-y-4 px-5">
        <article className="rounded-3xl bg-surface-raised p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Taxes</p>
          <div className="mt-2 flex items-start gap-3">
            <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[oklch(0.45_0.22_295)] text-white">
              <Landmark className="size-4" />
            </span>
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight">
              Estimate your tax refund
            </h2>
          </div>
        </article>

        <h2 className="px-1 pt-2 font-display text-xl font-bold tracking-tight">More for you</h2>

        <article className="overflow-hidden rounded-3xl bg-surface-raised p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Tags</p>
          <h3 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight">
            A magical new way to pay
          </h3>
          <div className="mt-6 flex h-28 items-center justify-center rounded-2xl bg-cash/20">
            <Sparkles className="size-8 text-cash-ink" />
          </div>
        </article>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="Add money">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                amount === String(p) ? "bg-cash text-cash-ink" : "bg-surface"
              }`}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          className="mt-4 w-full rounded-2xl bg-surface px-4 py-4 font-display text-2xl font-bold outline-none"
        />
        <p className="mt-2 text-sm text-muted-foreground">From Bank of America ••1234</p>
        <button
          onClick={deposit}
          className="mt-5 w-full rounded-full bg-cash py-4 font-display text-base font-semibold text-cash-ink"
        >
          Add to Cash balance
        </button>
      </Sheet>
    </div>
  );
}
