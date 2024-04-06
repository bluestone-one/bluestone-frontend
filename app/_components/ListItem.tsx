import { AiOutlineEnvironment } from "react-icons/ai";
import { Divider } from "rsuite";
import Image from "next/image";

const ListItem = ({ ticketInfo }: any) => {
  return (
    <div className="card card-side bg-base-100 shadow-xl w-full cursor-pointer group hover:shadow-custom hover:translate-x-[-1%] transition-scale  hover:scale-[1.01]">
      <figure className=" p-3">
        <img
          src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
          alt="Movie"
          className=" max-h-[160px] rounded-lg transition-all duration-100"
        />
      </figure>
      <div className="card-body p-5 border-l-2 border-dashed ml-2 border-gray-500">
        <h2 className="card-title">{ticketInfo?.name}</h2>
        <div> {ticketInfo?.description} </div>
        <div className=" capitalize flex items-center">
          <div className="avatar mr-2">
            <div className="w-5 rounded-full">
              <img
                src={`https://effigy.im/a/${ticketInfo?.creatorWalletAddress}.png`}
              />
            </div>
          </div>
          created by : {ticketInfo?.creatorWalletAddress}{" "}
        </div>
        <div className=" flex items-center text-gray-400">
          <AiOutlineEnvironment className=" w-5 h-5 mr-3" />
          {ticketInfo?.location}
        </div>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Join</button>
        </div> */}
      </div>
    </div>
  );
};

export default ListItem;