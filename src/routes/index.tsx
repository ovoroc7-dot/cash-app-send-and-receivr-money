import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav, type Tab } from "@/components/cashapp/BottomNav";
import { KeypadScreen } from "@/components/cashapp/KeypadScreen";
import { MoneyScreen } from "@/components/cashapp/MoneyScreen";
import { ActivityScreen } from "@/components/cashapp/ActivityScreen";
import { CashProvider } from "@/components/cashapp/store";

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
    const t = setTimeout(() => setSplash(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className={green ? "min-h-screen bg-cash" : "min-h-screen bg-surface"}>
      <div className="relative mx-auto h-screen max-w-md overflow-hidden">
        {splash ? (
          <div className="flex h-full items-center justify-center bg-cash">
            <div className="flex size-[86px] items-center justify-center rounded-[24px] bg-[#0d4d10]">
              <span className="font-display text-[52px] font-bold leading-none text-cash">$</span>
            </div>
          </div>
        ) : (
          <>
            {green ? <KeypadScreen /> : <MoneyScreen />}
            <BottomNav tab={tab} onChange={setTab} green={green} />
          </>
        )}
      </div>
    </main>
  );
}
