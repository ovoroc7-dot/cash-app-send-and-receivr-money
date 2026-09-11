import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav, type Tab } from "@/components/cashapp/BottomNav";
import { KeypadScreen } from "@/components/cashapp/KeypadScreen";
import { MoneyScreen } from "@/components/cashapp/MoneyScreen";
import { ActivityScreen } from "@/components/cashapp/ActivityScreen";
import { CashProvider } from "@/components/cashapp/store";
import { AuthScreen } from "@/components/cashapp/AuthScreen";
import { supabase } from "@/integrations/supabase/client";
import cashAppLogo from "@/assets/cash-app-logo.png.asset.json";
import dollarSign from "@/assets/dollar-sign.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cash — Pay, Request & Cash Balance" },
      {
        name: "description",
        content:
          "A Cash App style mobile flow: the green keypad for Pay and Request, and the Money screen with your cash balance.",
      },
      { property: "og:title", content: "Cash — Pay, Request & Cash Balance" },
      {
        property: "og:description",
        content:
          "Green keypad for Pay and Request, plus the Money screen with cash balance, taxes and Tags.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState<Tab>("pay");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const green = tab === "pay";

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // Paint the page (including the area behind the phone status bar) with the
  // current screen's background so nothing shows a white strip at the top.
  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const color = splash ? (dark ? "#000000" : "var(--cash)") : green ? "var(--cash)" : "var(--surface)";
    document.body.style.backgroundColor = color;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [green, splash]);

  return (
    <CashProvider>
      <main className={green ? "min-h-[100dvh] bg-cash" : "min-h-[100dvh] bg-surface"}>
        <div className="relative mx-auto h-[100dvh] w-full max-w-md overflow-x-hidden overflow-y-hidden">
          {splash ? (
            <div className="flex h-full items-center justify-center bg-cash sysdark:bg-black">
              <img
                src={cashAppLogo.url}
                alt="Cash App"
                className="size-[150px] rounded-[34px] object-contain sysdark:hidden"
              />
              <div className="hidden size-[105px] items-center justify-center rounded-[24px] bg-white sysdark:flex">
                <img
                  src={dollarSign}
                  alt="Cash App"
                  className="h-[62px] w-auto object-contain"
                />
              </div>
            </div>
          ) : (
            <>
              {green ? (
                <KeypadScreen />
              ) : tab === "activity" ? (
                <ActivityScreen />
              ) : (
                <MoneyScreen />
              )}
              <BottomNav tab={tab} onChange={setTab} green={green} />
            </>
          )}
        </div>
      </main>
    </CashProvider>
  );
}
