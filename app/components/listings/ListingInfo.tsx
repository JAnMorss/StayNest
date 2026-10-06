'use client';

import useCountries from "@/app/hooks/useCountries";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../Map"), {
    ssr: false
});

type ListingInfoProps = {
  user?: string | null;

  category?: {
    label?: string | null;
    icon: React.ComponentType<any>;
    description?: string | null;
  };

  description?: string | null;
  roomCount?: number | null;
  guestCount?: number | null;
  bathroomCount?: number | null;
  locationValue?: string | null;
};

export default function ListingInfo({
    user,
    category,
    description,
    roomCount,
    guestCount,
    bathroomCount,
    locationValue
}: ListingInfoProps) {
  const { getByValue } = useCountries();

  const coordinates = locationValue
    ? getByValue(locationValue)?.latlng
    : undefined;

  return (
    <div className="col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
            <div
                className="
                    text-xl 
                    font-semibold 
                    flex 
                    flex-row 
                    items-center 
                    gap-2
                "
            >
                <div>Hosted by {user ?? "Unknown"}</div>
                <Avatar src={null} />
            </div>
            <div
                className=" 
                    flex 
                    flex-row 
                    items-center 
                    gap-4 
                    font-light 
                    text-neutral-500
                "
            >
                <div>
                    {guestCount} guests
                </div>
                <div>
                    {roomCount} rooms
                </div>
                <div>
                    {bathroomCount} bathrooms
                </div>
            </div>
        </div>
        <hr className="border-neutral-200" />
        {category && (
            <ListingCategory
                icon={category.icon}
                label={category.label}
                description={category.description}
            />
        )}
        <hr className="border-neutral-200" />
        <div className="text-lg font-light text-neutral-500">
            {description}
        </div>
        <hr className="border-neutral-200" />
        <Map center={coordinates} />
    </div>
  )
}