import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import dollarSign from "@/assets/dollar-sign.png";

export function AuthScreen() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "up") {
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

  return (
    <div className="flex h-full flex-col justify-center bg-cash px-7 pb-10 pt-[calc(env(safe-area-inset-top,0px)+2rem)]">
      <div className="mx-auto mb-8 flex size-[76px] items-center justify-center rounded-[20px] bg-white">
        <img src={dollarSign} alt="" className="h-10 w-auto object-contain" />
      </div>

      <h1 className="text-center font-display text-[28px] font-bold tracking-[-0.02em] text-cash-key">
        {mode === "in" ? "Sign in" : "Create your account"}
      </h1>
      <p className="mt-2 text-center font-display text-[15px] text-cash-key/70">
        Your cash balance is saved and follows you on any device.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          className="h-14 w-full rounded-2xl bg-cash-lite px-5 font-display text-[17px] text-cash-key placeholder:text-cash-key/50 outline-none"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Password"
          autoComplete={mode === "in" ? "current-password" : "new-password"}
          className="h-14 w-full rounded-2xl bg-cash-lite px-5 font-display text-[17px] text-cash-key placeholder:text-cash-key/50 outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-14 w-full rounded-full bg-cash-deep font-display text-[17px] font-semibold text-cash-key active:opacity-80 disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        onClick={google}
        disabled={busy}
        className="mt-3 h-14 w-full rounded-full bg-white font-display text-[17px] font-semibold text-black active:opacity-80 disabled:opacity-60"
      >
        Continue with Google
      </button>

      {msg ? (
        <p role="status" className="mt-4 text-center font-display text-[15px] text-cash-key">
          {msg}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === "in" ? "up" : "in"));
          setMsg(null);
        }}
        className="mt-6 font-display text-[15px] font-semibold text-cash-key underline"
      >
        {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
