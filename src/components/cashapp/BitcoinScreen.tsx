import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowDownUp,
  ChevronRight,
  Map as MapIcon,
  ScanLine,
  X,
  HelpCircle,
  Repeat,
  Users,
  RotateCw,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { haptic, useCash } from "./store";

const BTC_PRICE = 66405.26;
const BTC_SATS = "1,492";
const ranges = ["1D", "1W", "1M", "1Y", "ALL"] as const;
const amounts = ["$1", "$10", "$20", "$50", "$100", "•••"];
const frequencies = ["One-time order", "Daily", "Weekly", "Bi-weekly", "Monthly"] as const;

type Freq = (typeof frequencies)[number];
type Step = "main" | "buy" | "orderType" | "intro" | "frequency" | "confirm" | "loading";

/** Deterministic price line, shaped like the reference chart. */
const points = [
  38, 34, 40, 46, 52, 48, 55, 60, 57, 62, 58, 54, 60, 52, 46, 50, 44, 38, 42, 36, 40, 34, 30, 36,
  28, 32, 26, 22, 28, 20, 24, 18, 22, 14, 18, 12, 16, 10, 14, 8, 12, 6, 10, 4, 8, 3, 9, 5, 11, 7,
];

function PriceChart() {
  const w = 100;
  const h = 64;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${((i / (points.length - 1)) * w).toFixed(2)},${((p / 64) * h).toFixed(2)}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Bitcoin price over the last day, trending up"
      className="h-[190px] w-full"
    >
      <path d={path} fill="none" stroke="#22e33a" strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const growItems = [
  { Icon: Users, title: "Receive as bitcoin", sub: "Get bitcoin whenever friends pay you" },
  { Icon: RotateCw, title: "Bitcoin Round Ups", sub: "Invest your spare change" },
  { Icon: Repeat, title: "Auto Invest", sub: "Set up recurring buys" },
  { Icon: Wallet, title: "Paid in bitcoin", sub: "Invest your direct deposits into bitcoin without a fee" },
];

export function BitcoinScreen({ onClose }: { onClose: () => void }) {
  const { balance, announce } = useCash();
  const [step, setStep] = useState<Step>("main");
  const [range, setRange] = useState<string>("1D");
  const [amount, setAmount] = useState<string | null>(null);
  const [freq, setFreq] = useState<Freq>("One-time order");
  const [pendingFreq, setPendingFreq] = useState<Freq>("One-time order");

  useEffect(() => {
    if (step !== "loading") return;
    const t = setTimeout(() => setStep("confirm"), 750);
    return () => clearTimeout(t);
  }, [step]);

  const openBuy = () => {
    haptic();
    setAmount(null);
    setStep("buy");
  };

  const confirmOrder = () => {
    haptic("success");
    announce(`Confirmed. Buy ${amount ?? "$10"} of bitcoin ${freq.toLowerCase()}.`);
    setStep("main");
    setFreq("One-time order");
  };

  const recurring = freq !== "One-time order";
  const freqWord = freq.toLowerCase();

  return (
    <div className="absolute inset-0 z-30 bg-surface">
      {/* ---------- Bitcoin detail ---------- */}
      <div className="h-full overflow-y-auto overscroll-contain pb-28">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-surface px-5 pb-2 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)]">
          <button
            type="button"
            aria-label="Back"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full bg-cash-ink/[0.05]"
          >
            <ArrowLeft className="size-5 text-cash-ink" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Bitcoin map"
              className="flex size-10 items-center justify-center rounded-full bg-cash-ink/[0.05]"
            >
              <MapIcon className="size-5 text-cash-ink" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              aria-label="Scan QR code"
              className="flex size-10 items-center justify-center rounded-full bg-cash-ink/[0.05]"
            >
              <ScanLine className="size-5 text-cash-ink" strokeWidth={2.2} />
            </button>
          </div>
        </header>

        <div className="px-6 pt-2">
          <p className="font-display text-[17px] font-semibold text-cash-ink">Bitcoin</p>
          <h1 className="font-display text-[44px] font-bold leading-none tracking-[-0.04em] text-cash-ink">
            ₿{BTC_SATS}
          </h1>
          <p className="mt-1 flex items-center gap-1 font-display text-[13px] text-cash-ink/45">
            $0.99 USD <ArrowDownUp className="size-3" strokeWidth={2.4} />
          </p>
          <p className="mt-5 font-display text-[13px] font-semibold text-cash-ink">↑ 1.48% today</p>
          <p className="font-display text-[13px] text-cash-ink/55">
            ${BTC_PRICE.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
          </p>
        </div>

        <div className="mt-6">
          <PriceChart />
        </div>

        <div role="group" aria-label="Chart range" className="mt-5 flex justify-center gap-2 px-6">
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => {
                haptic();
                setRange(r);
              }}
              className={`h-8 min-w-[52px] rounded-full font-display text-[13px] font-semibold transition-colors duration-100 ${
                range === r ? "bg-cash-ink/[0.08] text-cash-ink" : "text-cash-ink/45"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3 px-6">
          <button
            type="button"
            onClick={openBuy}
            className="h-14 flex-1 rounded-full bg-cash-ink font-display text-[16px] font-semibold text-surface-raised active:opacity-80"
          >
            Buy
          </button>
          <button
            type="button"
            className="h-14 flex-1 rounded-full bg-cash-ink font-display text-[16px] font-semibold text-surface-raised active:opacity-80"
          >
            Sell
          </button>
          <button
            type="button"
            aria-label="Send or receive bitcoin"
            className="flex h-14 flex-1 items-center justify-center rounded-full bg-cash-ink text-surface-raised active:opacity-80"
          >
            <ArrowDownUp className="size-5" strokeWidth={2.4} />
          </button>
        </div>

        <section className="mt-9 px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold tracking-[-0.02em] text-cash-ink">
              My performance
            </h2>
            <button type="button" className="flex items-center gap-1 font-display text-[14px] text-cash-ink/50">
              Details <ChevronRight className="size-4" strokeWidth={2.4} />
            </button>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
              −$0.01
            </span>
            <span className="font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
              -1.00%
            </span>
          </div>
          <p className="mt-1 font-display text-[13px] text-cash-ink/45">All time returns</p>
        </section>

        <hr className="mx-6 mt-8 border-cash-ink/10" />

        <section className="mt-7 px-6">
          <h2 className="font-display text-[20px] font-bold tracking-[-0.02em] text-cash-ink">
            Grow bitcoin over time
          </h2>
          <div className="mt-5 space-y-6">
            {growItems.map(({ Icon, title, sub }) => (
              <button
                key={title}
                type="button"
                onClick={() => {
                  haptic();
                  if (title === "Auto Invest") setStep("intro");
                }}
                className="flex w-full items-center gap-4 text-left active:opacity-70"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cash-ink/[0.06]">
                  <Icon className="size-5 text-cash-ink" strokeWidth={2} />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-[15px] font-semibold text-cash-ink">
                    {title}
                  </span>
                  <span className="block font-display text-[13px] text-cash-ink/50">{sub}</span>
                </span>
                <span className="font-display text-[13px] text-cash-ink/45">Off</span>
                <ChevronRight className="size-4 text-cash-ink/45" strokeWidth={2.4} />
              </button>
            ))}
          </div>
        </section>

        <hr className="mx-6 mt-8 border-cash-ink/10" />

        <section className="mt-7 px-6">
          <p className="font-display text-[13px] text-cash-ink/50">Bitcoin map</p>
          <h2 className="mt-1 font-display text-[24px] font-bold tracking-[-0.02em] text-cash-ink">
            Spend bitcoin locally
          </h2>
          <div className="mt-4 h-40 rounded-3xl bg-cash/10" aria-hidden="true" />
        </section>
      </div>

      {/* ---------- Buy bitcoin sheet ---------- */}
      {step === "buy" && (
        <div className="absolute inset-0 z-40">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setStep("main")}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-x-0 bottom-0 animate-in slide-in-from-bottom duration-300 rounded-t-[28px] bg-surface-raised px-6 pb-8 pt-3">
            <span className="mx-auto block h-1 w-10 rounded-full bg-cash-ink/15" />
            <h2 className="mt-4 font-display text-[24px] font-bold tracking-[-0.02em] text-cash-ink">
              Buy bitcoin
            </h2>
            <p className="mt-1 font-display text-[13px] text-cash-ink/55">{freq}</p>
            <button
              type="button"
              onClick={() => setStep("orderType")}
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-cash-ink/[0.06] px-3 py-1.5 font-display text-[13px] font-semibold text-cash-ink"
            >
              Change order type <ChevronDown className="size-3.5" strokeWidth={2.6} />
            </button>

            <div role="group" aria-label="Amount" className="mt-5 grid grid-cols-3 gap-3">
              {amounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={amount === a}
                  onClick={() => {
                    haptic();
                    setAmount(a);
                  }}
                  className={`h-12 rounded-full border font-display text-[16px] font-semibold text-cash-ink transition-colors duration-100 ${
                    amount === a ? "border-cash-ink bg-cash-ink/[0.05]" : "border-cash-ink/15"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2">
              <span className="font-display text-[14px] text-cash-ink/50">From</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-cash font-display text-[11px] font-bold text-white">
                $
              </span>
              <span className="font-display text-[14px] font-semibold text-cash-ink">
                Cash balance
              </span>
            </div>

            <button
              type="button"
              disabled={!amount}
              onClick={() => setStep("loading")}
              className="mt-5 h-14 w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised transition-opacity duration-100 disabled:bg-cash-ink/10 disabled:text-cash-ink/35"
            >
              Next
            </button>
            <p className="sr-only">Cash balance ${balance.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* ---------- Order type ---------- */}
      {step === "orderType" && (
        <div className="absolute inset-0 z-40 bg-surface-raised px-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
          <div className="flex items-center justify-between">
            <button type="button" aria-label="Close" onClick={() => setStep("buy")}>
              <X className="size-6 text-cash-ink" strokeWidth={2.4} />
            </button>
            <span className="font-display text-[15px] font-semibold text-cash-ink">Order type</span>
            <button type="button" aria-label="Help">
              <HelpCircle className="size-6 text-cash-ink" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-8 space-y-7">
            <button
              type="button"
              onClick={() => {
                setPendingFreq(freq);
                setStep("frequency");
              }}
              className="flex w-full items-start gap-4 text-left active:opacity-70"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cash">
                <Repeat className="size-4 text-white" strokeWidth={2.6} />
              </span>
              <span className="flex-1">
                <span className="block font-display text-[15px] font-semibold text-cash-ink">
                  Auto Invest
                </span>
                <span className="block font-display text-[13px] text-cash-ink/55">
                  Set up automatic daily, weekly, bi-weekly, or monthly purchases of bitcoin.
                </span>
              </span>
              <ChevronRight className="mt-1 size-4 text-cash-ink/45" strokeWidth={2.4} />
            </button>

            <button type="button" className="flex w-full items-start gap-4 text-left active:opacity-70">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cash">
                <ArrowDownUp className="size-4 text-white" strokeWidth={2.6} />
              </span>
              <span className="flex-1">
                <span className="block font-display text-[15px] font-semibold text-cash-ink">
                  Custom purchase order
                </span>
                <span className="block font-display text-[13px] text-cash-ink/55">
                  Automatically buy bitcoin if it reaches a price you choose. Custom purchase orders
                  can be used to buy bitcoin if its price falls or to catch the wave if its price
                  rises.
                </span>
              </span>
              <ChevronRight className="mt-1 size-4 text-cash-ink/45" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}

      {/* ---------- Invest with ease intro ---------- */}
      {step === "intro" && (
        <div className="absolute inset-0 z-40 flex flex-col bg-surface-raised px-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
          <button type="button" aria-label="Close" onClick={() => setStep("main")}>
            <X className="size-6 text-cash-ink" strokeWidth={2.4} />
          </button>
          <div className="mt-6 flex h-40 items-center justify-center rounded-3xl bg-cash/10">
            <Repeat className="size-16 text-cash" strokeWidth={1.6} />
          </div>
          <h2 className="mt-7 font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
            Invest with ease
          </h2>
          <p className="mt-2 font-display text-[15px] text-cash-ink/55">
            Set up automatic daily, weekly, bi-weekly, or monthly purchases of bitcoin.
          </p>
          <div className="mt-7 space-y-5">
            {[
              ["You set the budget", "Start with as little as $1"],
              ["You pick the schedule", "Set the schedule and let us do the work for you"],
              ["Zero fees", "We won't charge fees on your recurring purchases"],
            ].map(([t, s]) => (
              <div key={t}>
                <p className="font-display text-[15px] font-semibold text-cash-ink">{t}</p>
                <p className="font-display text-[13px] text-cash-ink/55">{s}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setPendingFreq("Daily");
              setStep("frequency");
            }}
            className="mb-8 mt-auto h-14 w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised active:opacity-80"
          >
            Continue
          </button>
        </div>
      )}

      {/* ---------- Frequency ---------- */}
      {step === "frequency" && (
        <div className="absolute inset-0 z-40 flex flex-col bg-surface-raised px-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
          <div className="flex items-center justify-between">
            <button type="button" aria-label="Back" onClick={() => setStep("orderType")}>
              <ArrowLeft className="size-6 text-cash-ink" strokeWidth={2.4} />
            </button>
            <span className="font-display text-[15px] font-semibold text-cash-ink">Auto Invest</span>
            <span className="size-6" />
          </div>

          <div role="radiogroup" aria-label="Frequency" className="mt-6 space-y-3">
            {frequencies.map((f) => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={pendingFreq === f}
                onClick={() => {
                  haptic();
                  setPendingFreq(f);
                }}
                className="flex h-14 w-full items-center justify-between rounded-2xl border border-cash-ink/10 px-4"
              >
                <span className="font-display text-[15px] text-cash-ink">{f}</span>
                <span
                  className={`flex size-5 items-center justify-center rounded-full border-2 ${
                    pendingFreq === f ? "border-cash-ink" : "border-cash-ink/25"
                  }`}
                >
                  {pendingFreq === f && <span className="size-2.5 rounded-full bg-cash-ink" />}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-auto text-center font-display text-[11px] text-cash-ink/40">
            There is a $1 minimum for recurring purchases
          </p>
          <button
            type="button"
            onClick={() => {
              setFreq(pendingFreq);
              setStep("buy");
            }}
            className="mb-8 mt-4 h-14 w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised active:opacity-80"
          >
            Next
          </button>
        </div>
      )}

      {/* ---------- Loading ---------- */}
      {step === "loading" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-surface-raised">
          <span
            role="status"
            aria-label="Loading"
            className="size-8 animate-spin rounded-full border-[3px] border-cash-ink/15 border-t-cash-ink"
          />
        </div>
      )}

      {/* ---------- Confirm ---------- */}
      {step === "confirm" && (
        <div className="absolute inset-0 z-40 flex flex-col bg-surface-raised pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
          <div className="flex-1 overflow-y-auto px-6">
            <button type="button" aria-label="Close" onClick={() => setStep("main")}>
              <X className="size-6 text-cash-ink" strokeWidth={2.4} />
            </button>
            <span className="mt-6 flex size-12 items-center justify-center rounded-full bg-cash font-display text-[22px] font-bold text-white">
              ₿
            </span>
            <h2 className="mt-5 font-display text-[26px] font-bold tracking-[-0.03em] text-cash-ink">
              Buy {amount ?? "$10"} of bitcoin{recurring ? ` ${freqWord}` : ""}
            </h2>
            <p className="mt-2 font-display text-[14px] text-cash-ink/55">
              {recurring
                ? `Your ${freqWord} purchase will be made at the same time every day`
                : "Your purchase will be made right away"}
            </p>

            <dl className="mt-8 space-y-3 font-display text-[13px]">
              {[
                ["Funding source", `Cash App · $${Math.min(balance, 6).toFixed(2)}`],
                ["Remaining", "Debit card · $2.00"],
                ["Amount of BTC", "Varies"],
                ["Current BTC price", `$${BTC_PRICE.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
                ["Recurring BTC price", "Market price"],
                ["Symbol", "BTC"],
                ["Frequency", recurring ? freq : "One-time"],
                ["Approx time", new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-cash-ink/55">{k}</dt>
                  <dd className="text-cash-ink/85">{v}</dd>
                </div>
              ))}
            </dl>

            <dl className="mt-8 space-y-3 font-display text-[13px]">
              <div className="flex justify-between">
                <dt className="text-cash-ink/55">Total bitcoin purchase</dt>
                <dd className="text-cash-ink/85">{(amount ?? "$10").replace("•••", "$10")}.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cash-ink/55">Fees</dt>
                <dd className="text-cash-ink/85">$0.00</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt className="text-cash-ink">Total cost</dt>
                <dd className="text-cash-ink">{(amount ?? "$10").replace("•••", "$10")}.00</dd>
              </div>
            </dl>

            <p className="mt-10 text-center font-display text-[11px] leading-relaxed text-cash-ink/45">
              You authorize recurring charges in the amount and interval shown above. Please see{" "}
              <span className="underline">terms</span> for more details.
            </p>
          </div>

          <div className="px-6 pb-8 pt-3">
            <button
              type="button"
              onClick={confirmOrder}
              className="h-14 w-full rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised active:opacity-80"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
