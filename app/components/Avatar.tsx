"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { resolveAssetUrl } from "@/server/api/client";
import { getUserImage } from "@/server/api/users/user";

type AvatarProps = {
  src?: string | null | undefined;
  isAuthenticated?: boolean;
};

export default function Avatar({ src, isAuthenticated = false }: AvatarProps) {
  const defaultImage = "/images/appuser.jpg";
  const fallbackImage = resolveAssetUrl(src) ?? defaultImage;
  const [imageSrc, setImageSrc] = useState(fallbackImage);

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    setImageSrc(fallbackImage);

    if (isAuthenticated) {
      getUserImage<Blob>()
        .then((image) => {
          if (!(image instanceof Blob) || image.size === 0) {
            return;
          }

          const nextObjectUrl = URL.createObjectURL(image);
          if (!isActive) {
            URL.revokeObjectURL(nextObjectUrl);
            return;
          }

          objectUrl = nextObjectUrl;
          setImageSrc(nextObjectUrl);
        })
        .catch(() => {});
    }

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fallbackImage, isAuthenticated]);

  return (
    <Image
      className="h-7.5 w-7.5 rounded-full object-cover"
      height={30}
      width={30}
      alt="Avatar"
      src={imageSrc}
      unoptimized
    />
  );
}
