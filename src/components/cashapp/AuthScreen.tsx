import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import dollarSign from "@/assets/dollar-sign.png";
import { haptic } from "./store";

type Step = "welcome" | "entry" | "password";
type Mode = "phone" | "email";

export function AuthScreen() {
  const [step, setStep] = useState<Step>("welcome");
  const [mode, setMode] = useState<Mode>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const nextFromEntry = () => {
    haptic();
    if (mode === "phone") {
      setMsg("Phone number sign in isn’t available yet. Tap Use Email to continue.");
      return;
    }
    setMsg(null);
    setStep("password");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (newAccount) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) setMsg("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      haptic("success");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setMsg("Could not sign in with Google.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    setBusy(false);
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

  const onPassword = step === "password";

  return (
    <div className="flex h-full flex-col bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          onClick={() => {
            haptic();
            setMsg(null);
            setStep(onPassword ? "entry" : "welcome");
          }}
          className="-ml-1 font-display text-[22px] text-foreground active:opacity-60"
        >
          ‹
        </button>
        <span aria-hidden className="font-display text-[20px] text-foreground/70">
          ?
        </span>
      </div>

      <h1 className="mt-6 font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground">
        {onPassword
          ? newAccount
            ? "Create a password"
            : "Enter your password"
          : mode === "phone"
            ? "Enter your phone or email"
            : "Enter your email"}
      </h1>

      <form onSubmit={submit} className="mt-6 flex flex-1 flex-col">
        {onPassword ? (
          <input
            type="password"
            required
            minLength={6}
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
            autoComplete={newAccount ? "new-password" : "current-password"}
            className="h-14 w-full rounded-xl border border-foreground/25 bg-transparent px-4 font-display text-[17px] text-foreground outline-none focus:border-foreground"
          />
        ) : mode === "phone" ? (
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
        ) : (
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            autoComplete="email"
            className="h-14 w-full rounded-xl border border-foreground/25 bg-transparent px-4 font-display text-[17px] text-foreground outline-none focus:border-foreground"
          />
        )}

        <button
          type="button"
          onClick={() => setMsg("Reach out to support and we’ll help you get back in.")}
          className="mx-auto mt-5 font-display text-[15px] font-semibold text-foreground underline"
        >
          Need help logging in?
        </button>

        {msg ? (
          <p role="status" className="mt-4 text-center font-display text-[14px] text-foreground/80">
            {msg}
          </p>
        ) : null}

        <div className="flex-1" />

        <p className="mb-4 text-center font-display text-[13px] leading-snug text-foreground/60">
          By entering and tapping Next, you agree to the{" "}
          <span className="font-semibold text-foreground underline">Terms</span>,{" "}
          <span className="font-semibold text-foreground underline">E-Sign Consent</span> &{" "}
          <span className="font-semibold text-foreground underline">Privacy Notice</span>
        </p>

        <div className="flex gap-3">
          {onPassword ? (
            <button
              type="button"
              onClick={() => {
                haptic();
                setNewAccount((v) => !v);
                setMsg(null);
              }}
              className="h-14 flex-1 rounded-full bg-foreground/10 font-display text-[16px] font-semibold text-foreground active:opacity-70"
            >
              {newAccount ? "Sign in" : "Sign up"}
            </button>
          ) : (
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
          )}

          {onPassword ? (
            <button
              type="submit"
              disabled={busy || password.length < 6}
              className="h-14 flex-1 rounded-full bg-foreground font-display text-[16px] font-semibold text-surface disabled:bg-foreground/20 disabled:text-foreground/40"
            >
              {busy ? "Please wait…" : newAccount ? "Create" : "Next"}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextFromEntry}
              disabled={mode === "email" ? !email.includes("@") : phone.length < 3}
              className="h-14 flex-1 rounded-full bg-foreground font-display text-[16px] font-semibold text-surface disabled:bg-foreground/20 disabled:text-foreground/40"
            >
              Next
            </button>
          )}
        </div>

        {!onPassword ? (
          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="mt-3 h-14 w-full rounded-full border border-foreground/20 font-display text-[16px] font-semibold text-foreground active:opacity-70 disabled:opacity-60"
          >
            Continue with Google
          </button>
        ) : null}
      </form>
    </div>
  );
}
