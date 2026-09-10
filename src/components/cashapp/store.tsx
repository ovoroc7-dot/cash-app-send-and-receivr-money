import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Txn = {
  id: string;
  kind: "pay" | "request" | "deposit";
  party: string;
  note: string;
  amount: number;
  at: number;
};

type CashState = {
  balance: number;
  hidden: boolean;
  txns: Txn[];
  toggleHidden: () => void;
  addMoney: (amount: number) => void;
  pay: (party: string, amount: number, note: string) => void;
  request: (party: string, amount: number, note: string) => void;
};

const CashContext = createContext<CashState | null>(null);

export function CashProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [txns, setTxns] = useState<Txn[]>([]);

  const value = useMemo<CashState>(() => {
    const push = (t: Omit<Txn, "id" | "at">) =>
      setTxns((prev) => [{ ...t, id: crypto.randomUUID(), at: Date.now() }, ...prev]);

    return {
      balance,
      hidden,
      txns,
      toggleHidden: () => setHidden((h) => !h),
      addMoney: (amount) => {
        setBalance((b) => b + amount);
        push({ kind: "deposit", party: "Bank of America", note: "Added to Cash balance", amount });
      },
      pay: (party, amount, note) => {
        setBalance((b) => b - amount);
        push({ kind: "pay", party, note, amount });
      },
      request: (party, amount, note) => push({ kind: "request", party, note, amount }),
    };
  }, [balance, hidden, txns]);

  return <CashContext.Provider value={value}>{children}</CashContext.Provider>;
}

export function useCash() {
  const ctx = useContext(CashContext);
  if (!ctx) throw new Error("useCash must be used inside CashProvider");
  return ctx;
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
