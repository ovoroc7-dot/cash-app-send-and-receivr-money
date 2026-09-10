import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Sheet({
  open,
  onClose,
  title,
  children,
  tone = "light",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  tone?: "light" | "green";
}) {
  if (!open) return null;
  const green = tone === "green";
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div
        className={`relative w-full rounded-t-[2rem] p-6 pb-8 shadow-2xl duration-300 animate-in slide-in-from-bottom ${
          green ? "bg-cash text-cash-ink" : "bg-surface-raised text-foreground"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className={`grid size-9 place-items-center rounded-full ${
              green ? "bg-cash-ink/10" : "bg-surface"
            }`}
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
