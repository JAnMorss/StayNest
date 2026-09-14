'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {}

export default function Logo({}: Props) {
    const router = useRouter();

    return (
        <Image
            alt="Logo"
            className="hidden md:block cursor-pointer"
            height={100}
            width={100}
            src="/images/logo2.png"
            style={{ width: "auto", height: "auto" }}
        />
    )
}