import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, X, Zap } from "lucide-react";
import { groupDisplay, haptic, speakMoney, useCash } from "./store";
import { FitAmount } from "./FitAmount";
import { sanitizeAmount } from "./AddMoneyFlow";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "<"];

/** Next Thursday, used as the standard deposit arrival day. */
export function standardDay() {
  const d = new Date();
  const delta = (4 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + delta);
  return d.toLocaleDateString([], { weekday: "long" });
}

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

export function WithdrawFlow({ onClose }: { onClose: () => void }) {
  const { balance, withdrawFunds, announce } = useCash();
  const [step, setStep] = useState<"amount" | "speed" | "done">("amount");
  const [digits, setDigits] = useState("");
  const [speed, setSpeed] = useState<"standard" | "instant" | null>(null);
  const [taken, setTaken] = useState(0);
  const [up, setUp] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setUp(true));
    return () => {
      cancelAnimationFrame(id);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const typed = digits ? Number(digits) : 0;
  const day = standardDay();
  const shownTyped = Number.isInteger(typed) ? `$${typed.toLocaleString("en-US")}` : money(typed);

  if (step === "done") {
    const shown = Number.isInteger(taken) ? `$${taken.toLocaleString("en-US")}` : money(taken);
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface animate-fade-in">
        <div className="flex-1 px-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-cash-ink/[0.05]"
          >
            <X className="size-5 text-cash-ink" strokeWidth={2.6} />
          </button>
          <span className="mt-6 flex size-14 items-center justify-center rounded-full bg-cash">
            <Check className="size-8 text-white" strokeWidth={3.2} />
          </span>
          <h2
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-6 font-display text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-cash-ink"
          >
            {shown} will be available in your external bank account{" "}
            {speed === "instant" ? "instantly" : day}
          </h2>
        </div>
        <div className="px-5 pb-8">
          <button
            type="button"
            onClick={() => {
              haptic();
              onClose();
            }}
            className="h-[56px] w-full rounded-full bg-cash-ink font-display text-[18px] font-bold text-surface-raised active:opacity-80"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (step === "speed") {
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
      <div className="absolute inset-0 z-50 flex flex-col justify-end">
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setStep("amount")}
          className="flex-1 cursor-default bg-cash-ink/35"
        />
        <div className="rounded-t-[22px] bg-surface px-5 pb-8 pt-3 animate-slide-up-sheet">
          <span className="mx-auto block h-1 w-9 rounded-full bg-cash-ink/15" />
          <h2 className="mt-4 font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-cash-ink">
            How do you want to withdraw {shownTyped}?
          </h2>

          <button type="button" className="mt-5 flex w-full items-center gap-2 text-left">
            <span className="font-display text-[15px] text-cash-ink">To</span>
            <span className="flex size-6 items-center justify-center rounded-full bg-cash font-display text-[13px] font-bold text-white">
              $
            </span>
            <span className="flex-1 font-display text-[15px] font-semibold text-cash-ink">
              Checking •••• 9206
            </span>
            <ChevronRight className="size-4 text-cash-ink/40" strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={() => {
              haptic();
              setSpeed("standard");
            }}
            className={`mt-5 flex h-[58px] w-full items-center gap-4 rounded-2xl border px-5 text-left ${
              speed === "standard" ? "border-cash-ink" : "border-cash-ink/10 bg-surface-raised"
            }`}
          >
            <span className="flex-1 font-display text-[16px] font-semibold text-cash-ink">
              Standard ({day})
            </span>
            <Radio on={speed === "standard"} />
          </button>

          <button
            type="button"
            onClick={() => {
              haptic();
              setSpeed("instant");
            }}
            className={`mt-3 flex h-[58px] w-full items-center gap-4 rounded-2xl border px-5 text-left ${
              speed === "instant" ? "border-cash-ink" : "border-cash-ink/10 bg-surface-raised"
            }`}
          >
            <span className="flex flex-1 items-center gap-1 font-display text-[16px] font-semibold text-cash-ink">
              Instant <Zap className="size-4" strokeWidth={2.6} />
            </span>
            <span className="font-display text-[15px] text-cash-ink/60">$0.50 Fee</span>
            <Radio on={speed === "instant"} />
          </button>

          <button
            type="button"
            disabled={!speed}
            onClick={() => {
              haptic();
              withdrawFunds(typed);
              setTaken(typed);
              announce(`${speakMoney(typed)} withdrawn to your bank account`);
              setStep("done");
            }}
            className="mt-6 h-[56px] w-full rounded-full bg-cash-ink font-display text-[18px] font-semibold text-surface-raised active:opacity-80 disabled:bg-[#adadad] disabled:text-surface-raised/70"
          >
            Withdraw
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
        className={`rounded-t-[22px] bg-surface px-5 pb-6 pt-3 transition-transform duration-[320ms] ease-out ${
          up ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <span className="mx-auto block h-1 w-9 rounded-full bg-cash-ink/15" />
        <div className="mt-3 text-center">
          <h2 className="font-display text-[22px] font-bold text-cash-ink">Withdraw</h2>
          <p className="font-display text-[14px] text-cash-ink/45">
            Cash balance: {money(balance)}
          </p>
        </div>

        <div className="my-6">
          <FitAmount
            text={groupDisplay(digits || "0")}
            value={typed}
            base={64}
            min={22}
            className="font-display font-bold tracking-[-0.04em] text-cash-ink"
          />
        </div>

        <button
          type="button"
          disabled={typed <= 0 || typed > balance}
          aria-label={typed > 0 ? `Continue, withdraw ${speakMoney(typed)}` : "Continue"}
          onClick={() => {
            haptic();
            setStep("speed");
          }}
          className="h-[56px] w-full rounded-full bg-cash-ink font-display text-[18px] font-semibold text-surface-raised active:opacity-80 disabled:bg-[#adadad] disabled:text-surface-raised/70"
        >
          Continue
        </button>

        <div className="mt-3">
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
      </div>
    </div>
  );
}
