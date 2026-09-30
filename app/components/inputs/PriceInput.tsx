"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

type PriceInputProps = {
  input: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
};

export default function PriceInput({ input, error, disabled }: PriceInputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <span aria-hidden="true" className="absolute left-3 top-5 text-2xl text-neutral-700">
          ₱
        </span>
        <input
          id="price"
          type="number"
          min="1"
          step="any"
          disabled={disabled}
          {...input}
          placeholder=" "
          className={`peer w-full rounded-md border-2 bg-white p-4 pl-10 pt-6 font-light outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${error ? "border-rose-500 focus:border-rose-500" : "border-neutral-300 focus:border-black"}`}
        />
        <label
          htmlFor="price"
          className={`absolute left-10 top-5 origin-left -translate-y-3 transform text-md duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 ${error ? "text-rose-500" : "text-zinc-400"}`}
        >
          Price per night
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
    </div>
  );
}