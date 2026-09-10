import { useState } from "react";
import { Delete, ScanLine, Search } from "lucide-react";
import { Sheet } from "./Sheet";
import { money, useCash } from "./store";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"];

const SUGGESTED = ["$jamie", "$morgan", "$devonp", "$alexr"];

export function KeypadScreen() {
  const { pay, request } = useCash();
  const [raw, setRaw] = useState("0");
  const [mode, setMode] = useState<"pay" | "request" | null>(null);
  const [tag, setTag] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const amount = parseFloat(raw) || 0;

  const press = (k: string) => {
    setRaw((cur) => {
      if (k === "back") return cur.length <= 1 ? "0" : cur.slice(0, -1);
      if (k === ".") return cur.includes(".") ? cur : cur + ".";
      if (cur === "0") return k;
      if (cur.includes(".") && cur.split(".")[1].length >= 2) return cur;
      return cur.length >= 7 ? cur : cur + k;
    });
  };

  const submit = () => {
    if (!mode || !tag.trim() || amount <= 0) return;
    const party = tag.startsWith("$") ? tag : `$${tag}`;
    if (mode === "pay") pay(party, amount, note || "Cash");
    else request(party, amount, note || "Cash");
    setDone(`${mode === "pay" ? "Sent" : "Requested"} ${money(amount)} ${mode === "pay" ? "to" : "from"} ${party}`);
    setMode(null);
    setTag("");
    setNote("");
    setRaw("0");
    setTimeout(() => setDone(null), 2600);
  };

  return (
    <div className="flex h-full flex-col bg-cash px-6 pb-3 pt-4 text-cash-ink">
      <header className="flex items-center justify-between">
        <button aria-label="Scan QR code" className="grid size-11 place-items-center rounded-full">
          <ScanLine className="size-6" strokeWidth={2.4} />
        </button>
        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="grid size-10 place-items-center rounded-full bg-cash-ink/10"
          >
            <Search className="size-5" strokeWidth={2.6} />
          </button>
          <button
            aria-label="Profile"
            className="grid size-10 place-items-center rounded-full bg-magenta text-base font-bold text-white"
          >
            J
          </button>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center">
        <span className="font-display text-[5.5rem] font-bold leading-none tracking-tight">
          ${raw}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-y-1 pb-4 text-center">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            aria-label={k === "back" ? "Backspace" : k}
            className="grid h-16 place-items-center rounded-2xl font-display text-3xl font-medium transition-colors active:bg-cash-ink/10"
          >
            {k === "back" ? <Delete className="size-7" strokeWidth={2} /> : k}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode("request")}
          className="rounded-full bg-cash-deep py-4 font-display text-base font-semibold transition-transform active:scale-[0.98]"
        >
          Request
        </button>
        <button
          onClick={() => setMode("pay")}
          className="rounded-full bg-cash-deep py-4 font-display text-base font-semibold transition-transform active:scale-[0.98]"
        >
          Pay
        </button>
      </div>

      {done && (
        <div className="pointer-events-none absolute inset-x-6 bottom-28 rounded-2xl bg-cash-ink px-4 py-3 text-center text-sm font-medium text-cash">
          {done}
        </div>
      )}

      <Sheet
        open={mode !== null}
        onClose={() => setMode(null)}
        tone="green"
        title={`${mode === "pay" ? "Pay" : "Request"} ${money(amount)}`}
      >
        <label className="mb-2 block text-sm font-medium opacity-70">To</label>
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="$Cashtag, name, or phone"
          className="w-full rounded-2xl bg-cash-ink/10 px-4 py-4 font-display text-lg font-semibold outline-none placeholder:text-cash-ink/40"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => setTag(s)}
              className="rounded-full bg-cash-ink/10 px-4 py-2 text-sm font-medium"
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note"
          className="mt-4 w-full rounded-2xl bg-cash-ink/10 px-4 py-4 text-base outline-none placeholder:text-cash-ink/40"
        />
        <button
          onClick={submit}
          disabled={!tag.trim() || amount <= 0}
          className="mt-5 w-full rounded-full bg-cash-ink py-4 font-display text-base font-semibold text-cash disabled:opacity-40"
        >
          {mode === "pay" ? "Confirm payment" : "Send request"}
        </button>
      </Sheet>
    </div>
  );
}
