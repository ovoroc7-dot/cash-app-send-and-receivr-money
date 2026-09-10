import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav, type Tab } from "@/components/cashapp/BottomNav";
import { KeypadScreen } from "@/components/cashapp/KeypadScreen";
import { MoneyScreen } from "@/components/cashapp/MoneyScreen";
import { ActivityScreen, CardScreen, InvestScreen } from "@/components/cashapp/SimpleScreens";
import { CashProvider } from "@/components/cashapp/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cash — Pay, Request & Manage Your Money" },
      {
        name: "description",
        content:
          "A Cash App style mobile experience: green keypad to pay or request, Cash balance with deposits, and an activity feed.",
      },
      { property: "og:title", content: "Cash — Pay, Request & Manage Your Money" },
      {
        property: "og:description",
        content:
          "Green keypad to pay or request money, Cash balance with deposits, and a live activity feed.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<Tab>("pay");
  const green = tab === "pay";

  return (
    <CashProvider>
      <main className={`min-h-screen ${green ? "bg-cash" : "bg-surface"}`}>
        <div className="relative mx-auto h-screen max-w-md overflow-hidden">
          {tab === "pay" && <KeypadScreen />}
          {tab === "money" && <MoneyScreen />}
          {tab === "card" && <CardScreen />}
          {tab === "invest" && <InvestScreen />}
          {tab === "activity" && <ActivityScreen />}
          <BottomNav tab={tab} onChange={setTab} green={green} />
        </div>
      </main>
    </CashProvider>
  );
}
