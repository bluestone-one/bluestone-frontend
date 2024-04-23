import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import EventList from "./_components/EventList";

import EventDrawer from "@/components/eventDrawer";

export default function Home() {
  return (
    <main className="min-h-screen justify-between pt-[9rem]">
      <EventList />
      <EventDrawer />
    </main>
  );
}
