"use client";

import useSWR from "swr";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { GrMapLocation } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";

import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Manage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR(`/baseAPI/event/${params?.id}`);

  console.log("detail data", data);

  // return <div>My Post: {params.id}</div>;

  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div>
      <h1 className="mb-8 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">
        {data?.name}
      </h1>
      <div className="card lg:card-side bg-base-100 shadow-xl mt-3">
        <figure className=" p-5 w-[420px] h-[420px]">
          <img
            src={data?.coverImg || "https://i.ibb.co/hF8XpZL/events-medium.jpg"}
            alt="Album"
            className=" w-full h-full rounded-lg transition-all duration-100 object-cover"
          />
        </figure>
        <div className="card-body p-5 pl-2 text-gray-200">
          <h2 className="card-title text-2xl">When & Where</h2>
          <div className=" flex flex-col justify-between h-full">
            <div className=" flex flex-col  gap-2">
              <div className="flex gap-5 mt-3">
                <div className=" border rounded-2xl border-gray-500 uppercase flex flex-col items-center w-[56px] h-[56px] overflow-hidden">
                  <span className=" bg-gray-600 w-full text-center h-[22px] text-sm font-bold tracking-wider	">
                    {month[new Date(data?.startTime).getMonth()]}
                  </span>
                  <span className=" flex h-full w-full items-center justify-center text-xl ">
                    {new Date(data?.startTime).getDate()}
                  </span>
                </div>
                <div>
                  <div className=" capitalize font-bold text-xl">
                    {dayjs(data?.startTime)?.toNow() as any}
                  </div>
                  <div className=" text-gray-400 font-medium  text-md">
                    {dayjs(data?.startTime).format("HH:mm A")} ~{" "}
                    {dayjs(data?.endTime).format("HH:mm A")}
                  </div>
                </div>
              </div>
              <div className="flex gap-5 mt-3">
                <div className=" border rounded-2xl border-gray-500 uppercase flex flex-col items-center w-[56px] h-[56px] overflow-hidden justify-center">
                  <GrMapLocation className=" w-6 h-6" />
                </div>
                <div>
                  <div className=" capitalize font-bold text-xl">Location</div>
                  <div className=" text-gray-400 font-medium  text-md">
                    {data?.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-actions ">
              <button className="btn btn-neutral flex-1 btn-sm">
                Edit Event
              </button>
              <button className="btn btn-neutral flex-1 btn-sm">
                Change Photo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-10 w-full">
        <div className=" flex justify-between">
          <span className=" text-xl font-bold">Hosts</span>
          <button className="btn btn-neutral  btn-sm">
            <IoMdAdd />
            Add Host
          </button>
        </div>
        <div className=" font-medium text-gray-400 mt-2">
          Add hosts and event managers
        </div>
      </div>
    </div>
  );
}
