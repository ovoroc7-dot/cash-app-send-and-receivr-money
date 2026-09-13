import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

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

/** Every money movement shown in Activity. Saved on the device so history survives sign out. */
export type Txn = {
  id: string;
  kind: "sent" | "added";
  name: string;
  amount: string;
  note: string;
  time: string;
  createdAt: number;
  status: "pending" | "complete" | "canceled";
  /** Funding source for added money, e.g. "Visa debit 3049". */
  source?: string;
};

const TXN_KEY = "cash.txns";
const BAL_KEY = "cash.balance";

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

type Store = {
  transactions: Txn[];
  pending: Payment[];
  addPayment: (p: Omit<Payment, "id" | "time">) => string;
  cancelPayment: (id: string) => void;
  balance: number;
  addFunds: (amount: number, source?: string) => void;
  autoReload: boolean;
  setAutoReload: (on: boolean) => void;
  announce: (message: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function CashProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [balance, setBalance] = useState(0);
  const [autoReload, setAutoReload] = useState(false);
  const [live, setLive] = useState("");
  const loaded = useRef(false);

  const announce = useCallback((message: string) => {
    setLive("");
    requestAnimationFrame(() => setLive(message));
  }, []);

  // Restore the saved balance and history. Kept on the device so it stays
  // after the app is closed, or after signing out and back in.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TXN_KEY);
      if (raw) setTransactions(JSON.parse(raw) as Txn[]);
      const b = localStorage.getItem(BAL_KEY);
      if (b) setBalance(Number(b) || 0);
    } catch {
      /* ignore unreadable storage */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(TXN_KEY, JSON.stringify(transactions));
      localStorage.setItem(BAL_KEY, String(balance));
    } catch {
      /* ignore full storage */
    }
  }, [transactions, balance]);

  const pending = useMemo<Payment[]>(
    () =>
      transactions
        .filter((t) => t.kind === "sent" && t.status !== "canceled")
        .map(({ id, name, amount, note, time }) => ({ id, name, amount, note, time })),
    [transactions],
  );

  const value = useMemo<Store>(
    () => ({
      transactions,
      pending,
      balance,
      autoReload,
      setAutoReload,
      announce,
      addFunds: (amount, source = "Visa debit 3049") => {
        setBalance((b) => {
          const next = b + amount;
          haptic("success");
          announce(`Added ${speakMoney(amount)}. Cash balance ${speakMoney(next)}.`);
          return next;
        });
        setTransactions((list) => [
          {
            id: Math.random().toString(36).slice(2),
            kind: "added",
            name: "Add money",
            amount: String(amount),
            note: "",
            source,
            status: "complete",
            time: nowTime(),
            createdAt: Date.now(),
          },
          ...list,
        ]);
      },
      addPayment: (p) => {
        const id = Math.random().toString(36).slice(2);
        setTransactions((list) => [
          {
            ...p,
            id,
            kind: "sent",
            status: "pending",
            time: nowTime(),
            createdAt: Date.now(),
          },
          ...list,
        ]);
        return id;
      },
      cancelPayment: (id) =>
        setTransactions((list) =>
          list.map((t) => (t.id === id ? { ...t, status: "canceled" } : t)),
        ),
    }),
    [transactions, pending, balance, autoReload, announce],
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
