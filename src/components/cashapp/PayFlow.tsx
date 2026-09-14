import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Ban,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  MessageSquare,
  Search,
  ScanLine,
  X,
} from "lucide-react";
import { contacts, fmtAmount, useCash } from "./store";

type Step = "contacts" | "note" | "review" | "method" | "loading" | "sent" | "receipt";

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

const methods = [
  { key: "cash", label: "Cash balance", sub: "$0 available", disabled: true },
  { key: "discover", label: "Discover debit 9607", sub: "No fee", disabled: false },
  { key: "apple", label: "Apple Pay", sub: "Use a debit card", disabled: false },
];

export function PayFlow({
  amount,
  mode,
  onClose,
}: {
  amount: string;
  mode: "Pay" | "Request";
  onClose: () => void;
}) {
  const { addPayment, cancelPayment } = useCash();
  const [step, setStep] = useState<Step>("contacts");
  const [person, setPerson] = useState<(typeof contacts)[number] | null>(null);
  const [note, setNote] = useState("");
  const [method, setMethod] = useState("discover");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [showReceiptAction, setShowReceiptAction] = useState(true);
  const [search, setSearch] = useState("");
  const lastReceiptScrollTop = useRef(0);

  useEffect(() => {
    if (step !== "loading") return;
    const t = setTimeout(() => setStep("sent"), 900);
    return () => clearTimeout(t);
  }, [step]);

  if (step === "loading") {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface-raised">
        <CashLoading />
      </div>
    );
  }

  const title = (
    <h2 className="font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
      {mode} ${amount}{" "}
      <span className="font-normal text-cash-ink/40">{mode === "Pay" ? "to" : "from"}</span>
    </h2>
  );

  if (step === "receipt") {
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-surface-raised">
        <div
          className="flex-1 overflow-y-auto px-5 pb-40 pt-4"
          onScroll={(event) => {
            const nextScrollTop = event.currentTarget.scrollTop;
            const movement = nextScrollTop - lastReceiptScrollTop.current;

            if (Math.abs(movement) > 3) {
              setShowReceiptAction(movement < 0 || nextScrollTop <= 2);
              lastReceiptScrollTop.current = nextScrollTop;
            }
          }}
        >
          <button
            type="button"
            aria-label="Close receipt"
            onClick={() => setStep("sent")}
            className="flex size-10 items-center justify-center rounded-full bg-cash-ink/[0.05]"
          >
            <X className="size-5 text-cash-ink" strokeWidth={2.6} />
          </button>

          <span
            className={`mt-6 flex size-16 items-center justify-center rounded-full font-display text-[28px] font-bold text-white ${person?.color}`}
          >
            {person?.name[0]}
          </span>

          <h2 className="mt-5 font-display text-[32px] font-bold tracking-[-0.02em] text-cash-ink">
            {person?.name}
          </h2>
          <p className="mt-1 font-display text-[15px] text-cash-ink/55">Today at {time}</p>
          {note ? (
            <p className="font-display text-[15px] text-cash-ink/55">For {note}</p>
          ) : null}
          <p className="mt-3 font-display text-[52px] font-semibold leading-none tracking-[-0.04em] text-cash-ink/70">
            {fmtAmount(amount)}
          </p>

          <div className="mt-8 border-t border-cash-ink/10" />
          <h3 className="mt-6 font-display text-[22px] font-bold text-cash-ink">
            Transaction details
          </h3>
          <div className="mt-4 flex items-start gap-4">
            <span className="mt-0.5 font-display text-[18px] font-bold leading-none tracking-[0.2em] text-cash-ink">
              •••
            </span>
            <span>
              <span className="block font-display text-[16px] font-semibold text-cash-ink">
                Pending
              </span>
              <span className="block font-display text-[14px] text-cash-ink/50">
                Payment has not settled yet
              </span>
            </span>
          </div>

          <div className="mt-8 border-t border-cash-ink/10" />
          <h3 className="mt-6 font-display text-[22px] font-bold text-cash-ink">
            What you can do
          </h3>
          <div className="mt-2 divide-y divide-cash-ink/[0.06]">
            {[
              { icon: Ban, label: "Cancel payment" },
              { icon: Clock3, label: `View history with ${person?.name}` },
              { icon: MessageSquare, label: "Contact Support" },
            ].map((row) => (
              <button
                key={row.label}
                type="button"
                className="flex w-full items-center gap-4 py-4 text-left"
              >
                <row.icon className="size-5 text-cash-ink" strokeWidth={2.2} />
                <span className="flex-1 font-display text-[16px] font-semibold text-cash-ink">
                  {row.label}
                </span>
                <ChevronRight className="size-4 text-cash-ink/40" strokeWidth={2.4} />
              </button>
            ))}
          </div>

          <div className="mt-6 font-mono text-[11px] leading-relaxed text-cash-ink/50">
            <p className="font-semibold text-cash-ink/70">Block, Inc.</p>
            <p>1955 Broadway, Suite 600</p>
            <p>Oakland, CA 94612</p>
            <p>(800) 969-1940</p>
            <p className="mt-2">NMLS #: 942933</p>
            <p className="mt-2 underline">cash.app</p>
          </div>
        </div>

        <div
          aria-hidden={!showReceiptAction}
          className={`absolute inset-x-0 bottom-0 bg-surface-raised px-5 pb-6 pt-3 transition-transform duration-150 ease-out motion-reduce:transition-none ${
            showReceiptAction ? "translate-y-0" : "translate-y-full pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (paymentId) cancelPayment(paymentId);
              onClose();
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised"
          >
            <Ban className="size-5" strokeWidth={2.4} />
            Cancel Payment
          </button>
        </div>
      </div>
    );
  }

  if (step === "sent") {
    return (
      <div className="absolute inset-0 z-40 flex flex-col bg-surface-raised px-4 pb-5 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <button
          type="button"
          aria-label="Close receipt"
          onClick={onClose}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-raised shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          <X className="size-7 text-cash-ink" strokeWidth={2.4} />
        </button>

        <span className="mt-5 flex size-16 shrink-0 items-center justify-center rounded-full bg-cash">
          <Check className="size-9 text-white" strokeWidth={2.8} />
        </span>

        <h2 className="mt-7 max-w-[360px] font-display text-[48px] font-semibold leading-[1.04] text-cash-ink">
          You sent {fmtAmount(amount)} to {person?.name}
        </h2>

        <div className="flex-1" />

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setStep("receipt")}
            className="flex h-14 w-full items-center justify-center rounded-full bg-cash-ink/[0.08] font-display text-[20px] font-semibold text-cash-ink"
          >
            Receipt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-14 w-full items-center justify-center rounded-full bg-cash-ink font-display text-[20px] font-semibold text-surface-raised"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-cash-ink/30">
      <div className="relative flex h-[93%] flex-col rounded-t-[22px] bg-surface-raised px-6 pb-6 pt-4">
        <span className="absolute left-1/2 top-2 h-1 w-9 -translate-x-1/2 rounded-full bg-cash-ink/15" />

        {step === "method" ? (
          <>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setStep("review")}
              className="mt-2 w-fit"
            >
              <X className="size-7 text-cash-ink" strokeWidth={2.5} />
            </button>
            <h2 className="mt-5 font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
              {mode} ${amount} <span className="font-normal text-cash-ink/40">from</span>
            </h2>
            <div className="mt-6 space-y-6">
              {methods.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  disabled={m.disabled}
                  onClick={() => setMethod(m.key)}
                  className="flex w-full items-center gap-4 text-left disabled:opacity-40"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-cash/15 font-display text-[15px] font-bold text-cash">
                    {m.key === "cash" ? "$" : m.key === "apple" ? "" : "•"}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[16px] font-semibold text-cash-ink">
                      {m.label}
                    </span>
                    <span className="block font-display text-[14px] text-cash-ink/50">{m.sub}</span>
                  </span>
                  <span
                    className={`size-5 rounded-full border-2 ${
                      method === m.key
                        ? "border-cash-ink bg-cash-ink ring-2 ring-inset ring-surface-raised"
                        : "border-cash-ink/25"
                    }`}
                  />
                </button>
              ))}
              <div className="flex items-center gap-4">
                <span className="flex size-9 items-center justify-center rounded-full border border-cash-ink/15 font-display text-[20px] text-cash-ink">
                  +
                </span>
                <span>
                  <span className="block font-display text-[16px] font-semibold text-cash-ink">
                    Link credit card
                  </span>
                  <span className="block font-display text-[14px] text-cash-ink/50">3% fee</span>
                </span>
              </div>
            </div>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setStep("review")}
              className="h-14 rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised"
            >
              Done
            </button>
          </>
        ) : step === "contacts" ? (
          <>
            <button type="button" aria-label="Close" onClick={onClose} className="mt-2 w-fit">
              <X className="size-7 text-cash-ink" strokeWidth={2.5} />
            </button>
            <div className="mt-5">{title}</div>
            <div className="mt-4 flex items-center gap-3">
              <label className="flex h-11 flex-1 items-center gap-2 rounded-full bg-cash-ink/[0.05] px-4">
                <Search className="size-4 text-cash-ink/50" strokeWidth={2.6} />
                <input
                  placeholder="Name, $cashtag, email, phone, US..."
                  className="w-full bg-transparent font-display text-[15px] text-cash-ink outline-none placeholder:text-cash-ink/45"
                />
              </label>
              <ScanLine className="size-6 text-cash-ink" strokeWidth={2.2} />
            </div>
            <p className="mt-6 font-display text-[19px] font-bold text-cash-ink">Contacts</p>
            <div className="mt-4 flex-1 space-y-5 overflow-y-auto">
              {contacts.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setPerson(c);
                    setStep("note");
                  }}
                  className="flex w-full items-center gap-4 text-left"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[17px] font-bold text-white ${c.color}`}
                  >
                    {c.name[0]}
                  </span>
                  <span>
                    <span className="block font-display text-[16px] font-semibold text-cash-ink">
                      {c.name}
                    </span>
                    <span className="block font-display text-[14px] text-cash-ink/50">{c.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label="Back"
              onClick={() => setStep(step === "note" ? "contacts" : "note")}
              className="mt-2 w-fit"
            >
              <ArrowLeft className="size-7 text-cash-ink" strokeWidth={2.5} />
            </button>
            <h2 className="mt-5 font-display text-[30px] font-bold leading-tight tracking-[-0.03em] text-cash-ink">
              {mode} ${amount} <span className="font-normal text-cash-ink/40">to</span>
              <br />
              <span className="inline-flex items-center gap-2">
                <span
                  className={`flex size-6 items-center justify-center rounded-full font-display text-[13px] font-bold text-white ${person?.color}`}
                >
                  {person?.name[0]}
                </span>
                {person?.name}
              </span>{" "}
              <span className="font-normal text-cash-ink/40">for</span>
              {step === "review" && note ? (
                <>
                  <br />
                  {note}
                </>
              ) : null}
            </h2>

            {step === "note" ? (
              <div className="mt-6 flex items-center gap-3">
                <input
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note (Required)"
                  className="flex-1 bg-transparent font-display text-[16px] text-cash-ink outline-none placeholder:text-cash-ink/45"
                />
                <button
                  type="button"
                  disabled={!note.trim()}
                  onClick={() => setStep("review")}
                  className="h-10 rounded-full bg-cash-ink px-5 font-display text-[15px] font-semibold text-surface-raised disabled:bg-cash-ink/10 disabled:text-cash-ink/40"
                >
                  Review
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => setStep("method")}
                  className="flex h-12 items-center gap-2 rounded-full bg-cash-ink/[0.05] px-4"
                >
                  <span className="size-4 rounded-full bg-[#2b6fe8]" />
                  <span className="flex-1 text-left font-display text-[15px] font-semibold text-cash-ink">
                    {methods.find((m) => m.key === method)?.label}
                  </span>
                  <ChevronDown className="size-4 text-cash-ink" strokeWidth={2.5} />
                </button>
                <p className="mt-4 text-center font-mono text-[11px] text-cash-ink/45">
                  Payments can't be canceled once they're sent.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!person) return;
                    const id = addPayment({ name: person.name, amount, note });
                    setPaymentId(id);
                    setStep("loading");
                  }}
                  className="mt-3 h-14 rounded-full bg-cash-ink font-display text-[17px] font-semibold text-surface-raised"
                >
                  {mode}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
