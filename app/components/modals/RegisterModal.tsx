"use client";

import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Input from "../inputs/Input";
import Modal from "./Modal";
import Heading from "../Heading";
import Button from "../Button";
import { registerSchema, type RegisterUserRequest } from "@/server/schemas/users/user";
import { useRegisterUser } from "@/app/hooks/useUser";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useCallback } from "react";

type Props = {};

type RegisterFormValues = RegisterUserRequest;

export default function RegisterModal({}: Props) {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  
  const registerMutation = useRegisterUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    clearErrors();

    const result = registerSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      Object.entries(fieldErrors).forEach(([field, messages]) => {
        if (messages?.[0]) {
          setError(field as keyof RegisterFormValues, {
            type: "manual",
            message: messages[0],
          });
        }
      });

      return;
    }

    registerMutation.mutate(result.data, {
      onSuccess: (response) => {
        toast.success(response.message);
        registerModal.onClose();
        loginModal.onOpen();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const toggle = useCallback(() => {
      registerModal.onClose();
      loginModal.onOpen();
    }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to StayNest"
        subtitle="Create an account!"
        center
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="firstName"
          label="First Name"
          disabled={registerMutation.isPending}
          register={register}
          errors={errors}
          required
        />

        <Input
          id="lastName"
          label="Last Name"
          disabled={registerMutation.isPending}
          register={register}
          errors={errors}
          required
        />
      </div>

      <Input
        id="email"
        label="Email"
        type="email"
        disabled={registerMutation.isPending}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        disabled={registerMutation.isPending}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4">
      <hr className="border-gray-200" />

      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {}}
      />

      <div className="text-neutral-500 text-center font-light">
        <div className="flex flex-row justify-center items-center gap-2">
          <div>Already have an account?</div>

          <div
            onClick={toggle}
            className="
              text-neutral-800
              cursor-pointer
              hover:underline
            "
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={registerMutation.isPending}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel={registerMutation.isPending ? "Creating..." : "Continue"}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}


