import CreateForm from "components/createForm";
import "./create.theme.css";

export default function Home() {
  return (
    <main className="flex min-h-screen  max-w-[960px] ml-auto mr-auto createInputBox">
      <CreateForm />
    </main>
  );
}
