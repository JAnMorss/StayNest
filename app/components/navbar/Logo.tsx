'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {}

export default function Logo({}: Props) {
    const router = useRouter();

    return (
        <Image
            onClick={() => router.push('/')}
            alt="Logo"
            className="hidden md:block cursor-pointer w-auto h-auto"
            height={100}
            width={100}
            src="/images/logo2.png"
            loading="eager"
        />
    )
}