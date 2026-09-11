import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Plus, X, CreditCard, Wallet } from "lucide-react";
import { haptic, speakMoney, useCash } from "./store";

function CashLoading() {
  return (
    <svg
      className="animate-spin text-cash-ink"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
    >
      <path
        d="M18 4C18 2.89543 18.8954 2 20 2C25.5228 2 30.5228 4.61429 33.364 8.81966C34.0503 9.83958 33.7681 11.2237 32.7482 11.91C31.7283 12.5963 30.3442 12.3141 29.6579 11.2942C27.5334 8.13359 23.9557 6 20 6C18.8954 6 18 5.10457 18 4Z"
        fill="currentColor"
      />
      <path
        d="M32.7482 24.09C33.7681 24.7763 34.0503 26.1604 33.364 27.1803C30.5228 31.3857 25.5228 34 20 34C18.8954 34 18 33.1046 18 32C18 30.8954 18.8954 30 20 30C23.9557 30 27.5334 27.8664 29.6579 24.7058C30.3442 23.6859 31.7283 23.4037 32.7482 24.09Z"
        fill="currentColor"
      />
      <path
        d="M8.81966 2.63604C9.83958 1.94969 11.2237 2.23189 11.91 3.25182C12.5963 4.27174 12.3141 5.65584 11.2942 6.34219C8.13359 8.46656 6 12.0443 6 16C6 17.1046 5.10457 18 4 18C2.89543 18 2 17.1046 2 16C2 10.4772 4.61429 5.47716 8.81966 2.63604Z"
        fill="currentColor"
      />
    </svg>
  );
}

const quick = [10, 25, 50, 100, 200];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

type Source = "discover" | "applepay";

function DiscoverBadge() {
  return (
    <span className="rounded-[3px] bg-[#f26e21] px-1 py-[2px] font-display text-[8px] font-bold tracking-[0.02em] text-white">
      DISC<span className="text-white">O</span>VER
    </span>
  );
}

export function sanitizeAmount(raw: string) {
  let v = raw.replace(/[^0-9.]/g, "");
  const first = v.indexOf(".");
  if (first !== -1) v = v.slice(0, first + 1) + v.slice(first + 1).replace(/\./g, "");
  const [whole, dec] = v.split(".");
  const w = (whole ?? "").replace(/^0+(?=\d)/, "").slice(0, 9);
  return dec === undefined ? w : `${w || "0"}.${dec.slice(0, 2)}`;
}


