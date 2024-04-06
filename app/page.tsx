import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TicketList from "./_components/TicketList";

export default function Home() {
  return (
    <main className="min-h-screen justify-between pt-[9rem]">
      <TicketList />
    </main>
  );
}
