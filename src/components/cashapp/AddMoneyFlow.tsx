import { useState } from "react";
import { ChevronRight, Delete, X } from "lucide-react";
import { useCash } from "./store";

const quick = [10, 25, 50, 100, 200];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function DiscoverRow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 py-2 text-left"
    >
      <span className="font-display text-[16px] text-cash-ink">From</span>
      <span className="rounded-[3px] border border-black/15 bg-white px-1 py-[2px] font-display text-[9px] font-bold tracking-[0.02em] text-cash-ink">
        DISC<span className="text-[#f26e21]">O</span>VER
      </span>
      <span className="flex-1 font-display text-[16px] font-semibold text-cash-ink">
        Discover debit 9607
      </span>
      <ChevronRight className="size-4 text-cash-ink/40" strokeWidth={2.5} />
    </button>
  );
}

function Amount({ value }: { value: string }) {
  const [whole, decimals] = value.split(".");
  const grouped = Number(whole || 0).toLocaleString("en-US");
  return (
    <p className="font-display text-[64px] font-bold leading-none tracking-[-0.04em] text-cash-ink">
      ${grouped}
      {value.includes(".") ? (
        <span className="text-cash-ink/30">.{(decimals ?? "").padEnd(2, "0").slice(0, 2)}</span>
      ) : null}
    </p>
  );
}

const keys = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  [".", ""],
  ["0", ""],
  ["back", ""],
];

export function AddMoneyFlow({ onClose }: { onClose: () => void }) {
  const { balance, addFunds } = useCash();
  const [step, setStep] = useState<"sheet" | "amount">("sheet");
  const [picked, setPicked] = useState<number | null>(null);
  const [digits, setDigits] = useState("");

  const typed = digits ? Number(digits) : 0;

  const press = (key: string) => {
    if (key === "back") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    setDigits((d) => {
      if (key === ".") return d.includes(".") ? d : (d || "0") + ".";
      if (d === "0") return key;
      const [, dec] = d.split(".");
      if (dec !== undefined && dec.length >= 2) return d;
      return (d + key).slice(0, 12);
    });
  };

  if (step === "amount") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface">
        <div className="relative px-5 pt-4">
          <button
            type="button"
            aria-label="Close add money"
            onClick={onClose}
            className="absolute left-5 top-3 flex size-9 items-center justify-center rounded-full bg-black/[0.04]"
          >
            <X className="size-5 text-cash-ink" strokeWidth={2.6} />
          </button>
          <div className="text-center">
            <p className="font-display text-[15px] font-semibold text-cash-ink">Add money</p>
            <p className="font-display text-[14px] text-cash-ink/45">
              Cash balance {money(balance)}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5">
          <Amount value={digits || "0"} />
        </div>

        <div className="px-5">
          <DiscoverRow />
        </div>

        <div className="px-5 pt-3">
          <button
            type="button"
            disabled={typed <= 0}
            onClick={() => {
              addFunds(typed);
              onClose();
            }}
            className="h-[52px] w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-white active:opacity-80 disabled:bg-[#adadad] disabled:text-white/70"
          >
            Add
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-2 bg-[#d6dae1] px-1.5 pb-8 pt-2">
          {keys.map(([key = "", letters = ""]) => (
            <button
              key={key}
              type="button"
              aria-label={key === "back" ? "Backspace" : key}
              onClick={() => press(key)}
              className={`flex h-[46px] flex-col items-center justify-center rounded-[6px] font-display text-cash-ink active:opacity-60 ${
                key === "." || key === "back" ? "bg-transparent" : "bg-white shadow-sm"
              }`}
            >
              {key === "back" ? (
                <Delete className="size-6" strokeWidth={1.8} />
              ) : (
                <>
                  <span className="text-[24px] font-normal leading-none">{key}</span>
                  {letters ? (
                    <span className="mt-0.5 text-[9px] font-semibold tracking-[0.12em]">
                      {letters}
                    </span>
                  ) : null}
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="flex-1 cursor-default bg-black/35"
      />
      <div className="rounded-t-[22px] bg-surface px-5 pb-8 pt-3">
        <span className="mx-auto block h-1 w-9 rounded-full bg-black/15" />

        <div className="mt-3 text-center">
          <h2 className="font-display text-[19px] font-bold text-cash-ink">Add money</h2>
          <p className="font-display text-[14px] text-cash-ink/45">
            Cash balance {money(balance)}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {quick.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPicked(value)}
              className={`h-[52px] rounded-xl border font-display text-[17px] font-semibold text-cash-ink active:opacity-70 ${
                picked === value ? "border-cash-ink bg-black/[0.04]" : "border-black/10 bg-surface"
              }`}
            >
              ${value}
            </button>
          ))}
          <button
            type="button"
            aria-label="Enter another amount"
            onClick={() => {
              setDigits("");
              setStep("amount");
            }}
            className="h-[52px] rounded-xl border border-black/10 bg-surface font-display text-[17px] font-semibold text-cash-ink active:opacity-70"
          >
            •••
          </button>
        </div>

        <div className="mt-3">
          <DiscoverRow onClick={() => setStep("amount")} />
        </div>

        <button
          type="button"
          disabled={picked === null}
          onClick={() => {
            if (picked !== null) addFunds(picked);
            onClose();
          }}
          className="mt-2 h-[52px] w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-white active:opacity-80 disabled:bg-[#adadad] disabled:text-white/70"
        >
          Add
        </button>
      </div>
    </div>
  );
}
