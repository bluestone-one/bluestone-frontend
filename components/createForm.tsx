"use client";
import { useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, DatePicker, SelectPicker } from "rsuite";

import { AiOutlineEnvironment } from "react-icons/ai";

import { yupResolver } from "@hookform/resolvers/yup";

import { ToastContainer, toast } from "react-toastify";

import { useRouter } from "next/navigation";

import * as yup from "yup";

import { useAccount } from "wagmi";

const data = [
  "Eugenia",
  "Bryan",
  "Linda",
  "Nancy",
  "Lloyd",
  "Alice",
  "Julia",
  "Albert",
].map((item) => ({ label: item, value: item }));

const ErrorMessage = ({ children }: any) => (
  <span style={{ color: "red" }}>{children}</span>
);

const CreateForm = () => {
  const account = useAccount();
  console.log("account", account);

  const defaultValues = {
    name: "",
    isPublic: true,
    location: "",
    description: "",
  };

  const router = useRouter();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Required"),
    location: yup.string().required("Required"),
    isPublic: yup.boolean(),
    description: yup.string(),
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
      const submitRes = await fetch("/baseAPI/ticket/create", {
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
      });

      console.log("submitRes", submitRes);

      toast.success("创建成功", {
        autoClose: false,
      });

      setTimeout(() => {
        toast.dismiss();
        router.push("/");
      }, 800);
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
    <div>
      <Form
        onSubmit={handleSubmit(onSubmit) as any}
        className=" flex flex-col gap-5 "
      >
        <div className=" w-full flex justify-end">
          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <div className="form-control w-32 backdrop-blur-sm	">
                <label className="cursor-pointer label">
                  <span className="label-text">Public</span>
                  <input
                    id={field.name}
                    onChange={(value) => field.onChange(value)}
                    type="checkbox"
                    className="toggle"
                    checked={!!field.value}
                  />
                </label>
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
              errorName={"Ticket Name"}
            >
              <input
                id={field.name}
                autoFocus={!field.value}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                placeholder="Ticket Name"
                className=" input input-ghost w-full"
              />
            </Field>
          )}
        />

        {/* <div className=" flex gap-2 flex-col pl-5 border-l-gray-200 rounded border-l-2 border-double">
          <div>
            开始{" "}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id={field.name}
                  onChange={(value) => field.onChange(value)}
                  placeholder="开始时间"
                  className=" ml-2 w-fit"
                />
              )}
            />
          </div>
          <div>
            结束{" "}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id={field.name}
                  onChange={(value) => field.onChange(value)}
                  placeholder="结束时间"
                  className=" ml-2 w-fit"
                />
              )}
            />
          </div>
        </div> */}

        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Field
              field={field}
              error={errors[field.name]?.message}
              errorName={"Location"}
            >
              <label className="input input-bordered flex items-center gap-2">
                <AiOutlineEnvironment className="w-4 h-4 opacity-70 inline-block mr-2" />{" "}
                <input
                  type="text"
                  id={field.name}
                  onChange={(value) => field.onChange(value)}
                  value={field.value}
                  className="grow"
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
              />
            )}
          />
        </div>

        <div className=" flex flex-col gap-2">
          Ticket Options
          <div className=" input input-sm flex justify-between">
            <span className=" capitalize">token</span>
            <span>ETH</span>
          </div>
          {/* <div className=" input input-sm flex justify-between">
            <span className=" capitalize">人数</span>
            <span>无限制</span>
          </div> */}
        </div>

        <button
          // appearance="primary"
          className="btn glass"
          type="submit"
        >
          Submit
        </button>
      </Form>
    </div>
  );
};

export default CreateForm;
