import { useEffect, useRef, useState } from "react";
import { Search, Briefcase, ScanLine } from "lucide-react";
import { PayFlow } from "./PayFlow";
import { sanitizeAmount } from "./AddMoneyFlow";

export function KeypadScreen() {
  const [amount, setAmount] = useState("0");
  const [flow, setFlow] = useState<"Pay" | "Request" | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!flow) input.current?.focus();
  }, [flow]);


  return (
    <div className="flex h-full flex-col bg-cash px-6 pt-4">
      <header className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Scan QR code"
          className="flex size-11 items-center justify-center rounded-full bg-cash-lite"
        >
          <ScanLine className="size-5 text-cash-key" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="flex size-11 items-center justify-center rounded-full bg-cash-lite"
          >
            <Search className="size-5 text-cash-key" strokeWidth={2.8} />
          </button>
          <button
            type="button"
            aria-label="Profile"
            className="flex size-11 items-center justify-center rounded-full bg-magenta"
          >
            <Briefcase className="size-5 text-cash-key" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 items-center justify-center">
        <span
          role="status"
          aria-live="polite"
          className="font-display text-[84px] font-semibold leading-none tracking-[-0.04em] text-cash-key"
        >
          ${amount}
        </span>
        <input
          ref={input}
          type="text"
          inputMode="decimal"
          enterKeyHint="done"
          autoComplete="off"
          aria-label="Amount"
          value={amount === "0" ? "" : amount}
          onChange={(e) => setAmount(sanitizeAmount(e.target.value) || "0")}
          className="absolute inset-0 h-full w-full bg-transparent text-center text-transparent caret-transparent outline-none"
        />
      </div>


      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => amount !== "0" && setFlow("Request")}
          className="h-14 rounded-full bg-cash-deep font-display text-[17px] font-semibold text-cash-key active:opacity-80"
        >
          Request
        </button>
        <button
          type="button"
          onClick={() => amount !== "0" && setFlow("Pay")}
          className="h-14 rounded-full bg-cash-deep font-display text-[17px] font-semibold text-cash-key active:opacity-80"
        >
          Pay
        </button>
      </div>

      <div className="h-24" />

      {flow && (
        <PayFlow
          amount={amount}
          mode={flow}
          onClose={() => {
            setFlow(null);
            setAmount("0");
          }}
        />
      )}
    </div>
  );
}
