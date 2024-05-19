"use client";

import useSWR, { useSWRConfig } from "swr";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useEventDrawerContext } from "@/context/eventDrawer";

import { useState, useEffect } from "react";

import { GrMapLocation } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";

import { toast } from "react-toastify";

import EventEditDrawer from "@/components/eventEditDrawer";

import {
  Input,
  Button,
  Form,
  DatePicker,
  Toggle,
  Uploader,
  Message,
  Loader,
  useToaster,
} from "rsuite";

import dayjs from "dayjs";

import { isAddress } from "viem";

import { useAccount } from "wagmi";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Manage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR(`/baseAPI/event/${params?.id}`);

  const account = useAccount();

  const { isOpen, setIsEditOpen, setEventTarget } = useEventDrawerContext();

  const [showInputError, setShowInputError] = useState(false);

  const { mutate } = useSWRConfig();

  const [inputAddress, setInputAddress] = useState<string>("");

  const onItemClick = (target: any) => {
    if (!setIsEditOpen || !setEventTarget) return;

    setIsEditOpen(true);
    setEventTarget(target);
  };

  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  const toaster = useToaster();

  console.log("detail data", data, fileInfo);

  useEffect(() => {
    setShowInputError(!isAddress(inputAddress));
  }, [inputAddress]);

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

  function previewFile(file: any, callback: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const onSubmit = async (inputData: any) => {
    try {
      const submitRes: any = await fetch(
        `/baseAPI/event/update?id=${data?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userToken") || "")?.access?.token
            }`,
          },
          body: JSON.stringify({
            ...inputData,
            creatorWalletAddress: account?.address,
            type: "public",
          }),
        }
      );

      mutate(`/baseAPI/event/${data?.id}`);

      console.log("submitRes", submitRes);
      if (submitRes.ok) {
        setIsEditOpen?.(false);

        toast.success("更新成功", {
          autoClose: false,
        });

        // setTimeout(async () => {
        //   toast.dismiss();
        //   router.push(`/event/manage/${(await submitRes.json())?.id}`);
        // }, 800);
      } else {
        throw new Error(submitRes);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">
        {data?.name}
      </h1>
      <div className="card lg:card-side bg-base-100 shadow-xl mt-3">
        <figure className=" p-5 w-[420px] h-[420px]">
          <img
            src={
              fileInfo ||
              data?.coverImg ||
              "https://i.ibb.co/hF8XpZL/events-medium.jpg"
            }
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
              <button
                className="btn btn-neutral flex-1 btn-sm"
                onClick={() => onItemClick(data)}
              >
                Edit Event
              </button>
              <Uploader
                className="btn btn-neutral flex-1 btn-sm"
                fileListVisible={false}
                name="image"
                action="https://api.imgbb.com/1/upload?key=fa1cabf7a3dcb056d876dc914da6e9db"
                onUpload={(file) => {
                  setUploading(true);
                  previewFile(file.blobFile, (value: any) => {
                    setFileInfo(value);
                  });
                }}
                onSuccess={(response, file) => {
                  setUploading(false);
                  toaster.push(
                    <Message type="success">Uploaded successfully</Message>
                  );
                  console.log(response, fileInfo);
                  setFileInfo(
                    response?.data?.url || response?.data?.display_url
                  );
                  onSubmit({
                    coverImg:
                      response?.data?.url || response?.data?.display_url,
                  });
                }}
                onError={() => {
                  setFileInfo(null);
                  setUploading(false);
                  toaster.push(<Message type="error">Upload failed</Message>);
                }}
              >
                <button
                  className="btn btn-neutral flex-1 btn-sm"
                  onClick={(e) => e.preventDefault()}
                >
                  {uploading && <Loader backdrop center />} Change Photo
                </button>
              </Uploader>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-10 w-full">
        <div className=" flex justify-between">
          <span className=" text-xl font-bold">Hosts</span>
          <label htmlFor="add_cohost" className="btn btn-neutral  btn-sm">
            <IoMdAdd />
            Add Host
          </label>
        </div>
        <div className=" font-medium text-gray-400 mt-2">
          Add hosts and event managers
        </div>
        <div className=" flex flex-col gap-2 mt-3">
          {data?.cohost?.map((address: string) => (
            <div className=" flex w-full p-3 rounded-lg border border-gray-800 hover:bg-slate-800 cursor-pointer">
              <div className="avatar mr-2 flex-none">
                <div className="w-6 rounded-full flex-none">
                  <img src={`https://effigy.im/a/${address}.png`} />
                </div>
              </div>
              {address}{" "}
            </div>
          ))}
        </div>
      </div>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="add_cohost" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <label
              htmlFor="add_cohost"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </label>
          </form>
          <h3 className="text-lg font-bold">Add Cohost</h3>
          <div className=" flex flex-col w-full gap-5">
            <div>
              <label className="input input-bordered flex items-center gap-2 mt-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Host wallet address"
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                />
              </label>
              <div className="label">
                <span className="label-text-alt text-red-400">
                  {showInputError && "Not An Address!"}
                </span>
              </div>
            </div>
            <button
              className={`btn btn-success w-full`}
              onClick={() => {
                if (!isAddress(inputAddress)) return;
                const tempSet = new Set(data?.cohost || []);
                tempSet.add(inputAddress);
                console.log("onSubmit", Array.from(tempSet));

                onSubmit({ cohost: Array.from(tempSet) });
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="add_cohost">
          Close
        </label>
      </div>
      <EventEditDrawer />
    </div>
  );
}
