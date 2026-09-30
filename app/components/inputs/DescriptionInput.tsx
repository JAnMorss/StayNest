"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

type DescriptionInputProps = {
  titleInput: UseFormRegisterReturn;
  descriptionInput: UseFormRegisterReturn;
  titleError?: string;
  descriptionError?: string;
  disabled?: boolean;
};

export default function DescriptionInput({
  titleInput,
  descriptionInput,
  titleError,
  descriptionError,
  disabled,
}: DescriptionInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <input
          id="title"
          disabled={disabled}
          {...titleInput}
          placeholder="Title"
          className={`w-full rounded-md border-2 bg-white p-4 outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${titleError ? "border-rose-500" : "border-neutral-300 focus:border-black"}`}
        />
        {titleError && <p className="mt-1 text-sm text-rose-500">{titleError}</p>}
      </div>
      <div className="w-full">
        <textarea
          id="description"
          disabled={disabled}
          {...descriptionInput}
          placeholder="Describe your place"
          rows={5}
          className={`w-full resize-y rounded-md border-2 bg-white p-4 outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${descriptionError ? "border-rose-500" : "border-neutral-300 focus:border-black"}`}
        />
        {descriptionError && <p className="mt-1 text-sm text-rose-500">{descriptionError}</p>}
      </div>
    </div>
  );
}