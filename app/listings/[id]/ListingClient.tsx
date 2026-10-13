'use client';

import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { categories } from "@/app/components/navbar/Categories";
import useLoginModal from "@/app/hooks/useLoginModal";
import { resolveAssetUrl } from "@/server/api/client";
import { Listing } from "@/server/types/listings/listing";
import { eachDayOfInterval, differenceInCalendarDays } from "date-fns";
import { Range } from "react-date-range";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { reserveListing } from "@/server/api/listings/listing";
import { useCurrentUser } from "@/app/hooks/useUser";
import {
  fromReservationDate,
  toReservationDateISOString,
} from "@/app/utils/reservationDates";

const initialDateRange: Range = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
}

type ListingClientProps = {
  reservations?: NonNullable<Listing["reservations"]>;
  listing: Listing;
};

export default function ListingClient({
  reservations = [],
  listing,
}: ListingClientProps) {
  const loginModal = useLoginModal();
  const router = useRouter();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  const disabledDates = useMemo(() => {
    return reservations.flatMap((reservation) => {
      const start = fromReservationDate(reservation.startDate);
      const end = fromReservationDate(reservation.endDate);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end < start
      ) {
        return [];
      }

      return eachDayOfInterval({ start, end });
    });
  }, [reservations]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const price = listing.price ?? 0;
  const nights =
    dateRange.startDate && dateRange.endDate
      ? Math.max(0, differenceInCalendarDays(dateRange.endDate, dateRange.startDate))
      : 0;
  const totalPrice = price * nights;

  const onCreateReservation = useCallback(async () => {
    if (!currentUser) {
      loginModal.onOpen();
      return;
    }

    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate || endDate <= startDate) {
      toast.error("Choose a valid check-in and check-out date.");
      return;
    }

    if (listing.price == null) {
      toast.error("This listing does not have a valid price.");
      return;
    }

    setIsSubmitting(true);

    try {
      await reserveListing(listing.id, {
        startDate: toReservationDateISOString(startDate),
        endDate: toReservationDateISOString(endDate),
      });
      toast.success("Your reservation has been created.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create reservation.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUser, dateRange, listing.id, listing.price, loginModal, router]);

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
            <div
              className="
                order-first
                mb-10
                md:order-last
                md:col-span-3
              "
            >
              <ListingReservation
                price={price}
                totalPrice={totalPrice}
                onChangeDate={setDateRange}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isSubmitting || isUserLoading || listing.price == null}
                disabledDates={disabledDates}
              />
            </div>
          </div>

        </div>
      </div>
    </Container>
  );
}
