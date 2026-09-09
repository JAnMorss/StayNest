"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useLoginModal from "@/app/hooks/useLoginModal";
import { useLoginUser } from "@/server/queries/users";
import { loginSchema, type LoginUserRequest } from "@/server/schemas/user";
import Input from "../inputs/Input";
import Modal from "./Modal";
import Heading from "../Heading";

export default function LoginModal() {
  const loginModal = useLoginModal();
  const loginMutation = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginUserRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginUserRequest> = (data) => {
    clearErrors();

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      Object.entries(fieldErrors).forEach(([field, messages]) => {
        if (messages?.[0]) {
          setError(field as keyof LoginUserRequest, {
            type: "manual",
            message: messages[0],
          });
        }
      });

      return;
    }

    loginMutation.mutate(result.data, {
      onSuccess: (response) => {
        toast.success(response.message);
        loginModal.onClose();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome back"
        subtitle="Login to your account!"
        center
      />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={loginMutation.isPending}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={loginMutation.isPending}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  return (
    <Modal
      disabled={loginMutation.isPending}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel={loginMutation.isPending ? "Logging in..." : "Continue"}
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}
