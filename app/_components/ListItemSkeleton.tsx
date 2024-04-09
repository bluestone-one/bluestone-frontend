import { AiOutlineEnvironment } from "react-icons/ai";
import { Divider } from "rsuite";
import Image from "next/image";

const ListItemSkeleton = ({ ticketInfo }: any) => {
  return (
    <div className="card card-side bg-base-100 shadow-xl w-full">
      <figure className=" p-3">
        <div className="skeleton w-[160px] h-[160px] rounded-lg transition-all duration-100"></div>
      </figure>
      <div className="card-body p-5 border-l-2 border-dashed ml-2 border-gray-700">
        <h2 className="card-title">
          <div className="skeleton h-7 w-[30%]"></div>
        </h2>
        <div>
          {" "}
          <div className="skeleton h-6 w-[60%]"></div>{" "}
        </div>
        <div className=" capitalize flex items-center">
          <div className="avatar mr-2">
            <div className="w-5 rounded-full">
              <div className="skeleton h-6 w-20"></div>
            </div>
          </div>
          <div className="skeleton h-6 w-[70%]"></div>
        </div>
        <div className=" flex items-center text-gray-400">
          <div className="skeleton h-6 w-[25%]"></div>
        </div>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Join</button>
        </div> */}
      </div>
    </div>
  );
};

export default ListItemSkeleton;
