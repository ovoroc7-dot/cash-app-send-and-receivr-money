import { useState } from "react";
import { ChevronLeft, Search, Briefcase, ScanLine } from "lucide-react";

export function KeypadScreen() {
  const [amount, setAmount] = useState("0");

  const press = (k: string) => {
    setAmount((a) => {
      if (k === "<") return a.length <= 1 ? "0" : a.slice(0, -1);
      if (k === ".") return a.includes(".") ? a : a + ".";
      if (a === "0") return k;
      if (a.includes(".") && a.split(".")[1].length >= 2) return a;
      return a + k;
    });
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "<"];

  return (
    <div className="flex h-full flex-col bg-cash px-6 pt-4">
      <header className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Scan QR code"
          className="flex size-11 items-center justify-center rounded-full bg-cash-lite"
        >
          <ScanLine className="size-5 text-cash-ink" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="flex size-11 items-center justify-center rounded-full bg-cash-lite"
          >
            <Search className="size-5 text-cash-ink" strokeWidth={2.8} />
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

      <div className="flex flex-1 items-center justify-center">
        <span className="font-display text-[84px] font-semibold leading-none tracking-[-0.04em] text-cash-ink">
          ${amount}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-y-3">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            aria-label={k === "<" ? "Backspace" : k}
            onClick={() => press(k)}
            className="flex h-14 items-center justify-center font-display text-[28px] font-semibold text-cash-key active:opacity-50"
          >
            {k === "<" ? <ChevronLeft className="size-7" strokeWidth={2.5} /> : k}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          className="h-14 rounded-full bg-cash-deep font-display text-[17px] font-semibold text-cash-ink active:opacity-80"
        >
          Request
        </button>
        <button
          type="button"
          className="h-14 rounded-full bg-cash-deep font-display text-[17px] font-semibold text-cash-ink active:opacity-80"
        >
          Pay
        </button>
      </div>

      <div className="h-24" />
    </div>
  );
}
