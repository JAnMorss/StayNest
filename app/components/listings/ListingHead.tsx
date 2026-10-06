"use client";

import useCountries from "@/app/hooks/useCountries";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import Carousel from "../Carousel"; 

type ListingHeadProps = {
  title: string;
  images: string[]; 
  locationValue: string;
  id: string;
};

export default function ListingHead({
  title,
  images,
  locationValue,
  id,
}: ListingHeadProps) {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);

  return (
    <>
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div
        className="
          w-full
          h-[60vh]
          overflow-hidden
          rounded-xl
          relative
        "
      >
        <Carousel images={images} alt={title} /> 
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} />
        </div>
      </div>
    </>
  );
}
