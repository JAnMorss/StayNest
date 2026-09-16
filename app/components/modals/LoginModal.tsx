"use client";

import { useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useLoginModal from "@/app/hooks/useLoginModal";
import { loginSchema, type LoginUserRequest } from "@/server/schemas/users/user";
import Input from "../inputs/Input";
import Modal from "./Modal";
import Heading from "../Heading";
import Button from "../Button";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useLoginUser } from "@/app/hooks/useUser";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useCallback } from "react";

export default function LoginModal() {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const loginMutation = useLoginUser();
  const queryClient = useQueryClient();

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
        localStorage.setItem("accessToken", response.data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        toast.success(response.message);
        loginModal.onClose();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const toggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

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

  const footerContent = (
      <div className="flex flex-col gap-4 mt-3">
        <hr className="border-gray-200" />
        <Button
          outline
          label="Continue with Google"
          icon={FcGoogle}
          onClick={() => {}}
        />
        <div
          className="
            text-neutral-500
            text-center
            mt-4
            font-light
          "
        >
          <div className="flex flex-row justify-center items-center gap-2">
            <div>
              Don't have an account?
            </div>
            <div
              onClick={toggle}
              className="
                text-neutral-800
                cursor-pointer
                hover:underline
              "
            >
              Create an account
            </div>
          </div>
        </div>
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
      footer={footerContent}
    />
  );
}
