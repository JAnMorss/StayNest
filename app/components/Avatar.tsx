"use client";

import Image from "next/image";

type Props = {};

export default function Avatar({}: Props) {
  return (
    <Image
      className="rounded-full"
      height={30}
      width={30}
      alt="Avatar"
      src="/images/appuser.jpg"
      style={{ width: "auto", height: "auto" }}
    />
  );
}
