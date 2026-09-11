import { useState } from "react";
import {
  ChevronRight,
  EyeOff,
  Search,
  CreditCard,
  Smartphone,
  Banknote,
  ScanLine,
  Repeat,
} from "lucide-react";
import tagsArt from "@/assets/tags-art.png";
import iconStocks from "@/assets/icon-stocks.png";
import iconPools from "@/assets/icon-pools.png";
import iconSavings from "@/assets/icon-savings.png";
import iconBitcoin from "@/assets/icon-bitcoin.png";
import avatar from "@/assets/avatar.jpg";
import { AddMoneyFlow } from "./AddMoneyFlow";
import { useCash } from "./store";

export function MoneyScreen() {
  const [hidden, setHidden] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const { balance } = useCash();

  return (
    <>
    <div className="h-full overflow-y-auto bg-surface pb-28">
      <header className="flex items-center justify-between px-6 pt-4">
        <h1 className="font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
          Money
        </h1>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Search">
            <Search className="size-7 text-cash-ink" strokeWidth={2.8} />
          </button>
          <button type="button" aria-label="Profile" className="relative">
            <img
              src={avatar}
              alt="Your profile"
              loading="lazy"
              width={512}
              height={512}
              className="size-11 rounded-full object-cover"
            />
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-alert font-display text-[11px] font-bold text-white">
              1
            </span>
          </button>
        </div>
      </header>

      <section className="mt-5">
        <div className="rounded-t-[28px] bg-gradient-to-b from-cash-light to-[#b9f24a] px-5 pb-8 pt-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2">
            <CreditCard className="size-4 text-cash-ink" strokeWidth={2.5} />
            <span className="font-display text-[17px] font-semibold text-cash-ink">•• 6969</span>
          </span>
        </div>

        <div className="-mt-5 rounded-t-[28px] bg-surface px-6 pt-6">
          <div className="flex items-start justify-between">
            <button
              type="button"
              className="flex items-center gap-1 font-display text-[19px] font-bold tracking-[-0.01em] text-cash-ink"
            >
              Cash balance •• 9206
              <ChevronRight className="size-5" strokeWidth={2.8} />
            </button>
            <button
              type="button"
              aria-label={hidden ? "Show balance" : "Hide balance"}
              onClick={() => setHidden((h) => !h)}
            >
              <EyeOff className="size-6 text-cash-ink" strokeWidth={2.2} />
            </button>
          </div>
          <p className="mt-1 font-display text-[64px] font-bold leading-none tracking-[-0.04em] text-cash-ink">
            {hidden
              ? "••••"
              : balance.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                })}
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="h-16 rounded-full bg-surface-raised font-display text-[19px] font-bold text-cash-ink active:opacity-70"
            >
              Add money
            </button>
            <button
              type="button"
              className="h-16 rounded-full bg-surface-raised font-display text-[19px] font-bold text-cash-ink"
            >
              Withdraw
            </button>
          </div>

          <article className="mt-4 rounded-3xl bg-surface-raised p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Smartphone className="size-5 text-cash" strokeWidth={2.4} />
                <span className="font-display text-[19px] font-semibold text-cash-ink">
                  Green status
                </span>
              </span>
              <span className="font-display text-[19px] font-semibold text-cash-ink">
                $467.52 away
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-black/[0.07]">
              <div className="h-full w-[9%] rounded-full bg-cash" />
            </div>
          </article>

          <article className="mt-4 flex items-center justify-between rounded-3xl bg-surface-raised p-5">
            <div>
              <p className="font-display text-[17px] text-cash-ink">Bitcoin</p>
              <p className="font-display text-[34px] font-bold leading-tight tracking-[-0.03em] text-cash-ink">
                $0.00
              </p>
              <p className="font-display text-[17px] text-cash-ink/40">0% today</p>
            </div>
            <span className="flex size-[72px] items-center justify-center rounded-full bg-cash/10 font-display text-[34px] font-bold text-cash">
              ₿
            </span>
          </article>

          <article className="mt-4 flex items-center justify-between rounded-3xl bg-surface-raised p-5">
            <div>
              <p className="font-display text-[17px] text-cash-ink">Stocks</p>
              <p className="font-display text-[34px] font-bold leading-tight tracking-[-0.03em] text-cash-ink">
                $0.00
              </p>
              <p className="font-display text-[17px] text-cash-ink/40">0% today</p>
            </div>
            <span className="flex size-[72px] items-center justify-center rounded-full bg-black/[0.05]">
              <img
                src={iconStocks}
                alt=""
                loading="lazy"
                width={816}
                height={816}
                className="size-10 object-contain"
              />
            </span>
          </article>

          <h2 className="mt-10 font-display text-[24px] font-bold tracking-[-0.02em] text-cash-ink">
            More for you
          </h2>

          <article className="mt-4 rounded-3xl bg-surface-raised p-5">
            <p className="font-display text-[15px] font-semibold text-cash-ink">Tags</p>
            <p className="mt-2 font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-cash-ink">
              A magical new
              <br />
              way to pay
            </p>
            <img
              src={tagsArt}
              alt="Tags: a flaming heart lock, a star wand and a green Cash Card"
              loading="lazy"
              width={1024}
              height={768}
              className="mt-4 w-full"
            />
          </article>

          <div className="mt-8 space-y-7">
            {offers.map(({ label, sub, img }) => (
              <div key={label} className="flex items-center gap-4">
                <img
                  src={img}
                  alt={label}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="size-12 shrink-0 object-contain"
                />
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

          <h2 className="mt-8 font-display text-[24px] font-bold tracking-[-0.02em] text-cash-ink">
            Add money
          </h2>

          <div className="mt-6 space-y-8">
            {addMoney.map(({ label, Icon }) => (
              <button key={label} type="button" className="flex w-full items-center gap-6 text-left">
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
              Cash App and savings balances are not deposit products and therefore are not protected
              by FDIC pass-through insurance.
            </p>
            <p>
              Banking services provided by Cash App's bank partner(s). Brokerage services by Cash
              App Investing LLC. member FINRA, subsidiary of Block, Inc. Bitcoin services by Block,
              Inc. Tax filing services by Cash App Taxes.
            </p>
            <p className="font-semibold text-cash-ink underline">Disclosures</p>
          </div>
        </div>
      </section>
    </div>
    {addOpen ? <AddMoneyFlow onClose={() => setAddOpen(false)} /> : null}
    </>
  );
}

const offers = [
  { label: "Stocks", sub: "Invest with $1", img: iconStocks },
  { label: "Pools", sub: "Collect money with anyone", img: iconPools },
  { label: "Savings", sub: "Save for a goal", img: iconSavings },
  { label: "Bitcoin", sub: "Buy, use, and earn", img: iconBitcoin },
];

const addMoney = [
  { label: "Deposit paper money", Icon: Banknote },
  { label: "Deposit check", Icon: ScanLine },
  { label: "Auto reload", Icon: Repeat },
];
