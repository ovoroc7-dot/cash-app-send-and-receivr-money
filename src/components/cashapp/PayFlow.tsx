import { useState } from "react";
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
import { contacts, useCash } from "./store";

type Step = "contacts" | "note" | "review" | "method" | "sent" | "receipt";

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
  const { addPayment } = useCash();
  const [step, setStep] = useState<Step>("contacts");
  const [person, setPerson] = useState<(typeof contacts)[number] | null>(null);
  const [note, setNote] = useState("");
  const [method, setMethod] = useState("discover");

  const title = (
    <h2 className="font-display text-[30px] font-bold tracking-[-0.03em] text-cash-ink">
      {mode} ${amount}{" "}
      <span className="font-normal text-cash-ink/40">{mode === "Pay" ? "to" : "from"}</span>
    </h2>
  );

  if (step === "sent") {
    return (
      <div className="absolute inset-0 z-40 flex flex-col bg-surface-raised px-4 pb-5 pt-4">
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
          You sent ${amount} to {person?.name}
        </h2>

        <div className="flex-1" />

        <div className="space-y-2">
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center rounded-full bg-black/[0.08] font-display text-[20px] font-semibold text-cash-ink"
          >
            Receipt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-14 w-full items-center justify-center rounded-full bg-cash-ink font-display text-[20px] font-semibold text-white"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/30">
      <div className="relative flex h-[93%] flex-col rounded-t-[22px] bg-surface-raised px-6 pb-6 pt-4">
        <span className="absolute left-1/2 top-2 h-1 w-9 -translate-x-1/2 rounded-full bg-black/15" />

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
                        ? "border-cash-ink bg-cash-ink ring-2 ring-inset ring-white"
                        : "border-black/25"
                    }`}
                  />
                </button>
              ))}
              <div className="flex items-center gap-4">
                <span className="flex size-9 items-center justify-center rounded-full border border-black/15 font-display text-[20px] text-cash-ink">
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
              className="h-14 rounded-full bg-cash-ink font-display text-[17px] font-semibold text-white"
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
              <label className="flex h-11 flex-1 items-center gap-2 rounded-full bg-black/[0.05] px-4">
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
                  className="h-10 rounded-full bg-cash-ink px-5 font-display text-[15px] font-semibold text-white disabled:bg-black/10 disabled:text-cash-ink/40"
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
                  className="flex h-12 items-center gap-2 rounded-full bg-black/[0.05] px-4"
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
                    addPayment({ name: person!.name, amount, note });
                    setStep("sent");
                  }}
                  className="mt-3 h-14 rounded-full bg-cash-ink font-display text-[17px] font-semibold text-white"
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
