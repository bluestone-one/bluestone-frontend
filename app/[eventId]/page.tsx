import CreateForm from "components/createForm";
import EventDetail from "@/components/eventDetail";

export default function Event({ params }: { params: { eventId: string } }) {
  return (
    <main className="flex min-h-screen  max-w-[960px] ml-auto mr-auto createInputBox">
      <EventDetail eventId={params?.eventId} />
    </main>
  );
}
