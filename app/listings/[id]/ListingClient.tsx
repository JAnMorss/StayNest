'use client';

import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import { categories } from "@/app/components/navbar/Categories";
import { resolveAssetUrl } from "@/server/api/client";
import { Listing } from "@/server/types/listings/listing";
import { useMemo } from "react";

type ListingClientProps = {
  listing: Listing;
};

export default function ListingClient({
  listing,
}: ListingClientProps) {
  const listingImages: (string | null | undefined)[] =
    Array.isArray(listing.imageUrls) &&
    listing.imageUrls.length > 0
      ? listing.imageUrls
      : [listing.imageSrc];

  const images = listingImages
    .map(resolveAssetUrl)
    .filter(
      (imageSrc): imageSrc is string =>
        Boolean(imageSrc)
    );

  const locationValue =
    listing.locationValue ??
    listing.location ??
    "";

  const category = useMemo(() => {
    return categories.find(
      (item) => item.label === listing.category
    );
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">

          <ListingHead
            title={listing.title ?? ""}
            images={images}
            locationValue={locationValue}
            id={listing.id}
          />

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-7
              md:gap-10
              mt-6
            "
          >
            <ListingInfo
              user={listing.createdBy ?? null}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={locationValue}
            />
          </div>

        </div>
      </div>
    </Container>
  );
}
