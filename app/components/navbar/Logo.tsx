'use client';

import Image from "next/image";

type Props = {}

export default function Logo({}: Props) {

    return (
        <Image
            alt="Logo"
            className="hidden md:block cursor-pointer"
            height={100}
            width={100}
            src="/images/logo2.png"
            loading="eager"
            style={{ width: "auto", height: "auto" }}
        />
    )
}