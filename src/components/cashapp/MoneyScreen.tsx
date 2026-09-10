import { useEffect, useState } from "react";
import { ChevronRight, EyeOff, Search, Briefcase, Landmark } from "lucide-react";

export function MoneyScreen() {
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-surface px-6 pt-4 pb-32">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em] text-cash-ink">
          Money
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="flex size-11 items-center justify-center rounded-full bg-surface-raised"
          >
            <Search className="size-5 text-cash-ink" strokeWidth={2.8} />
          </button>
          <button
            type="button"
            aria-label="Profile"
            className="flex size-11 items-center justify-center rounded-full bg-magenta"
          >
            <Briefcase className="size-5 text-cash-ink" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="mt-10 animate-pulse space-y-4">
          <div className="h-4 w-32 rounded-full bg-black/[0.06]" />
          <div className="h-10 w-48 rounded-2xl bg-black/[0.06]" />
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="h-14 rounded-full bg-black/[0.06]" />
            <div className="h-14 rounded-full bg-black/[0.06]" />
          </div>
          <div className="h-28 rounded-3xl bg-black/[0.06]" />
          <div className="h-56 rounded-3xl bg-black/[0.06]" />
        </div>
      ) : (
        <>
          <div className="mt-12 flex items-start justify-between">
            <div>
              <button
                type="button"
                className="flex items-center gap-1 font-display text-[15px] font-semibold text-cash-ink"
              >
                Cash balance
                <ChevronRight className="size-4" strokeWidth={2.5} />
              </button>
              <p className="mt-1 font-display text-[56px] font-semibold leading-none tracking-[-0.04em] text-cash-ink">
                {hidden ? "••••" : "$0.00"}
              </p>
            </div>
            <button
              type="button"
              aria-label={hidden ? "Show balance" : "Hide balance"}
              onClick={() => setHidden((h) => !h)}
              className="pt-1"
            >
              <EyeOff className="size-6 text-cash-ink" strokeWidth={2.2} />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2">
            <button
              type="button"
              className="h-14 rounded-full bg-surface-raised font-display text-[17px] font-semibold text-cash-ink shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
            >
              Add money
            </button>
            <button
              type="button"
              className="h-14 rounded-full font-display text-[17px] font-semibold text-black/35"
            >
              Withdraw
            </button>
          </div>

          <article className="mt-4 rounded-3xl bg-surface-raised p-5">
            <p className="font-display text-[15px] font-semibold text-cash-ink">Taxes</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#5a15d0]">
                <Landmark className="size-4 text-white" strokeWidth={2.5} />
              </span>
              <p className="font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-cash-ink">
                Estimate your
                <br />
                tax refund
              </p>
            </div>
          </article>

          <h2 className="mt-8 font-display text-[24px] font-semibold tracking-[-0.02em] text-cash-ink">
            More for you
          </h2>

          <article className="mt-4 rounded-3xl bg-surface-raised p-5">
            <p className="font-display text-[15px] font-semibold text-cash-ink">Tags</p>
            <p className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] text-cash-ink">
              A magical new
              <br />
              way to pay
            </p>
            <div className="mt-6 flex h-40 items-end justify-between">
              <Heart className="size-14 text-cash-ink" fill="currentColor" strokeWidth={0} />
              <Sparkles className="size-20 text-black/15" strokeWidth={1.5} />
              <CreditCard className="size-16 text-cash/70" strokeWidth={1.5} />
            </div>
          </article>

          <div className="mt-8 space-y-7">
            {offers.map(({ label, sub, Icon }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-raised">
                  <Icon className="size-5 text-cash-ink" strokeWidth={2.2} />
                </span>
                <div className="flex-1">
                  <p className="font-display text-[19px] font-semibold tracking-[-0.01em] text-cash-ink">
                    {label}
                  </p>
                  <p className="font-display text-[17px] text-cash-ink/80">{sub}</p>
                </div>
                <button
                  type="button"
                  className="h-11 rounded-full bg-surface-raised px-6 font-display text-[17px] font-semibold text-cash-ink"
                >
                  Start
                </button>
              </div>
            ))}
          </div>

          <hr className="mt-8 border-black/10" />

          <h2 className="mt-8 font-display text-[24px] font-semibold tracking-[-0.02em] text-cash-ink">
            Add money
          </h2>

          <div className="mt-6 space-y-8">
            {addMoney.map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                className="flex w-full items-center gap-6 text-left"
              >
                <Icon className="size-6 shrink-0 text-cash-ink" strokeWidth={2.2} />
                <span className="flex-1 font-display text-[19px] font-semibold tracking-[-0.01em] text-cash-ink">
                  {label}
                </span>
                <ChevronRight className="size-5 text-cash-ink" strokeWidth={2.5} />
              </button>
            ))}
          </div>

          <hr className="mt-8 border-black/10" />

          <div className="mt-6 space-y-4 font-mono text-[12px] leading-relaxed text-cash-ink/45">
            <p>
              If you don't have a Cash App Card, a sponsored account, or sponsor an account, your
              Cash App and savings balances are not deposit products and therefore are not
              protected by FDIC pass-through insurance.
            </p>
            <p>
              Banking services provided by Cash App's bank partner(s). Brokerage services by Cash
              App Investing LLC. member FINRA, subsidiary of Block, Inc. Bitcoin services by Block,
              Inc. Tax filing services by Cash App Taxes.
            </p>
            <p className="font-semibold text-cash-ink underline">Disclosures</p>
          </div>
        </>
      )}
    </div>
  );
}

const offers = [
  { label: "Stocks", sub: "Invest with $1", Icon: TrendingUp },
  { label: "Pools", sub: "Collect money with anyone", Icon: Box },
  { label: "Savings", sub: "Save for a goal", Icon: Flower2 },
  { label: "Bitcoin", sub: "Buy, use, and earn", Icon: Bitcoin },
];

const addMoney = [
  { label: "Deposit paper money", Icon: Banknote },
  { label: "Deposit check", Icon: ScanLine },
  { label: "Auto reload", Icon: Repeat },
];
