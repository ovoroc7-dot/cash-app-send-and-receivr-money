import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import dollarSign from "@/assets/dollar-sign.png";
import { haptic } from "./store";

type Step =
  | "welcome"
  | "entry"
  | "code"
  | "password"
  | "dob"
  | "card"
  | "cashtag"
  | "zipcode"
  | "pin"
  | "cashcard"
  | "contacts";
type Mode = "phone" | "email";

const CODE_PREFIX = "962-";

export function AuthScreen() {
  const [step, setStep] = useState<Step>("welcome");
  const [mode, setMode] = useState<Mode>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(CODE_PREFIX);
  const [dob, setDob] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");
  const [cashtag, setCashtag] = useState("");
  const [resendIn, setResendIn] = useState(45);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [homeZip, setHomeZip] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (step !== "code") return;
    setResendIn(45);
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  // Paint the status-bar area to match the welcome screen's black background.
  useEffect(() => {
    if (step === "welcome") {
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "var(--surface)";
    }
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [step]);

  const nextFromEntry = () => {
    haptic();
    if (mode === "phone") {
      setMsg("Phone number sign in isn’t available yet. Tap Use Email to continue.");
      return;
    }
    setMsg(null);
    setCode(CODE_PREFIX);
    setStep("code");
  };

  const finish = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const generated = `Cash-${crypto.randomUUID()}`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password: generated,
        options: {
          emailRedirectTo: window.location.origin,
          data: { cashtag: cashtag.trim(), date_of_birth: dob },
        },
      });
      if (error) throw error;
      if (cashtag.trim()) localStorage.setItem("cash.cashtag", cashtag.trim());
      if (!data.session) setMsg("Check your email to confirm your account.");
      else haptic("success");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };


  const back = () => {
    haptic();
    setMsg(null);
    const prev: Record<string, Step> = {
      contacts: "cashcard",
      cashcard: "pin",
      pin: "zipcode",
      zipcode: "cashtag",
      cashtag: "card",
      card: "code",
      code: "entry",
      entry: "welcome",
    };
    setStep((s) => prev[s] ?? "welcome");
  };

  if (step === "welcome") {
    return (
      <div className="relative flex h-full flex-col justify-end bg-black px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <div className="pointer-events-none absolute inset-x-0 top-[14%] bottom-[38%]">
          <div className="absolute left-[8%] top-[38%] size-[84px] rotate-[-8deg] rounded-[18px] bg-cash/80 blur-[0.3px]" />
          <div className="absolute right-[6%] top-[6%] h-[150px] w-[86px] rotate-[6deg] rounded-[18px] bg-cash" />
          <div className="absolute left-1/2 top-0 flex size-[62px] -translate-x-1/2 items-center justify-center rounded-full bg-white/10">
            <span className="font-display text-[26px] font-bold text-white/70">$</span>
          </div>
          <div className="absolute right-[16%] bottom-[10%] h-[64px] w-[104px] rotate-[-4deg] rounded-[10px] bg-gradient-to-br from-[#ffb37a] via-[#f38aa6] to-[#8f9bf2]" />
        </div>

        <div className="mb-6 flex size-[44px] items-center justify-center rounded-[12px] bg-cash">
          <img src={dollarSign} alt="" className="h-6 w-auto object-contain" />
        </div>

        <h1 className="font-display text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-white">
          Manage your money without all the fees
        </h1>

        <button
          type="button"
          onClick={() => {
            haptic();
            setStep("entry");
          }}
          className="mt-8 h-14 w-full rounded-full bg-white/12 font-display text-[17px] font-semibold text-white active:opacity-70"
        >
          Get started
        </button>
      </div>
    );
  }

  const titles: Partial<Record<Step, string>> = {
    code: "Please enter the code sent to",
    
    dob: "What’s your date of birth?",
    card: "Add a bank using your debit card",
    cashtag: "Choose a $Cashtag",
    zipcode: "Please enter your ZIP code",
    pin: "Create a Cash App PIN",
  };
  const title =
    titles[step] ?? (mode === "phone" ? "Enter your phone or email" : "Enter your email");

  const field =
    "h-14 w-full rounded-xl border border-foreground/25 bg-transparent px-4 font-display text-[17px] text-foreground placeholder:text-foreground/45 outline-none focus:border-foreground";
  const primary =
    "h-14 w-full rounded-full bg-foreground font-display text-[16px] font-semibold text-surface disabled:bg-foreground/20 disabled:text-foreground/40 active:opacity-80";

  if (step === "cashcard") {
    return (
      <div className="flex h-full flex-col overflow-y-auto bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <div className="mx-auto mt-4 h-16 w-32 -rotate-6 rounded-lg bg-cash" />
        <h1 className="mt-6 text-center font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground">
          Meet the Cash App Card
        </h1>
        <ul className="mt-6 space-y-4">
          {[
            "Customizable design",
            "Instant discounts",
            "No hidden fees",
            "FDIC insurance*",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3 font-display text-[16px] text-foreground">
              <span className="flex size-6 items-center justify-center rounded-full border border-foreground/40 text-[12px]">
                ✦
              </span>
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-display text-[12px] leading-snug text-foreground/60">
          *With a Cash App Card, your balance is eligible for FDIC pass-through insurance through
          partner banks, Members FDIC for up to $250,000 per customer when aggregated with all other
          deposits held in the same legal capacity at each bank, if certain conditions are met.
        </p>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => {
            haptic();
            setStep("contacts");
          }}
          className="mt-6 h-14 w-full rounded-full bg-foreground/10 font-display text-[16px] font-semibold text-foreground active:opacity-70"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={() => {
            haptic();
            setStep("contacts");
          }}
          className={`mt-3 ${primary}`}
        >
          Next
        </button>
      </div>
    );
  }

  if (step === "contacts") {
    return (
      <div className="flex h-full flex-col bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <button
          type="button"
          aria-label="Close"
          onClick={() => void finish()}
          className="-ml-1 w-8 text-left font-display text-[22px] text-foreground active:opacity-60"
        >
          ✕
        </button>
        <div className="mt-6 flex size-14 items-center justify-center rounded-full bg-cash text-[22px]">
          👥
        </div>
        <h1 className="mt-6 font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground">
          Sync your contacts to find them on Cash App
        </h1>
        <p className="mt-3 font-display text-[15px] leading-snug text-foreground/60">
          This helps you find, invite, and securely pay friends. You can manage syncing anytime in
          your Security &amp; privacy settings.
        </p>
        <div className="flex-1" />
        <p className="mb-5 text-center font-display text-[14px] font-semibold text-foreground underline">
          How Cash App uses your contacts
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void finish()}
          className="h-14 w-full rounded-full bg-foreground/10 font-display text-[16px] font-semibold text-foreground active:opacity-70"
        >
          Not now
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void finish()}
          className={`mt-3 ${primary}`}
        >
          {busy ? "Please wait…" : "Sync contacts"}
        </button>
        {msg ? (
          <p role="status" className="mt-4 text-center font-display text-[14px] text-foreground/80">
            {msg}
          </p>
        ) : null}
      </div>
    );
  }


  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          onClick={back}
          className="-ml-1 font-display text-[22px] text-foreground active:opacity-60"
        >
          ‹
        </button>
        <span aria-hidden className="font-display text-[20px] text-foreground/70">
          ?
        </span>
      </div>

      <h1 className="mt-6 font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground">
        {title}
      </h1>

      {step === "code" ? (
        <p className="mt-1 font-display text-[17px] text-foreground/70">{email}</p>
      ) : step === "dob" ? (
        <p className="mt-2 font-display text-[15px] leading-snug text-foreground/60">
          Incorrect date of birth will impact access to most features on Cash App.
        </p>
      ) : step === "card" ? (
        <p className="mt-2 font-display text-[15px] leading-snug text-foreground/60">
          Linking an external account allows you to move money in and out of your Cash App balance.
        </p>
      ) : step === "cashtag" ? (
        <p className="mt-2 font-display text-[15px] text-foreground/60">
          You will be able to change this later in settings
        </p>
      ) : step === "pin" ? (
        <p className="mt-2 font-display text-[15px] leading-snug text-foreground/60">
          You’ll use this to log in to Cash App and for sending money
        </p>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          
        }}
        className="mt-6 flex flex-1 flex-col"
      >
        {step === "entry" && mode === "phone" ? (
          <div className="flex h-14 w-full items-center rounded-xl border border-foreground/25 px-4">
            <span className="font-display text-[17px] text-foreground/60">+1</span>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              aria-label="Phone number"
              autoComplete="tel"
              className="ml-3 h-full w-full bg-transparent font-display text-[17px] text-foreground placeholder:text-foreground/45 outline-none"
            />
          </div>
        ) : null}

        {step === "entry" && mode === "email" ? (
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            autoComplete="email"
            className={field}
          />
        ) : null}

        {step === "code" ? (
          <>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-label="Verification code"
              className={field}
            />
            <p className="mt-2 font-display text-[14px] text-foreground/60">
              {resendIn > 0
                ? `You can request another code in ${resendIn} seconds`
                : "You can request another code now"}
            </p>
            <button
              type="button"
              disabled={resendIn > 0}
              onClick={() => {
                haptic();
                setResendIn(45);
              }}
              className="mt-4 h-14 w-full rounded-full bg-foreground/10 font-display text-[16px] font-semibold text-foreground disabled:text-foreground/40"
            >
              Resend Code
            </button>
            <button
              type="button"
              disabled={code.replace(/\D/g, "").length < 6}
              onClick={() => {
                haptic();
                setStep("card");
              }}
              className={`mt-3 ${primary}`}
            >
              Next
            </button>
          </>
        ) : null}


        {step === "dob" ? (
          <>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="MM / DD / YYYY"
              aria-label="Date of birth"
              className={field}
            />
            <button
              type="button"
              disabled={dob.replace(/\D/g, "").length < 8}
              onClick={() => {
                haptic();
                setStep("card");
              }}
              className={`mt-8 ${primary}`}
            >
              Next
            </button>
          </>
        ) : null}

        {step === "card" ? (
          <>
            <label className="font-display text-[15px] font-semibold text-foreground">
              Debit Card Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="Debit Card Number"
              aria-label="Debit card number"
              className={`mt-2 ${field}`}
            />
            <div className="mt-4 flex gap-4">
              <div className="flex-1">
                <label className="font-display text-[15px] font-semibold text-foreground">
                  Expiration date
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  placeholder="MM/YY"
                  aria-label="Expiration date"
                  className={`mt-2 ${field}`}
                />
              </div>
              <div className="flex-1">
                <label className="font-display text-[15px] font-semibold text-foreground">CVV</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="3-Digit CVV"
                  aria-label="CVV"
                  className={`mt-2 ${field}`}
                />
              </div>
            </div>
            <label className="mt-4 font-display text-[15px] font-semibold text-foreground">
              ZIP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP Code"
              aria-label="ZIP code"
              className={`mt-2 ${field}`}
            />
            <p className="mt-3 font-display text-[13px] text-foreground/60">
              🔒 Secured with 256-bit encryption
            </p>
            <button
              type="button"
              onClick={() => {
                haptic();
                setStep("cashtag");
              }}
              className="mt-6 h-14 w-full rounded-full bg-foreground/10 font-display text-[16px] font-semibold text-foreground active:opacity-70"
            >
              Skip
            </button>
            <button
              type="button"
              disabled={card.replace(/\D/g, "").length < 12}
              onClick={() => {
                haptic();
                setStep("cashtag");
              }}
              className={`mt-3 ${primary}`}
            >
              Link Card
            </button>
          </>
        ) : null}

        {step === "cashtag" ? (
          <>
            <div className="flex h-14 w-full items-center rounded-xl border border-foreground/25 px-4">
              <span className="font-display text-[17px] text-foreground">$</span>
              <input
                type="text"
                autoFocus
                value={cashtag}
                onChange={(e) => setCashtag(e.target.value.replace(/[^A-Za-z0-9_]/g, ""))}
                aria-label="Cashtag"
                className="ml-1 h-full w-full bg-transparent font-display text-[17px] text-foreground outline-none"
              />
            </div>
            <p className="mt-2 font-display text-[14px] text-foreground/60">
              cash.app/${cashtag}
            </p>
            <button
              type="button"
              disabled={cashtag.length < 3}
              onClick={() => {
                haptic();
                setStep("zipcode");
              }}
              className={`mt-8 ${primary}`}
            >
              Next
            </button>
          </>
        ) : null}

        {step === "zipcode" ? (
          <>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={homeZip}
              onChange={(e) => setHomeZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="ZIP Code"
              aria-label="ZIP code"
              className={field}
            />
            <button
              type="button"
              disabled={homeZip.length < 5}
              onClick={() => {
                haptic();
                setPin("");
                setStep("pin");
              }}
              className={`mt-8 ${primary}`}
            >
              Next
            </button>
          </>
        ) : null}

        {step === "pin" ? (
          <>
            <div className="mt-2 flex gap-4" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`size-5 rounded-full border-2 border-foreground/40 ${
                    pin.length > i ? "bg-foreground" : ""
                  }`}
                />
              ))}
            </div>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                setPin(v);
                if (v.length === 4) {
                  haptic("success");
                  setTimeout(() => setStep("cashcard"), 200);
                }
              }}
              aria-label="Cash App PIN"
              className="mt-6 h-14 w-full rounded-xl border border-foreground/25 bg-transparent px-4 font-display text-[17px] tracking-[0.5em] text-foreground outline-none focus:border-foreground"
            />
          </>
        ) : null}


        {step === "entry" ? (
          <button
            type="button"
            onClick={() => setMsg("Reach out to support and we’ll help you get back in.")}
            className="mx-auto mt-5 font-display text-[15px] font-semibold text-foreground underline"
          >
            Need help logging in?
          </button>
        ) : null}

        {msg ? (
          <p role="status" className="mt-4 text-center font-display text-[14px] text-foreground/80">
            {msg}
          </p>
        ) : null}

        <div className="flex-1" />

        {step === "entry" ? (
          <>
            <p className="mb-4 text-center font-display text-[13px] leading-snug text-foreground/60">
              By entering and tapping Next, you agree to the{" "}
              <span className="font-semibold text-foreground underline">Terms</span>,{" "}
              <span className="font-semibold text-foreground underline">E-Sign Consent</span> &{" "}
              <span className="font-semibold text-foreground underline">Privacy Notice</span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  haptic();
                  setMode((m) => (m === "phone" ? "email" : "phone"));
                  setMsg(null);
                }}
                className="h-14 flex-1 rounded-full bg-foreground/10 font-display text-[16px] font-semibold text-foreground active:opacity-70"
              >
                {mode === "phone" ? "Use Email" : "Use Phone"}
              </button>
              <button
                type="button"
                onClick={nextFromEntry}
                disabled={mode === "email" ? !email.includes("@") : phone.length < 3}
                className="h-14 flex-1 rounded-full bg-foreground font-display text-[16px] font-semibold text-surface disabled:bg-foreground/20 disabled:text-foreground/40"
              >
                Next
              </button>
            </div>
          </>
        ) : null}
      </form>
    </div>
  );
}
