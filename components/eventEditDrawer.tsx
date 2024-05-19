"use client";
import { useEventDrawerContext } from "@/context/eventDrawer";

import { GrMapLocation } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";

import { useAccount } from "wagmi";
import { useForm, Controller } from "react-hook-form";

import { AiOutlineEnvironment } from "react-icons/ai";

import { useEffect } from "react";

import useSWR, { useSWRConfig } from "swr";

import Link from "next/link";
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
import { month } from "@/constants/global";

import { truncate } from "@/utils/index";

import { FaShareFromSquare } from "react-icons/fa6";

import { CiSquareChevRight } from "react-icons/ci";

import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { toast } from "react-toastify";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function EventEditDrawer() {
  const { isEditOpen, setIsEditOpen, eventTarget } = useEventDrawerContext();
  const account = useAccount();

  console.log("isOpen", isEditOpen);

  const { mutate } = useSWRConfig();

  const router = useRouter();

  useEffect(() => {
    setIsEditOpen?.(false);
  }, []);

  const defaultValues: any = {
    name: "",
    isPublic: true,
    location: "",
    description: "",
    startTime: null,
    endTime: null,
    ...eventTarget,
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Required"),
    location: yup.string().required("Required"),
    isPublic: yup.boolean(),
    description: yup.string(),
    startTime: yup.date().nullable(),
    endTime: yup.date().nullable(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  const onSubmit = async (data: any) => {
    try {
      console.log(
        "data",
        data,
        JSON.parse(localStorage.getItem("userToken") || "")?.access?.token
      );
      const submitRes: any = await fetch(
        `/baseAPI/event/update?id=${eventTarget?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userToken") || "")?.access?.token
            }`,
          },
          body: JSON.stringify({
            ...data,
            creatorWalletAddress: account?.address,
            type: "public",
          }),
        }
      );

      mutate(`/baseAPI/event/${eventTarget?.id}`);

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

  const Field = ({
    as: Component = Input,
    field,
    error,
    children,
    errorName,
    ...rest
  }: any) => {
    useEffect(() => {
      error &&
        toast.error(`${errorName} is required`, {
          position: "top-center",
          toastId: "1",
        });
    }, [error]);

    return (
      <Form.Group className=" !mb-0">
        {children ? (
          children
        ) : (
          <Component
            id={field.name}
            value={field.value}
            onChange={(value: any) => field.onChange(value)}
            {...rest}
          />
        )}
        {/* <Form.ErrorMessage show={!!error}>{error}</Form.ErrorMessage> */}
      </Form.Group>
    );
  };

  return (
    <div className="drawer drawer-end z-20">
      <input
        id="my-drawer"
        type="checkbox"
        checked={isEditOpen}
        className="drawer-toggle"
        readOnly
      />
      <div className="drawer-content"></div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setIsEditOpen?.(false)}
        ></label>
        <div className="menu w-[35rem] min-h-full bg-base-200 p-0">
          <div className=" w-full border-b-[1px] border-gray-600 flex items-center p-2">
            <CiSquareChevRight
              onClick={() => setIsEditOpen?.(false)}
              className=" w-9 h-9 ml-2 cursor-pointer text-gray-300 hover:text-gray-50 mr-3"
            />
            Edit Event
          </div>
          <div className="p-4 flex flex-col bg-base-200 text-white gap-6 pr-7">
            <Form
              onSubmit={handleSubmit(onSubmit) as any}
              className=" w-full z-10 gap-8 flex flex-col"
              fluid
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Field
                    field={field}
                    error={errors[field.name]?.message}
                    errorName={"Event Name"}
                  >
                    <Form.ControlLabel>Event Name</Form.ControlLabel>
                    <Input
                      id={field.name}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      placeholder="Event Name"
                      // className=" input input-ghost w-full transparentBg placeholder-gray-300"
                    />
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Field
                    field={field}
                    error={errors[field.name]?.message}
                    errorName={"Event Name"}
                  >
                    <Form.ControlLabel>Description</Form.ControlLabel>
                    <Input
                      as="textarea"
                      id={field.name}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      rows={3}
                      placeholder="Textarea"
                      className="transparentBg placeholder-gray-300	"
                    />
                  </Field>
                )}
              />
              <div className=" flex gap-2 flex-col pl-5 border-l-gray-200 rounded border-l-2 border-double">
                <Form.ControlLabel>Event Date</Form.ControlLabel>
                <div className=" flex justify-between items-center">
                  Start{" "}
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id={field.name}
                        format="yyyy-MM-dd HH:mm"
                        onChange={(value) => {
                          console.log("date value", value);

                          field.onChange(value);
                        }}
                        placeholder="Start Date"
                        cleanable={false}
                        className=" ml-2 w-[90%] transparentBg placeholder-gray-300	"
                      />
                    )}
                  />
                </div>
                <div className=" flex justify-between items-center">
                  End{" "}
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id={field.name}
                        format="yyyy-MM-dd HH:mm"
                        onChange={(value) => field.onChange(value)}
                        placeholder="End Date"
                        cleanable={false}
                        className=" ml-2 w-[90%] transparentBg placeholder-gray-300 z-10"
                      />
                    )}
                  />
                </div>
              </div>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Field
                    field={field}
                    error={errors[field.name]?.message}
                    errorName={"Location"}
                  >
                    <Form.ControlLabel>Location</Form.ControlLabel>
                    <label className="input input-bordered flex items-center gap-2 transparentBg">
                      <AiOutlineEnvironment className="w-4 h-4 opacity-70 inline-block mr-2" />{" "}
                      <input
                        type="text"
                        id={field.name}
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        className="grow placeholder-gray-300"
                        placeholder="Location"
                      />
                    </label>
                  </Field>

                  // <SelectPicker
                  //   label={<AiOutlineEnvironment className=" inline-block mr-2" />}
                  //   id={field.name}
                  //   onChange={(value) => field.onChange(value)}
                  //   data={data}
                  // />
                )}
              />
              <button
                // appearance="primary"
                className="btn bg-slate-800"
                type="submit"
              >
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
