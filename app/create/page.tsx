import Image from "next/image";
import CreateForm from "components/createForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="card lg:card-side bg-base-100 shadow-xl glass mt-[8vh]">
        <figure className=" p-5 ">
          <img
            src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
            // src="/images/Ticket.jpg"
            alt="Album"
            className=" rounded-lg h-[360px] object-fill"
          />
        </figure>
        <div className="card-body p-3 min-w-[500px]">
          <CreateForm />
        </div>
      </div>
    </main>
  );
}
