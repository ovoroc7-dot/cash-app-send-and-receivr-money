import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export const fmtAmount = (amount: string) => `$${Number(amount).toFixed(2)}`;

export const speakMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** "25000.5" -> "$25,000.5" — thousands separators, typed decimals kept as typed. */
export const groupDisplay = (raw: string) => {
  const [whole, dec] = (raw || "0").split(".");
  const grouped = Number(whole || 0).toLocaleString("en-US");
  return `$${grouped}${dec === undefined ? "" : `.${dec}`}`;
};

/**
 * Shrink a big money label so it always stays inside its container,
 * on small phones and with larger accessibility text sizes.
 */
export const fitSize = (text: string, base: number, fits = 7) => {
  const len = Math.max(text.length, 1);
  if (len <= fits) return base;
  return Math.max(Math.round((base * fits) / len), Math.round(base * 0.4));
};

/** Phone haptics: short tick on taps, double tick on success. */
export function haptic(kind: "tap" | "success" = "tap") {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(kind === "success" ? [12, 40, 22] : 10);
  } catch {
    /* ignore */
  }
}

export type Payment = {
  id: string;
  name: string;
  amount: string;
  note: string;
  time: string;
};

type Store = {
  pending: Payment[];
  addPayment: (p: Omit<Payment, "id" | "time">) => string;
  cancelPayment: (id: string) => void;
  balance: number;
  addFunds: (amount: number) => void;
  autoReload: boolean;
  setAutoReload: (on: boolean) => void;
  announce: (message: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function CashProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Payment[]>([]);
  const [balance, setBalance] = useState(100);
  const [autoReload, setAutoReload] = useState(false);
  const [live, setLive] = useState("");

  const announce = useCallback((message: string) => {
    setLive("");
    requestAnimationFrame(() => setLive(message));
  }, []);

  const value = useMemo<Store>(
    () => ({
      pending,
      balance,
      autoReload,
      setAutoReload,
      announce,
      addFunds: (amount) =>
        setBalance((b) => {
          const next = b + amount;
          haptic("success");
          announce(`Added ${speakMoney(amount)}. Cash balance ${speakMoney(next)}.`);
          return next;
        }),
      addPayment: (p) => {
        const id = Math.random().toString(36).slice(2);
        setPending((list) => [
          {
            ...p,
            id,
            time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          },
          ...list,
        ]);
        return id;
      },
      cancelPayment: (id) => setPending((list) => list.filter((p) => p.id !== id)),
    }),
    [pending, balance, autoReload, announce],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <p aria-live="polite" aria-atomic="true" role="status" className="sr-only">
        {live}
      </p>
    </Ctx.Provider>
  );
}

export function useCash() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCash must be used inside CashProvider");
  return ctx;
}

export const contacts = [
  { name: "Adalynn Wall", sub: "Invite • (570) 360-9324", color: "bg-[#f5303e]" },
  { name: "AJ BURLING", sub: "Invite • (281) 939-6543", color: "bg-[#f0663c]" },
  { name: "Betty Rosson", sub: "Invite • (251) 395-4441", color: "bg-[#2b6fe8]" },
  { name: "brondellnace", sub: "Invite • (717) 472-7128", color: "bg-[#5fd6b0]" },
  { name: "Cash App", sub: "Invite • (657) 464-4761", color: "bg-[#f0663c]" },
  { name: "Charles", sub: "Invite • (470) 782-2803", color: "bg-[#f5303e]" },
];
