import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import EventList from "./_components/EventList";

export default function Home() {
  return (
    <main className="min-h-screen justify-between pt-[9rem]">
      <EventList />
    </main>
  );
}
