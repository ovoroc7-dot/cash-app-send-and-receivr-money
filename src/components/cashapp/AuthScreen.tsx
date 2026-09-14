import { useEffect, useRef, useState } from "react";

import dollarSign from "@/assets/dollar-sign.png";
import { haptic } from "./store";

type Step = "chooser" | "loading" | "welcome" | "entry" | "code" | "pin" | "success";

const VALID_CODE = "565656";
const VALID_PIN = "5656";

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

export function AuthScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>("chooser");
  const [afterLoading, setAfterLoading] = useState<Step>("welcome");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [resendIn, setResendIn] = useState(59);
  const [msg, setMsg] = useState<string | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (step !== "code") return;
    setResendIn(59);
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  // Loading spinner interlude, then continue to the queued step.
  useEffect(() => {
    if (step !== "loading") return;
    const t = setTimeout(() => setStep(afterLoading), 1400);
    return () => clearTimeout(t);
  }, [step, afterLoading]);

  // The welcome confirmation closes itself and opens the app.
  useEffect(() => {
    if (step !== "success") return;
    const t = setTimeout(() => doneRef.current(), 1800);
    return () => clearTimeout(t);
  }, [step]);

  const goWithSpinner = (next: Step) => {
    haptic();
    setMsg(null);
    setAfterLoading(next);
    setStep("loading");
  };

  // Paint the status-bar area to match the current screen's background.
  useEffect(() => {
    document.body.style.backgroundColor = "var(--surface)";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [step]);

  const back = () => {
    haptic();
    setMsg(null);
    const prev: Record<string, Step> = {
      pin: "code",
      code: "entry",
      entry: "welcome",
      welcome: "chooser",
    };
    setStep((s) => prev[s] ?? "chooser");
  };

  const primary =
    "h-14 w-full rounded-full bg-foreground font-display text-[16px] font-semibold text-surface disabled:bg-foreground/20 disabled:text-foreground/40 active:opacity-80";

  if (step === "chooser") {
    const accounts = [
      { tag: "$sugarmummy1072", name: "Sugar Mummy", initial: "S", verified: false },
      { tag: "$bkhodae", name: "Emily", initial: "E", verified: true },
    ];
    return (
      <div className="h-full overflow-y-auto bg-surface px-5 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="More options"
            className="flex size-10 items-center justify-center rounded-full bg-cash-ink/10 text-cash-ink active:opacity-60"
          >
            <span className="font-display text-[20px] font-bold leading-none">···</span>
          </button>
        </div>

        <div className="mt-8 flex size-[58px] items-center justify-center rounded-[16px] bg-cash">
          <img src={dollarSign} alt="" className="h-8 w-auto object-contain" />
        </div>

        <h1 className="mt-6 font-display text-[34px] font-bold tracking-[-0.02em] text-cash-ink">
          Choose an account
        </h1>

        <div className="mt-6">
          {accounts.map((a) => (
            <button
              key={a.tag}
              type="button"
              onClick={() => goWithSpinner("welcome")}
              className="flex w-full items-center gap-4 py-4 text-left active:opacity-60"
            >
              <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-[#f038b0] font-display text-[20px] font-bold text-black">
                {a.initial}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[17px] font-semibold text-cash-ink">
                  {a.tag}
                  {a.verified ? <span className="ml-1 text-cash">●</span> : null}
                </span>
                <span className="block truncate text-[15px] text-cash-ink/70">{a.name}</span>
              </span>
              <span className="text-[18px] text-cash-ink/70">›</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => goWithSpinner("welcome")}
            className="mt-2 flex w-full items-center gap-4 py-4 text-left active:opacity-60"
          >
            <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-cash-ink/10 font-display text-[24px] font-semibold text-cash-ink">
              +
            </span>
            <span className="min-w-0 flex-1 font-display text-[17px] font-semibold text-cash-ink">
              Sign in to another account
            </span>
            <span className="text-[18px] text-cash-ink/70">›</span>
          </button>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="flex h-full items-center justify-center bg-surface" role="status" aria-label="Loading">
        <span className="size-8 animate-spin rounded-full border-2 border-cash-ink/25 border-t-cash-ink" />
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-surface px-8">
        <span className="flex size-[58px] animate-in zoom-in-75 items-center justify-center rounded-full border-[3px] border-cash duration-500">
          <svg viewBox="0 0 24 24" className="size-7 text-cash" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-5 font-display text-[19px] font-bold tracking-[-0.01em] text-foreground">
          Welcome to Cash App!
        </p>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <div className="relative flex h-full flex-col justify-end bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <div className="pointer-events-none absolute inset-x-0 bottom-[38%] top-[14%]">
          <div className="absolute left-[8%] top-[38%] size-[84px] rotate-[-8deg] rounded-[18px] bg-cash/80 blur-[0.3px]" />
          <div className="absolute right-[6%] top-[6%] h-[150px] w-[86px] rotate-[6deg] rounded-[18px] bg-cash" />
          <div className="absolute left-1/2 top-0 flex size-[62px] -translate-x-1/2 items-center justify-center rounded-full bg-cash-ink/10">
            <span className="font-display text-[26px] font-bold text-cash-ink/70">$</span>
          </div>
          <div className="absolute bottom-[10%] right-[16%] h-[64px] w-[104px] rotate-[-4deg] rounded-[10px] bg-gradient-to-br from-[#ffb37a] via-[#f38aa6] to-[#8f9bf2]" />
        </div>

        <div className="mb-6 flex size-[44px] items-center justify-center rounded-[12px] bg-cash">
          <img src={dollarSign} alt="" className="h-6 w-auto object-contain" />
        </div>

        <h1 className="font-display text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-cash-ink">
          Manage your money without all the fees
        </h1>

        <button
          type="button"
          onClick={() => goWithSpinner("entry")}
          className="mt-8 h-14 w-full rounded-full bg-cash-ink/12 font-display text-[17px] font-semibold text-cash-ink active:opacity-70"
        >
          Get started
        </button>
      </div>
    );
  }

  if (step === "code") {
    const valid = code.replace(/\D/g, "").length === 6;
    return (
      <div className="flex h-full flex-col overflow-y-auto bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Back"
            onClick={back}
            className="flex size-9 items-center justify-center rounded-full bg-cash-ink/10 font-display text-[16px] text-cash-ink active:opacity-60"
          >
            ✕
          </button>
          <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-cash-ink/10 font-display text-[16px] text-cash-ink">
            ?
          </span>
        </div>

        <h1 className="mt-6 font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-cash-ink">
          Please enter the code sent to {useEmail ? email : formatPhone(phone)}
        </h1>

        <input
          type="text"
          inputMode="numeric"
          autoFocus
          value={code}
          onChange={(e) => {
            setMsg(null);
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
          }}
          placeholder="Confirmation Code"
          aria-label="Confirmation code"
          className="mt-6 h-14 w-full rounded-xl border border-cash-ink/70 bg-transparent px-4 font-display text-[17px] text-cash-ink placeholder:text-cash-ink/45 outline-none focus:border-cash-ink"
        />

        <p className="mt-3 font-display text-[14px] text-cash-ink/60">
          {resendIn > 0
            ? `You can request another code in ${resendIn} seconds`
            : "You can request another code now"}
        </p>

        <p className="mt-6 text-center font-display text-[15px] font-semibold text-cash-ink underline">
          Need help logging in?
        </p>

        {msg ? (
          <p role="status" className="mt-4 text-center font-display text-[14px] text-cash-ink/80">
            {msg}
          </p>
        ) : null}

        <div className="flex-1" />

        <button
          type="button"
          disabled={resendIn > 0}
          onClick={() => {
            haptic();
            setResendIn(59);
          }}
          className="h-14 w-full rounded-full bg-cash-ink/10 font-display text-[16px] font-semibold text-cash-ink disabled:text-cash-ink/40"
        >
          Resend Code
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={() => {
            if (code !== VALID_CODE) {
              setMsg("That code isn’t right. Please try again.");
              return;
            }
            setPin("");
            goWithSpinner("pin");
          }}
          className="mt-3 h-14 w-full rounded-full bg-cash-ink font-display text-[16px] font-semibold text-surface disabled:bg-cash-ink/15 disabled:text-cash-ink/40 active:opacity-80"
        >
          Next
        </button>
      </div>
    );
  }

  if (step === "pin") {
    const submitPin = () => {
      if (pin !== VALID_PIN) {
        setMsg("Incorrect PIN. Please try again.");
        setPin("");
        return;
      }
      haptic("success");
      goWithSpinner("success");
    };
    return (
      <div className="flex h-full flex-col bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Back"
            onClick={back}
            className="font-display text-[20px] text-foreground active:opacity-60"
          >
            ✕
          </button>
          <span aria-hidden className="font-display text-[20px] text-foreground/70">
            ?
          </span>
        </div>

        <h1 className="mt-7 font-display text-[27px] font-bold tracking-[-0.02em] text-foreground">
          Enter your Cash PIN
        </h1>

        <div className="relative mt-7 flex gap-5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              aria-hidden
              className={`size-5 rounded-full border-[1.5px] border-foreground/40 transition-colors ${
                pin.length > i ? "bg-foreground" : ""
              }`}
            />
          ))}
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => {
              setMsg(null);
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
            }}
            aria-label="Cash PIN"
            className="absolute inset-0 h-full w-full cursor-default bg-transparent text-transparent caret-transparent outline-none"
          />
        </div>

        {msg ? (
          <p role="status" className="mt-5 font-display text-[14px] text-alert">
            {msg}
          </p>
        ) : null}

        <div className="flex-1" />

        <button type="button" disabled={pin.length < 4} onClick={submitPin} className={primary}>
          Next
        </button>
      </div>
    );
  }

  // Phone / email sign in.
  const canContinue = useEmail ? /^\S+@\S+\.\S+$/.test(email) : phone.length >= 10;
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          onClick={back}
          className="flex size-10 items-center justify-center rounded-full bg-cash-ink/10 font-display text-[20px] text-cash-ink active:opacity-60"
        >
          ←
        </button>
        <span
          aria-hidden
          className="flex size-10 items-center justify-center rounded-full bg-cash-ink/10 font-display text-[18px] font-semibold text-cash-ink"
        >
          ?
        </span>
      </div>

      <h1 className="mt-6 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-cash-ink">
        Enter your info to log in or create an account
      </h1>

      {useEmail ? (
        <input
          type="email"
          inputMode="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          aria-label="Email address"
          autoComplete="email"
          className="mt-7 h-14 w-full rounded-xl border border-cash-ink bg-transparent px-4 font-display text-[17px] text-cash-ink placeholder:text-cash-ink/45 outline-none"
        />
      ) : (
        <div className="mt-7 flex h-14 w-full items-center rounded-xl border border-cash-ink px-4">
          <span className="font-display text-[17px] text-cash-ink/70">+1</span>
          <input
            type="tel"
            inputMode="tel"
            autoFocus
            value={formatPhone(phone)}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="Phone Number"
            aria-label="Phone number"
            autoComplete="tel"
            className="ml-3 h-full w-full bg-transparent font-display text-[17px] text-cash-ink placeholder:text-cash-ink/45 outline-none"
          />
        </div>
      )}

      <p className="mx-auto mt-6 font-display text-[16px] font-semibold text-cash-ink underline">
        Need help logging in?
      </p>

      <div className="flex-1" />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            haptic();
            setUseEmail((v) => !v);
          }}
          className="h-14 flex-1 rounded-full bg-cash-ink/12 font-display text-[16px] font-semibold text-cash-ink active:opacity-70"
        >
          {useEmail ? "Use Phone" : "Use Email"}
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => {
            setCode("");
            goWithSpinner("code");
          }}
          className="h-14 flex-1 rounded-full bg-cash-ink font-display text-[16px] font-semibold text-surface disabled:bg-cash-ink/20 disabled:text-cash-ink/45 active:opacity-80"
        >
          Next
        </button>
      </div>
    </div>
  );
}
