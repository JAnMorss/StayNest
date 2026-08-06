'use client';

import { BiSearch } from "react-icons/bi";

type Props = {}

export default function Search({}: Props) {
  return (
    <div
        className="
            border
            border-gray-200
            w-full
            md:w-auto
            py-2
            rounded-full
            shadow-sm
            hover:shadow-md
            transition
            cursor-pointer
        "
    >
        <div
            className="
                flex
                flex-row
                items-center
                justify-between
            "
        >
            <div
                className="
                    text-sm
                    font-semibold
                    px-6
                    hover:text-red-500
                "
            >
                Anywhere
            </div>
            <div
                className="
                    hidden
                    sm:block   
                    text-sm
                    font-semibold
                    px-6
                    border-x
                    border-gray-200
                    flex-1
                    text-center
                    hover:text-red-500
                "
            >
                Any week
            </div>
            <div
                className="
                    text-sm
                    pl-6
                    pr-2
                    text-gray-600
                    flex
                    flex-row
                    items-center
                    gap-3
                "
            >
                <div className="hidden sm:block hover:text-red-300">
                    Add Guests
                </div>
                <div 
                    className="
                        p-2
                        bg-rose-500
                        rounded-full
                        text-white
                    "
                >
                    <BiSearch />
                </div>
            </div>
        </div>
    </div>
  )
}