import CreateForm from "components/createForm";
import "./create.theme.css";

export default function Home() {
  return (
    <main className="flex min-h-screen  max-w-[960px] ml-auto mr-auto createInputBox">
      <div className=" w-full flex mt-[9vh] justify-between p-3 z-10">
        <img
          src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
          // src="/images/Ticket.jpg"
          alt="Album"
          className=" rounded-lg w-[330px] h-[330px]"
        />
        <div className="card-body min-w-[500px] max-w-[566px] p-0">
          <CreateForm />
        </div>
      </div>
      <div
        className=" fixed top-0 left-0 h-[100vh] w-full bg-green-700 pointer-events-none z-0"
        id="card-bg"
      ></div>
    </main>
  );
}
