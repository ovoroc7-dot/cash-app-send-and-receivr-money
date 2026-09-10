import { money, useCash } from "./store";

export function CardScreen() {
  return (
    <div className="h-full overflow-y-auto bg-surface px-5 pb-28 pt-5">
      <h1 className="font-display text-2xl font-bold tracking-tight">Cash Card</h1>
      <div className="mt-6 aspect-[1.6] w-full rounded-3xl bg-cash-ink p-6 text-cash shadow-xl">
        <p className="font-display text-lg font-semibold">$jamie</p>
        <p className="mt-16 font-display text-2xl font-bold tracking-widest">•••• 4821</p>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Free customizable debit card, spend your Cash balance anywhere.
      </p>
    </div>
  );
}

export function InvestScreen() {
  return (
    <div className="h-full overflow-y-auto bg-surface px-5 pb-28 pt-5">
      <h1 className="font-display text-2xl font-bold tracking-tight">Investing</h1>
      <div className="mt-6 rounded-3xl bg-surface-raised p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Portfolio value</p>
        <p className="mt-1 font-display text-4xl font-bold tracking-tight">$0.00</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Buy stocks and bitcoin with as little as $1.
        </p>
      </div>
    </div>
  );
}

export function ActivityScreen() {
  const { txns } = useCash();
  return (
    <div className="h-full overflow-y-auto bg-surface px-5 pb-28 pt-5">
      <h1 className="font-display text-2xl font-bold tracking-tight">Activity</h1>
      {txns.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Payments, requests and deposits show up here.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {txns.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-2xl bg-surface-raised p-4 shadow-sm"
            >
              <div>
                <p className="font-display font-semibold">{t.party}</p>
                <p className="text-sm text-muted-foreground">
                  {t.kind === "deposit" ? "Added" : t.kind === "pay" ? "Paid" : "Requested"} ·{" "}
                  {t.note}
                </p>
              </div>
              <span
                className={`font-display font-bold ${
                  t.kind === "pay" ? "text-foreground" : "text-cash-deep"
                }`}
              >
                {t.kind === "pay" ? "-" : "+"}
                {money(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