function Amount({ value }: { value: string }) {
  const [whole, decimals] = value.split(".");
  const grouped = Number(whole || 0).toLocaleString("en-US");
  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Amount ${speakMoney(Number(value || 0))}`}
      className="font-display text-[64px] font-bold leading-none tracking-[-0.04em] text-cash-ink"
    >
      ${grouped}
      {value.includes(".") ? (
        <span className="text-cash-ink/30">.{(decimals ?? "").padEnd(2, "0").slice(0, 2)}</span>
      ) : null}
    </p>
  );
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "<"];

/** In-app number pad for the Add money amount screen. */
function Keypad({ onPress }: { onPress: (k: string) => void }) {
  return (
    <div role="group" aria-label="Number pad" className="grid grid-cols-3 gap-y-2">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          aria-label={k === "<" ? "Delete" : k === "." ? "Decimal point" : k}
          onClick={() => {
            haptic();
            onPress(k);
          }}
          className="mx-auto flex h-16 w-full items-center justify-center font-display text-[30px] font-semibold text-cash-ink active:opacity-40"
        >
          {k === "<" ? "⌫" : k}
        </button>
      ))}
    </div>
  );
}

const fieldClass = (filled: boolean) =>
  `mt-2 h-[52px] w-full rounded-xl border bg-surface px-4 font-display text-[16px] outline-none placeholder:text-cash-ink/35 focus:border-cash-ink ${
    filled ? "border-cash-ink/40 text-cash-ink" : "border-cash-ink/15 text-cash-ink"
  }`;

export function AddMoneyFlow({ onClose }: { onClose: () => void }) {
  const { balance, addFunds, announce } = useCash();
  const [step, setStep] = useState<"sheet" | "amount" | "source" | "card" | "form" | "done">(
    "sheet",
  );
  const [added, setAdded] = useState(0);
  const [up, setUp] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [digits, setDigits] = useState("");
  const [source, setSource] = useState<Source>("discover");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  

  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setUp(true));
    return () => {
      cancelAnimationFrame(id);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const go = (next: typeof step) => {
    setLoading(true);
    timer.current = setTimeout(() => {
      setStep(next);
      setLoading(false);
    }, 650);
  };


  const confirm = (amount: number) => {
    if (amount <= 0) return;
    haptic();
    addFunds(amount);
    setAdded(amount);
    announce(`You added ${speakMoney(amount)} to your Cash App`);
    go("done");
  };

  const typed = digits ? Number(digits) : 0;
  const sourceLabel = source === "discover" ? "Discover debit 9607" : "Apple Pay";

  const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);


  const SourceRow = ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-2 py-2 text-left">
      <span className="font-display text-[16px] text-cash-ink">From</span>
      <DiscoverBadge />
      <span className="flex-1 font-display text-[16px] font-semibold text-cash-ink">
        {sourceLabel}
      </span>
      <ChevronRight className="size-4 text-cash-ink/40" strokeWidth={2.5} />
    </button>
  );

  const CloseX = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-full bg-cash-ink/[0.04]"
    >
      <X className="size-5 text-cash-ink" strokeWidth={2.6} />
    </button>
  );

  if (loading) {
    return (
      <div className="absolute inset-0 z-50 flex justify-center bg-surface pt-[26vh] animate-fade-in">
        <CashLoading />
      </div>
    );
  }

  if (step === "done") {
    const shown = Number.isInteger(added) ? `$${added.toLocaleString("en-US")}` : money(added);
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface animate-fade-in">
        <div className="flex-1 px-6 pt-10">
          <span className="flex size-14 items-center justify-center rounded-full bg-cash">
            <Check className="size-8 text-white" strokeWidth={3.2} />
          </span>
          <h2
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-6 font-display text-[34px] font-bold leading-[1.12] tracking-[-0.02em] text-cash-ink"
          >
            You added {shown} to your Cash App
          </h2>
        </div>
        <div className="px-5 pb-8">
          <button
            type="button"
            aria-label="Done, back to Cash balance"
            onClick={() => {
              haptic();
              onClose();
            }}
            className="h-[56px] w-full rounded-full bg-cash font-display text-[18px] font-bold text-cash-key active:opacity-80"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (step === "form") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface animate-fade-in">
        <div className="px-5 pt-4">
          <CloseX onClick={() => go("card")} label="Close link card" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-3">
          <h2 className="font-display text-[26px] font-bold tracking-[-0.02em] text-cash-ink">
            Link a new debit card
          </h2>
          <p className="mt-2 font-display text-[15px] leading-snug text-cash-ink/70">
            Your linked debit card has expired. Link a new one to move money in and out of your Cash
            App balance.
          </p>

          <p className="mt-5 font-display text-[13px] font-semibold text-cash-ink">
            Debit Card Number
          </p>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            enterKeyHint="next"
            autoFocus
            placeholder="Debit Card Number"
            aria-label="Debit card number"
            value={card}
            onChange={(e) => setCard(onlyDigits(e.target.value, 16))}
            className={fieldClass(Boolean(card))}
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="font-display text-[13px] font-semibold text-cash-ink">Expiration date</p>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                aria-label="Expiration date"
                value={exp}
                onChange={(e) => setExp(onlyDigits(e.target.value, 4))}
                className={fieldClass(Boolean(exp))}
              />
            </div>
            <div>
              <p className="font-display text-[13px] font-semibold text-cash-ink">CVV</p>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="3 Digit CVV"
                aria-label="CVV"
                value={cvv}
                onChange={(e) => setCvv(onlyDigits(e.target.value, 3))}
                className={fieldClass(Boolean(cvv))}
              />
            </div>
          </div>

        </div>

        <div className="px-5 pb-3">
          <button
            type="button"
            disabled={card.length < 15 || exp.length < 4 || cvv.length < 3}
            onClick={() => go("source")}
            className="h-[52px] w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised active:opacity-80 disabled:bg-[#adadad] disabled:text-surface-raised/70"
          >
            Link Card
          </button>
        </div>
        
      </div>
    );
  }

  if (step === "card") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface animate-fade-in">
        <div className="px-5 pt-4">
          <CloseX onClick={() => go("source")} label="Close link card" />
        </div>
        <div className="flex-1 px-5 pt-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-cash">
            <Wallet className="size-6 text-cash-ink" strokeWidth={2.2} />
          </span>
          <h2 className="mt-4 font-display text-[26px] font-bold tracking-[-0.02em] text-cash-ink">
            Link a new debit card
          </h2>
          <p className="mt-2 font-display text-[15px] leading-snug text-cash-ink/70">
            Your linked debit card has expired. Link a new one to send payments or move money in and
            out of Cash App.
          </p>

          <hr className="mt-6 border-cash-ink/10" />

          <div className="flex items-center gap-4 py-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-cash-ink/[0.05]">
              <CreditCard className="size-5 text-cash-ink" strokeWidth={2} />
            </span>
            <div>
              <p className="font-display text-[16px] font-semibold text-cash-ink">Debit card 9607</p>
              <p className="font-display text-[14px] text-alert">Expired 08/25</p>
            </div>
          </div>
        </div>
        <div className="px-5 pb-8">
          <button
            type="button"
            onClick={() => go("form")}
            className="h-[52px] w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised active:opacity-80"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "source") {
    const Radio = ({ on }: { on: boolean }) => (
      <span
        className={`flex size-[22px] items-center justify-center rounded-full border-2 ${
          on ? "border-cash-ink" : "border-cash-ink/20"
        }`}
      >
        {on ? <span className="size-[11px] rounded-full bg-cash-ink" /> : null}
      </span>
    );
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface animate-fade-in">
        <div className="px-5 pt-4">
          <CloseX onClick={() => setStep("amount")} label="Close add money from" />
        </div>
        <div className="flex-1 px-5 pt-3">
          <h2 className="font-display text-[26px] font-bold tracking-[-0.02em] text-cash-ink">
            Add money from
          </h2>

          <button
            type="button"
            onClick={() => setSource("discover")}
            className="mt-5 flex w-full items-center gap-4 text-left"
          >
            <DiscoverBadge />
            <span className="flex-1 font-display text-[16px] font-semibold text-cash-ink">
              Discover debit 9607
            </span>
            <Radio on={source === "discover"} />
          </button>

          <button
            type="button"
            onClick={() => setSource("applepay")}
            className="mt-6 flex w-full items-center gap-4 text-left"
          >
            <span className="rounded-[4px] border border-cash-ink/15 bg-surface-raised px-1.5 py-1 font-display text-[10px] font-semibold text-cash-ink">
              Pay
            </span>
            <span className="flex-1">
              <span className="block font-display text-[16px] font-semibold text-cash-ink">
                Apple Pay
              </span>
              <span className="block font-display text-[14px] text-cash-ink/45">
                Use a debit card
              </span>
            </span>
            <Radio on={source === "applepay"} />
          </button>

          <button
            type="button"
            onClick={() => go("card")}
            className="mt-6 flex w-full items-center gap-4 text-left"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-cash-ink/[0.05]">
              <Plus className="size-5 text-cash-ink" strokeWidth={2.4} />
            </span>
            <span className="flex-1">
              <span className="block font-display text-[16px] font-semibold text-cash-ink">
                Link new debit card
              </span>
              <span className="block font-display text-[14px] text-cash-ink/45">
                Add money instantly
              </span>
            </span>
          </button>
        </div>
        <div className="px-5 pb-8">
          <button
            type="button"
            onClick={() => setStep("amount")}
            className="h-[52px] w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised active:opacity-80"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (step === "amount") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface animate-fade-in">
        <div className="relative px-5 pt-4">
          <div className="absolute left-5 top-3">
            <CloseX onClick={onClose} label="Close add money" />
          </div>
          <div className="text-center">
            <p className="font-display text-[17px] font-bold text-cash-ink">Amount</p>
            <p className="mt-1 font-display text-[14px] text-cash-ink/45">
              Cash Balance: {money(balance)}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5">
          <Amount value={digits || "0"} />
        </div>

        <div className="px-5">
          <Keypad
            onPress={(k) =>
              setDigits((d) => {
                if (k === "<") return d.slice(0, -1);
                if (k === "." && d.includes(".")) return d;
                return sanitizeAmount((d || "") + k);
              })
            }
          />
        </div>

        <div className="px-5 pb-6 pt-3">
          <button
            type="button"
            disabled={typed <= 0}
            aria-label={typed > 0 ? `Continue, add ${speakMoney(typed)} to Cash balance` : "Continue"}
            onClick={() => {
              confirm(typed);
            }}
            className="h-[56px] w-full rounded-full bg-cash-ink font-display text-[18px] font-semibold text-surface-raised active:opacity-80 disabled:bg-[#adadad] disabled:text-surface-raised/70"
          >
            Continue
          </button>
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
        className={`flex-1 cursor-default bg-cash-ink/35 transition-opacity duration-300 ${
          up ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`rounded-t-[22px] bg-surface px-5 pb-8 pt-3 transition-transform duration-[320ms] ease-out ${
          up ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <span className="mx-auto block h-1 w-9 rounded-full bg-cash-ink/15" />

        <div className="mt-3 text-center">
          <h2 className="font-display text-[19px] font-bold text-cash-ink">Add money</h2>
          <p className="font-display text-[14px] text-cash-ink/45">Cash balance {money(balance)}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {quick.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={picked === value}
              aria-label={speakMoney(value)}
              onClick={() => {
                haptic();
                setPicked(value);
                announce(`${speakMoney(value)} selected`);
              }}
              className={`h-[52px] rounded-xl border font-display text-[17px] font-semibold text-cash-ink active:opacity-70 ${
                picked === value ? "border-cash-ink bg-cash-ink/[0.04]" : "border-cash-ink/10 bg-surface"
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
            className="h-[52px] rounded-xl border border-cash-ink/10 bg-surface font-display text-[17px] font-semibold text-cash-ink active:opacity-70"
          >
            •••
          </button>
        </div>

        <div className="mt-3">
          <SourceRow onClick={() => go("source")} />
        </div>

        <button
          type="button"
          disabled={picked === null}
          aria-label={picked !== null ? `Add ${speakMoney(picked)} to Cash balance` : "Add"}
          onClick={() => {
            if (picked !== null) confirm(picked);
          }}
          className="mt-2 h-[52px] w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised active:opacity-80 disabled:bg-[#adadad] disabled:text-surface-raised/70"
        >
          Add
        </button>
      </div>
    </div>
  );
}
