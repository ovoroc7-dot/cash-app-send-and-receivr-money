import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export const fmtAmount = (amount: string) => `$${Number(amount).toFixed(2)}`;

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
};

const Ctx = createContext<Store | null>(null);

export function CashProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Payment[]>([]);

  const value = useMemo<Store>(
    () => ({
      pending,
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
    [pending],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
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
