"use client";
import useSWR from "swr";

import { useEventDrawerContext } from "@/context/eventDrawer";
import dayjs from "dayjs";

import { GrMapLocation } from "react-icons/gr";

import { month } from "@/constants/global";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { useEffect, useRef } from "react";

import { truncate } from "@/utils/index";

const SPEED = 0.02;

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      let time = 0;

      const loop = function () {
        for (let x = 0; x <= 32; x++) {
          for (let y = 0; y <= 32; y++) {
            color(ctx, {
              x,
              y,
              r: R(x, y, time),
              g: G(x, y, time),
              b: B(x, y, time),
            });
          }
        }

        time = time + SPEED;

        window.requestAnimationFrame(loop);
      };

      loop();
    }
  }, []);

  return <canvas ref={canvasRef} id="eventBg" />;
};

const C1 = 191;
const C2 = 64;

export const color = function (context: any, { x, y, r, g, b }: any) {
  context.fillStyle = `rgb(${r}, ${g}, ${b})`;
  context.fillRect(x, y, 1, 1);
};

export const R = function (x: any, y: any, time: any) {
  return Math.floor(C1 + C2 * Math.cos((x * x - y * y) / 300 + time));
};

export const G = function (x: any, y: any, time: any) {
  return Math.floor(
    C1 +
      C2 *
        Math.sin(
          (x * x * Math.cos(time / 4) + y * y * Math.sin(time / 3)) / 300
        )
  );
};

export const B = function (x: any, y: any, time: any) {
  return Math.floor(
    C1 +
      C2 *
        Math.sin(
          5 * Math.sin(time / 9) +
            ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
        )
  );
};

const Background1 = () => {
  return (
    <div
      id="container"
      aria-hidden
      style={{
        overflow: "hidden",
        background: "black",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <div
        id="color-one"
        style={{
          opacity: 0.5,
          width: "400px",
          height: "400px",
          background: "red",
          filter: "blur(100px)",
          borderRadius: "99999px",
          animation: "movement infinite 3s",
          position: "absolute",
          top: "50vh",
          left: "40vw",
        }}
      />
      <div
        id="color-two"
        style={{
          opacity: 0.5,
          width: "400px",
          height: "400px",
          background: "green",
          filter: "blur(100px)",
          borderRadius: "99999px",
          animation: "movement infinite 5s",
          position: "absolute",
          top: "60vh",
          left: "40vw",
        }}
      />
      <div
        id="color-three"
        style={{
          opacity: 0.5,
          width: "400px",
          height: "400px",
          background: "blue",
          filter: "blur(100px)",
          borderRadius: "99999px",
          animation: "movement infinite 5s",
          position: "absolute",
          top: "60vh",
          left: "70vw",
        }}
      />
    </div>
  );
};

export default function EventDetail({ eventId }: { eventId: string }) {
  const { data, error, isLoading } = useSWR(`/baseAPI/event/${eventId}`);

  console.log("detail data", data);
  return (
    <div className=" w-full flex mt-[9vh] justify-between p-3 z-10">
      {!isLoading && (
        <div className=" w-full flex justify-between z-10">
          <div className=" w-full flex justify-between">
            {/* <img
        src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
        // src="/images/Ticket.jpg"
        alt="Album"
        className=" rounded-lg w-[330px] h-[330px]"
      /> */}
            <div>
              <div className=" rounded-lg w-[330px] h-[330px]">
                <div
                  className="rounded-lg w-[330px] h-[330px]"
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    src={
                      data?.coverImg ||
                      "https://i.ibb.co/hF8XpZL/events-medium.jpg"
                    }
                    className=" object-cover rounded-lg w-full h-full"
                  />
                </div>
              </div>

              <div className=" mt-5">
                <div className=" text-lg font-bold text-gray-200">Host</div>
                <div className=" divider mt-0"></div>
                <div className=" flex">
                  <div className="avatar mr-2 flex-none">
                    <div className="w-6 rounded-full">
                      <img
                        src={`https://effigy.im/a/${data?.creatorWalletAddress}.png`}
                      />
                    </div>
                  </div>
                  <div className=" font-bold">
                    {truncate(data?.creatorWalletAddress)}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body min-w-[500px] max-w-[566px] p-0">
              <div className=" flex flex-col gap-5">
                <div
                  id="shadowBox"
                  className=" backdrop-blur-sm bg-white/10 w-fit rounded-lg p-3 pt-0 pb-0"
                >
                  <div className="rainbow rainbow_text_animated capitalize flex-none inline-block font-bold tracking-wide	">
                    {data?.type}
                  </div>
                </div>

                <div className=" text-5xl font-bold">{data?.name}</div>
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
                      <div className=" capitalize font-bold text-xl">
                        Location
                      </div>
                      <div className=" text-gray-400 font-medium  text-md">
                        {data?.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" mt-5">
                  <div className=" font-bold text-base">About Event</div>
                  <div className=" divider"></div>
                  <div> {data?.description} </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className=" fixed top-0 left-0 h-[100vh] w-full bg-green-700 pointer-events-none z-0"
        id="card-bg"
      >
        <Background1 />
      </div>
    </div>
  );
}
