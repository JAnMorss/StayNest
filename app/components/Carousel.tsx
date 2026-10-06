"use client";

import Image from "next/image";
import { useState } from "react";

type CarouselProps = {
  images: string[];
  alt?: string;
};

export default function Carousel({ images, alt }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div 
        className="
            flex 
            h-full 
            min-h-64 
            w-full 
            items-center 
            justify-center 
            rounded-lg 
            bg-neutral-200 
            text-sm 
            text-neutral-500
        ">
        No photo available
      </div>
    );
  }

  const activeIndex = currentIndex % images.length;

  const showPreviousImage = () => {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  };

  const showNextImage = () => {
    setCurrentIndex((index) => (index + 1) % images.length);
  };

  return (
    <div className="relative h-full min-h-64 w-full overflow-hidden rounded-lg">
      <Image
        src={images[activeIndex]}
        alt={alt || "Carousel image"}
        fill
        className="object-cover w-full h-full"
        unoptimized
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Show previous image"
            onClick={showPreviousImage}
            className="
                absolute 
                left-4 
                top-1/2 
                flex 
                h-10 
                w-10 
                -translate-y-1/2 
                items-center 
                justify-center 
                rounded-full 
                bg-white/90 
                text-neutral-800 
                shadow 
                transition 
                hover:bg-white
            "
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <button
            type="button"
            aria-label="Show next image"
            onClick={showNextImage}
            className="
                absolute 
                right-4 
                top-1/2 
                flex 
                h-10 
                w-10 
                -translate-y-1/2 
                items-center 
                justify-center 
                rounded-full 
                bg-white/90 
                text-neutral-800 
                shadow 
                transition 
                hover:bg-white"
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full shadow transition ${
                  index === activeIndex ? "bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
          <div 
            className="
                absolute 
                bottom-4 
                right-4 
                rounded-full 
                bg-black/60 
                px-3 
                py-1 
                text-sm 
                text-white
            ">
            {activeIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
