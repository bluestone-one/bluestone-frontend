"use client";
import { useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";
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

import { AiOutlineEnvironment } from "react-icons/ai";

import { yupResolver } from "@hookform/resolvers/yup";

import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

import { HiOutlineTicket } from "react-icons/hi2";
import { ImCoinDollar } from "react-icons/im";
import { BsClipboard2Check } from "react-icons/bs";

import { setProperty } from "utils/index";

import * as yup from "yup";

import { useAccount } from "wagmi";

const CreateForm = () => {
  const account = useAccount();
  console.log("account", account);

  const toaster = useToaster();
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  const defaultValues: any = {
    name: "",
    isPublic: true,
    location: "",
    description: "",
    startTime: null,
    endTime: null,
  };

  const router = useRouter();

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
      const submitRes: any = await fetch("/baseAPI/event/create", {
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
          coverImg: fileInfo || undefined,
        }),
      });

      console.log("submitRes", submitRes);
      if (submitRes.ok) {
        toast.success("创建成功", {
          autoClose: false,
        });

        setTimeout(async () => {
          toast.dismiss();
          router.push(`/event/manage/${(await submitRes.json())?.id}`);
        }, 800);
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

  function previewFile(file: any, callback: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className=" w-full flex mt-[9vh] justify-between p-3 z-10">
      <Form
        onSubmit={handleSubmit(onSubmit) as any}
        className=" w-full flex justify-between z-10"
      >
        <div className=" w-full flex justify-between">
          {/* <img
            src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
            // src="/images/Ticket.jpg"
            alt="Album"
            className=" rounded-lg w-[330px] h-[330px]"
          /> */}
          <Uploader
            className=" rounded-lg w-[330px] h-[330px]"
            fileListVisible={false}
            listType="picture"
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
              setFileInfo(response?.data?.url || response?.data?.display_url);
            }}
            onError={() => {
              setFileInfo(null);
              setUploading(false);
              toaster.push(<Message type="error">Upload failed</Message>);
            }}
          >
            <button
              className="rounded-lg w-[330px] h-[330px]"
              style={{ width: 330, height: 330 }}
              type="button"
              onClick={(e) => e.preventDefault()}
            >
              {uploading && <Loader backdrop center />}
              {fileInfo ? (
                <img
                  src={fileInfo}
                  className=" object-cover rounded-lg w-full h-full"
                />
              ) : (
                <img
                  src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
                  // src="/images/Ticket.jpg"
                  alt="Album"
                  className=" rounded-lg w-[330px] h-[330px]"
                />
              )}
            </button>
          </Uploader>
          <div className="card-body min-w-[500px] max-w-[566px] p-0">
            <div className=" flex flex-col gap-5">
              <div className=" w-full flex justify-end">
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <div className="form-control backdrop-blur-sm	">
                      <Toggle
                        id={field.name}
                        onChange={(value) => field.onChange(value)}
                        checkedChildren={"Public"}
                        unCheckedChildren={"Private"}
                        // type="checkbox"
                        // className="toggle"
                        checked={!!field.value}
                        className=" font-bold"
                      />
                    </div>
                  )}
                />
              </div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Field
                    field={field}
                    error={errors[field.name]?.message}
                    errorName={"Event Name"}
                  >
                    <input
                      id={field.name}
                      autoFocus={!field.value}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      placeholder="Event Name"
                      className=" input input-ghost w-full transparentBg placeholder-gray-300"
                    />
                  </Field>
                )}
              />

              <div className=" flex gap-2 flex-col pl-5 border-l-gray-200 rounded border-l-2 border-double">
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

              <div>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      as="textarea"
                      id={field.name}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      rows={3}
                      placeholder="Textarea"
                      className="transparentBg placeholder-gray-300	"
                    />
                  )}
                />
              </div>

              <div className=" flex flex-col gap-1 transparentBg placeholder-gray-300	">
                Event Options
                <div className=" input input-sm flex justify-between transparentBg placeholder-gray-300	">
                  <span className=" capitalize flex items-center">
                    <HiOutlineTicket className=" mr-2 text-gray-300" />
                    Ticket Fee
                  </span>
                  <span className=" text-gray-300 font-bold">Free</span>
                </div>
                <div className=" input input-sm flex justify-between transparentBg placeholder-gray-300	">
                  <span className=" capitalize flex items-center">
                    <ImCoinDollar className=" mr-2 text-gray-300" />
                    token
                  </span>
                  <span className=" text-gray-300 font-bold">ETH</span>
                </div>
                <div className=" input input-sm flex justify-between transparentBg placeholder-gray-300	">
                  <span className=" capitalize flex items-center">
                    <BsClipboard2Check className=" mr-2 text-gray-300" />{" "}
                    headcount
                  </span>
                  <span className=" text-gray-300 font-bold">No Limit</span>
                </div>
                {/* <div className="input h-auto pt-1 pb-1 texts">
            <div className=" flex justify-between border-b-gray-500 border-b-1">
              <span className=" capitalize">Ticket Fee</span>
              <span className=" text-gray-300">Free</span>
            </div>
            <div className=" flex justify-between">
              <span className=" capitalize">token</span>
              <span className=" text-gray-300">ETH</span>
            </div>
            <div className=" flex justify-between">
              <span className=" capitalize">headcount</span>
              <span className=" text-gray-300">No Limit</span>
            </div>
          </div> */}
                {/* <div className=" input input-sm flex justify-between">
            <span className=" capitalize">人数</span>
            <span>无限制</span>
          </div> */}
              </div>

              <button
                // appearance="primary"
                className="btn bg-slate-800"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Form>
      <div
        className=" fixed top-0 left-0 h-[100vh] w-full bg-green-700 pointer-events-none z-0"
        id="card-bg"
      ></div>
    </div>
  );
};

export default CreateForm;
