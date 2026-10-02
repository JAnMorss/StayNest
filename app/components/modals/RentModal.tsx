"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useState } from "react";
import {
  useForm,
  useWatch,
  type Path,
  type PathValue,
  type SubmitHandler,
} from "react-hook-form";
import toast from "react-hot-toast";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect, {
  CountrySelectValue,
} from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import {
  createListing,
  uploadListingImages,
} from "@/server/api/listings/listing";
import Input from "../inputs/Input";
import { useRouter } from "next/navigation";

type RentFormValues = {
  category: string;
  location: CountrySelectValue | null;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  images: File[];
  title: string;
  description: string;
  price: number;
};

function getListingId(response: unknown): string | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const result = response as Record<string, unknown>;
  const data = result.data;

  if (
    data &&
    typeof data === "object" &&
    "id" in data &&
    typeof data.id === "string"
  ) {
    return data.id;
  }

  return typeof result.id === "string" ? result.id : null;
}

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

export default function RentModal() {
  const rentModal = useRentModal();
  const router = useRouter();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingListingId, setPendingListingId] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    trigger,
  } = useForm<RentFormValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      images: [],
      price: 1,
      title: "",
      description: "",
    },
  });

  register("category", {
    required: "Choose a category.",
  });

  register("location", {
    validate: (value) =>
      value !== null || "Choose a location.",
  });

  register("guestCount", {
    min: {
      value: 1,
      message: "At least one guest is required.",
    },
  });

  register("roomCount", {
    min: {
      value: 1,
      message: "At least one room is required.",
    },
  });

  register("bathroomCount", {
    min: {
      value: 1,
      message: "At least one bathroom is required.",
    },
  });

  const category = useWatch({
    control,
    name: "category",
  });

  const location = useWatch({
    control,
    name: "location",
  });

  const guestCount = useWatch({
    control,
    name: "guestCount",
  });

  const roomCount = useWatch({
    control,
    name: "roomCount",
  });

  const bathroomCount = useWatch({
    control,
    name: "bathroomCount",
  });

  const images = useWatch({
    control,
    name: "images",
  });

  const setCustomValue = <TField extends Path<RentFormValues>>(
    id: TField,
    value: PathValue<RentFormValues, TField>
  ) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const stepFields: Record<
    STEPS,
    (keyof RentFormValues)[]
  > = {
    [STEPS.CATEGORY]: ["category"],
    [STEPS.LOCATION]: ["location"],
    [STEPS.INFO]: [
      "guestCount",
      "roomCount",
      "bathroomCount",
    ],
    [STEPS.IMAGES]: [],
    [STEPS.DESCRIPTION]: [
      "title",
      "description",
    ],
    [STEPS.PRICE]: ["price"],
  };

  const onNext = async () => {
    const isValid = await trigger(stepFields[step]);

    if (!isValid) {
      return;
    }

    setStep((value) => value + 1);
  };

  const closeAfterSuccess = () => {
    reset();
    setStep(STEPS.CATEGORY);
    setPendingListingId(null);
    rentModal.onClose();
  };

  const submitListing: SubmitHandler<RentFormValues> = async (
    values
  ) => {
    setIsSubmitting(true);

    try {
      let listingId = pendingListingId;

      if (!listingId) {
        const created = await createListing<unknown>({
          title: values.title.trim(),
          description: values.description.trim(),
          category: values.category,
          roomCount: values.roomCount,
          bathroomCount: values.bathroomCount,
          guestCount: values.guestCount,
          locationValue: values.location?.value ?? "",
          price: values.price,
        });

        listingId = getListingId(created);
      }

      if (values.images.length > 0 && !listingId) {
        toast.error(
          "The listing was created, but the API did not return its ID, so photos could not be uploaded."
        );

        closeAfterSuccess();
        return;
      }

      if (listingId && values.images.length > 0) {
        setPendingListingId(listingId);

        await uploadListingImages(listingId, {
          files: values.images,
        });
      }

      toast.success("Your listing has been Created.");

      router.refresh();

      closeAfterSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create your listing."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onModalSubmit = async () => {
    if (step === STEPS.PRICE) {
      await handleSubmit(submitListing)();
      return;
    }

    await onNext();
  };

  const actionLabel =
    step === STEPS.PRICE
      ? pendingListingId
        ? "Retry photo upload"
        : "Create"
      : "Next";

  const secondaryActionLabel =
    step === STEPS.CATEGORY || pendingListingId
      ? undefined
      : "Back";

  let bodyContent = (
    <div className="flex flex-col gap-6">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-3
          max-h-[40vh]
          overflow-y-auto
          pr-2
        "
      >
        {categories.map((item) => (
          <div
            key={item.label}
            className="col-span-1"
          >
            <CategoryInput
              onClick={(category) =>
                setCustomValue("category", category)
              }
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>

      {errors.category && (
        <p className="text-sm text-rose-500">
          {errors.category.message}
        </p>
      )}
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />

        <CountrySelect
          value={location ?? undefined}
          onChange={(value) =>
            setCustomValue("location", value)
          }
        />

        <Map center={location?.latlng} />

        {errors.location && (
          <p className="text-sm text-rose-500">
            {errors.location.message}
          </p>
        )}
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />

        <Counter
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCount}
          onChange={(value) =>
            setCustomValue("guestCount", value)
          }
        />

        {errors.guestCount && (
          <p className="text-sm text-rose-500">
            {errors.guestCount.message}
          </p>
        )}

        <hr />

        <Counter
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) =>
            setCustomValue("roomCount", value)
          }
        />

        {errors.roomCount && (
          <p className="text-sm text-rose-500">
            {errors.roomCount.message}
          </p>
        )}

        <hr />

        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
          value={bathroomCount}
          onChange={(value) =>
            setCustomValue("bathroomCount", value)
          }
        />

        {errors.bathroomCount && (
          <p className="text-sm text-rose-500">
            {errors.bathroomCount.message}
          </p>
        )}
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add photos of your place"
          subtitle="Show guests what your place looks like."
        />

        <ImageUpload
          value={images}
          onChange={(files) =>
            setCustomValue("images", files)
          }
          disabled={isSubmitting}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading
          title="How would you describe your place"
          subtitle="Short and sweet works best!"
        />

        <Input
          id="title"
          label="Title"
          disabled={isSubmitting}
          register={register}
          errors={errors}
          required
        />

        <hr />

        <Input
          id="description"
          label="Description"
          disabled={isSubmitting}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />

        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isSubmitting}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={onModalSubmit}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={
        secondaryActionLabel
          ? onBack
          : undefined
      }
      title="Airbnb your home"
      body={bodyContent}
      disabled={isSubmitting}
    />
  );
}