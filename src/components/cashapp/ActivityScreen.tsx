import { useState } from "react";
import { Ban, Briefcase, Clock, MessageSquare, ChevronRight, Search, X } from "lucide-react";
import { fmtAmount, useCash, type Payment } from "./store";

const history = [
  {
    month: "November 2023",
    items: [{ title: "New device login", sub: "Nov 10, 2023 at 2:47 PM" }],
  },
  {
    month: "June 2023",
    items: [
      { title: "New device login", sub: "Jun 29, 2023 at 9:49 PM" },
      { title: "New device login", sub: "Jun 1, 2023 at 6:36 AM" },
    ],
  },
];

export function ActivityScreen() {
  const { pending } = useCash();
  const [open, setOpen] = useState<Payment | null>(null);

  return (
    <div className="h-full overflow-y-auto bg-surface-raised pb-28">
      <header className="flex items-center justify-between px-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <h1 className="font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
          Activity
        </h1>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Search">
            <Search className="size-7 text-cash-ink" strokeWidth={2.8} />
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

      {pending.length > 0 && (
        <section className="px-6">
          <h2 className="mt-6 font-display text-[22px] font-bold tracking-[-0.02em] text-cash-ink">
            Pending
          </h2>
          {pending.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpen(p)}
              className="mt-4 flex w-full items-center gap-4 text-left"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f5303e] font-display text-[17px] font-bold text-white">
                {p.name[0]}
              </span>
              <span className="flex-1">
                <span className="block font-display text-[16px] font-semibold text-cash-ink">
                  {p.name}
                </span>
                <span className="block font-display text-[14px] text-cash-ink/50">
                  {fmtAmount(p.amount)} for {p.note}
                </span>
                <span className="block font-display text-[14px] text-cash-ink/50">{p.time}</span>
              </span>
              <span className="font-display text-[15px] text-cash-ink/60">{fmtAmount(p.amount)}</span>
            </button>
          ))}
        </section>
      )}

      {history.map((group) => (
        <section key={group.month} className="px-6">
          <h2 className="mt-7 font-display text-[22px] font-bold tracking-[-0.02em] text-cash-ink">
            {group.month}
          </h2>
          {group.items.map((it) => (
            <div key={it.sub} className="mt-4 flex items-center gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f5303e] font-display text-[18px] font-bold text-white">
                !
              </span>
              <span className="flex-1">
                <span className="block font-display text-[16px] font-semibold text-cash-ink">
                  {it.title}
                </span>
                <span className="block font-display text-[14px] text-cash-ink/50">
                  Verification needed
                </span>
                <span className="block font-display text-[14px] text-cash-ink/50">{it.sub}</span>
              </span>
              <button
                type="button"
                className="h-9 rounded-full bg-cash-ink/[0.06] px-4 font-display text-[14px] font-semibold text-cash-ink"
              >
                Review
              </button>
            </div>
          ))}
        </section>
      ))}

      {open && <PaymentDetail payment={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function PaymentDetail({ payment, onClose }: { payment: Payment; onClose: () => void }) {
  const { cancelPayment } = useCash();

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-surface-raised">
      <div className="flex-1 overflow-y-auto px-6 pb-28 pt-6">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-full bg-cash-ink/[0.05]"
        >
          <X className="size-6 text-cash-ink" strokeWidth={2.5} />
        </button>

        <span className="mt-6 flex size-[72px] items-center justify-center rounded-full bg-[#f5303e] font-display text-[30px] font-bold text-white">
          {payment.name[0]}
        </span>
        <h2 className="mt-4 font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
          {payment.name}
        </h2>
        <p className="mt-2 font-display text-[16px] text-cash-ink/55">Today at {payment.time}</p>
        <p className="font-display text-[16px] text-cash-ink/55">For {payment.note}</p>
        <p className="mt-2 font-display text-[56px] font-bold leading-none tracking-[-0.04em] text-cash-ink/60">
          {fmtAmount(payment.amount)}
        </p>

        <hr className="mt-7 border-cash-ink/10" />
        <h3 className="mt-6 font-display text-[22px] font-bold tracking-[-0.02em] text-cash-ink">
          Transaction details
        </h3>
        <div className="mt-4 flex gap-4">
          <span className="font-display text-[18px] leading-none text-cash-ink">•••</span>
          <span>
            <span className="block font-display text-[16px] font-semibold text-cash-ink">
              Pending
            </span>
            <span className="block font-display text-[14px] text-cash-ink/55">
              Payment has not settled yet
            </span>
          </span>
        </div>

        <hr className="mt-6 border-cash-ink/10" />
        <h3 className="mt-6 font-display text-[22px] font-bold tracking-[-0.02em] text-cash-ink">
          What you can do
        </h3>
        <div className="mt-5 space-y-6">
          {[
            { Icon: Ban, label: "Cancel payment" },
            { Icon: Clock, label: `View history with ${payment.name}` },
            { Icon: MessageSquare, label: "Contact Support" },
          ].map(({ Icon, label }) => (
            <button key={label} type="button" className="flex w-full items-center gap-4 text-left">
              <Icon className="size-5 shrink-0 text-cash-ink" strokeWidth={2} />
              <span className="flex-1 font-display text-[16px] font-semibold text-cash-ink">
                {label}
              </span>
              <ChevronRight className="size-4 text-cash-ink/60" strokeWidth={2.5} />
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-1 font-mono text-[12px] text-cash-ink/45">
          <p className="font-semibold text-cash-ink">Block, Inc.</p>
          <p>1955 Broadway, Suite 600</p>
          <p>Oakland, CA 94612</p>
          <p>(800) 969-1940</p>
          <p className="pt-3">NMLS #: 942933</p>
          <p className="pt-3 underline">cash.app</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-surface-raised px-6 pb-6 pt-2">
        <button
          type="button"
          onClick={() => {
            cancelPayment(payment.id);
            onClose();
          }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised"
        >
          <Ban className="size-5" strokeWidth={2.2} />
          Cancel Payment
        </button>
      </div>
    </div>
  );
}
