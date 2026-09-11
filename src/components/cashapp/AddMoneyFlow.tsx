import { useState } from "react";
import { Check, Delete, X } from "lucide-react";
import { useCash } from "./store";

type Step = "sheet" | "amount" | "done";

const quick = [10, 25, 50, 100, 200, 300];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const source = "The Bancorp Bank debit 2273";

function SourceRow() {
  return (
    <span className="flex items-center gap-2 font-display text-[15px] text-cash-ink">
      <span className="text-cash-ink/50">From</span>
      <span className="rounded bg-[#1b2f8a] px-1.5 py-0.5 font-display text-[11px] font-bold text-white">
        PayPal
      </span>
      <span className="truncate font-semibold">{source}</span>
    </span>
  );
}

export function AddMoneyFlow({ onClose }: { onClose: () => void }) {
  const { balance, addFunds, autoReload, setAutoReload } = useCash();
  const [step, setStep] = useState<Step>("sheet");
  const [digits, setDigits] = useState("");
  const [added, setAdded] = useState(0);

  const amount = digits ? Number(digits) : 0;

  const press = (key: string) => {
    if (key === "back") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    setDigits((d) => (d === "" && key === "0" ? "" : (d + key).slice(0, 6)));
  };

  if (step === "done") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface px-6 pb-6 pt-8">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-cash">
          <Check className="size-8 text-white" strokeWidth={3} />
        </span>
        <h2 className="mt-6 font-display text-[38px] font-bold leading-[1.08] tracking-[-0.02em] text-cash-ink">
          You added ${added} to your balance
        </h2>

        <h3 className="mt-10 font-display text-[22px] font-bold text-cash-ink">Auto reload</h3>
        <p className="mt-2 font-display text-[16px] leading-snug text-cash-ink/55">
          Automatically add $20 from your default payment method if your balance falls below $20.
        </p>

        <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
          {[
            { label: "Auto reload on", on: true },
            { label: "Auto reload off", on: false },
          ].map((row) => (
            <button
              key={row.label}
              type="button"
              onClick={() => setAutoReload(row.on)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="font-display text-[17px] font-semibold text-cash-ink">
                {row.label}
              </span>
              <span
                className={`size-5 rounded-full border-2 ${
                  autoReload === row.on
                    ? "border-cash-ink bg-cash-ink ring-2 ring-inset ring-white"
                    : "border-black/25"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          className="h-14 shrink-0 rounded-full bg-cash-ink font-display text-[17px] font-semibold text-white active:opacity-80"
        >
          Confirm reload settings
        </button>
      </div>
    );
  }

  if (step === "amount") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface px-6 pb-6 pt-4">
        <div className="relative flex shrink-0 items-center justify-center">
          <button
            type="button"
            aria-label="Close add money"
            onClick={() => setStep("sheet")}
            className="absolute left-0"
          >
            <X className="size-7 text-cash-ink" strokeWidth={2.5} />
          </button>
          <div className="text-center">
            <p className="font-display text-[17px] font-semibold text-cash-ink">Add money</p>
            <p className="font-display text-[13px] text-cash-ink/50">
              Cash balance {money(balance)}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <p className="font-display text-[72px] font-bold leading-none tracking-[-0.04em] text-cash-ink">
            ${amount}
          </p>
        </div>

        <div className="mb-3 shrink-0">
          <SourceRow />
        </div>

        <button
          type="button"
          disabled={amount <= 0}
          onClick={() => {
            addFunds(amount);
            setAdded(amount);
            setStep("done");
          }}
          className="h-14 shrink-0 rounded-full bg-cash-ink font-display text-[19px] font-semibold text-white active:opacity-80 disabled:bg-black/10 disabled:text-cash-ink/40"
        >
          Add
        </button>

        <div className="mt-2 grid shrink-0 grid-cols-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"].map((key, i) => (
            <button
              key={i}
              type="button"
              aria-label={key === "back" ? "Backspace" : key || "blank"}
              disabled={key === ""}
              onClick={() => press(key)}
              className="flex h-14 items-center justify-center font-display text-[28px] font-semibold text-cash-ink active:opacity-50"
            >
              {key === "back" ? <Delete className="size-7" strokeWidth={2.2} /> : key}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/30">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="flex-1 cursor-default"
      />
      <div className="rounded-t-[26px] bg-surface-raised px-6 pb-8 pt-3">
        <span className="mx-auto block h-1 w-9 rounded-full bg-black/20" />

        <div className="mt-4 text-center">
          <h2 className="font-display text-[26px] font-bold tracking-[-0.02em] text-cash-ink">
            Add money
          </h2>
          <p className="font-display text-[14px] text-cash-ink/50">
            Cash balance {money(balance)}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {quick.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setDigits(String(value));
                setStep("amount");
              }}
              className="h-16 rounded-2xl border border-black/10 bg-surface font-display text-[19px] font-semibold text-cash-ink active:opacity-70"
            >
              ${value}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setStep("amount")}
          className="mt-5 flex w-full text-left"
        >
          <SourceRow />
        </button>

        <button
          type="button"
          onClick={() => setStep("amount")}
          className="mt-4 h-14 w-full rounded-full bg-cash-ink font-display text-[19px] font-semibold text-white active:opacity-80"
        >
          Add
        </button>
      </div>
    </div>
  );
}
