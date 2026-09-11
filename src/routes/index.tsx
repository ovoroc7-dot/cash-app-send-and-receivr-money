import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav, type Tab } from "@/components/cashapp/BottomNav";
import { KeypadScreen } from "@/components/cashapp/KeypadScreen";
import { MoneyScreen } from "@/components/cashapp/MoneyScreen";
import { ActivityScreen } from "@/components/cashapp/ActivityScreen";
import { CashProvider } from "@/components/cashapp/store";
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
  const green = tab === "pay";

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <CashProvider>
      <main className={green ? "min-h-screen bg-cash" : "min-h-screen bg-surface"}>
        <div className="relative mx-auto h-screen max-w-md overflow-hidden">
          {splash ? (
            <div className="flex h-full items-center justify-center bg-cash dark:bg-black">
              <img
                src={cashAppLogo.url}
                alt="Cash App"
                className="size-[150px] rounded-[34px] object-contain dark:hidden"
              />
              <div className="hidden size-[150px] items-center justify-center rounded-[34px] bg-white dark:flex">
                <img
                  src={dollarSign}
                  alt="Cash App"
                  className="h-[88px] w-auto object-contain"
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
