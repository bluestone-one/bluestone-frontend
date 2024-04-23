"use client";

import useSWR from "swr";
import ListItem from "./ListItem";

import { Timeline } from "rsuite";
import { BsFire } from "react-icons/bs";

import dayjs from "dayjs";

import ListItemSkeleton from "./ListItemSkeleton";
import { BsCupHot } from "react-icons/bs";

import "./TimeLine.config.css";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";

import { useEventDrawerContext } from "@/context/eventDrawer";

const EventList = () => {
  const { data, error, isLoading } = useSWR("/baseAPI/event/all");
  const { isOpen, setIsOpen, setEventTarget } = useEventDrawerContext();

  const onItemClick = (target: any) => {
    if (!setIsOpen || !setEventTarget) return;
    setIsOpen(true);
    setEventTarget(target);
  };

  return (
    <div className=" max-w-[960px] flex ml-auto mr-auto">
      <ul
        className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical w-full pb-5"
        id="listTimeLine"
      >
        {isLoading
          ? new Array(3).fill(1).map(() => (
              <li className=" col-start-1">
                <div className="timeline-middle">
                  <SpinnerIcon pulse className="w-5 h-5 mb-3 text-gray-500" />
                </div>
                <div className="timeline-end w-[96%] ml-6">
                  <div className=" text-gray-400 font-bold mb-3">
                    <div className="skeleton h-6 w-[200px]"></div>
                  </div>
                  <ListItemSkeleton />
                </div>
                <hr />
              </li>
            ))
          : data?.map((ticketInfo: any) => (
              <li className=" col-start-1">
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end w-[96%] ml-6">
                  <div className=" text-gray-400 font-bold mb-3">
                    {dayjs(ticketInfo?.createdAt).format("YYYY-MM-DD HH:mm")}
                  </div>
                  <ListItem
                    onClick={() => onItemClick(ticketInfo)}
                    ticketInfo={ticketInfo}
                  />
                </div>
                <hr />
              </li>
            ))}
      </ul>
    </div>
  );
};

export default EventList;
