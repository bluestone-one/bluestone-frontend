"use client";
import { useEventDrawerContext } from "@/context/eventDrawer";

import { GrMapLocation } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";

import Link from "next/link";

import dayjs from "dayjs";
import { month } from "@/constants/global";

import { truncate } from "@/utils/index";

import { FaShareFromSquare } from "react-icons/fa6";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function EventDrawer() {
  const { isOpen, setIsOpen, eventTarget } = useEventDrawerContext();

  return (
    <div className="drawer drawer-end z-20">
      <input
        id="my-drawer"
        type="checkbox"
        checked={isOpen}
        className="drawer-toggle"
        readOnly
      />
      <div className="drawer-content"></div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setIsOpen?.(false)}
        ></label>
        <div className="menu p-4 w-[35rem] min-h-full bg-base-200 ">
          <div className=" flex flex-col bg-base-200 text-white gap-6 pr-3">
            <div
              role="alert"
              className=" mt-3 bg-[#e6658a] flex justify-between rounded-2xl bg-opacity-15 p-5 pt-2 pb-2 items-center border border-[#de316322]"
            >
              <span className=" text-[#e6658a] text-base font-medium">
                You have access to manage this event
              </span>
              <Link href={`/event/manage/${eventTarget?.id}`}>
                <div className="btn btn-error btn-sm text-gray-100">
                  Manage
                  <FaShareFromSquare className=" text-gray-100" />
                </div>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <figure className=" w-[280px] h-[280px] mt-12">
                <img
                  src={eventTarget?.coverImg}
                  alt="Album"
                  className=" w-full h-full rounded-lg transition-all duration-100 object-cover"
                />
              </figure>
            </div>
            <div>
              <div className=" text-3xl font-bold capitalize mb-2">
                {eventTarget?.name}
              </div>
              {eventTarget?.creatorWalletAddress && (
                <div className=" capitalize flex items-center text-base	">
                  <div className="avatar mr-2">
                    <div className="w-5 rounded-full">
                      <img
                        src={`https://effigy.im/a/${eventTarget?.creatorWalletAddress}.png`}
                      />
                    </div>
                  </div>
                  created by : {truncate(eventTarget?.creatorWalletAddress)}{" "}
                </div>
              )}
            </div>
            <div className=" flex flex-col ">
              <div className="flex gap-5 mt-3">
                <div className=" border rounded-2xl border-gray-500 uppercase flex flex-col items-center w-[56px] h-[56px] overflow-hidden">
                  <span className=" bg-gray-600 w-full text-center h-[22px] text-sm font-bold tracking-wider	">
                    {month[new Date(eventTarget?.startTime).getMonth()]}
                  </span>
                  <span className=" flex h-full w-full items-center justify-center text-xl ">
                    {new Date(eventTarget?.startTime).getDate()}
                  </span>
                </div>
                <div>
                  <div className=" capitalize font-bold text-xl">
                    {dayjs(eventTarget?.startTime)?.toNow() as any}
                  </div>
                  <div className=" text-gray-400 font-medium  text-md">
                    {dayjs(eventTarget?.startTime).format("HH:mm A")} ~{" "}
                    {dayjs(eventTarget?.endTime).format("HH:mm A")}
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
                    {eventTarget?.location}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className=" text-lg font-bold text-gray-300">
                About Event
              </div>
              <div className="divider mt-0"></div>
              <div>{eventTarget?.description}</div>
            </div>
          </div>
        </div>
        {/* <ul className="menu p-4 w-[35rem] min-h-full bg-base-200 text-base-content">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul> */}
      </div>
    </div>
  );
}
