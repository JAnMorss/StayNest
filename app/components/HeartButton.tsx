"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useCurrentUser } from "@/app/hooks/useUser";
import {
    useAddListingToFavorites,
    useFavoriteListings,
    useRemoveListingFromFavorites,
} from "@/app/hooks/useListing";

type HeartButtonProps = {
    listingId: string;
}

export default function HeartButton({
    listingId,
}: HeartButtonProps) {
    const loginModal = useLoginModal();
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
    const { data: favoriteIds = [] } = useFavoriteListings(Boolean(currentUser));
    const addFavorite = useAddListingToFavorites();
    const removeFavorite = useRemoveListingFromFavorites();
    const hasFavorited = Boolean(currentUser) && favoriteIds.includes(listingId);
    const isPending = addFavorite.isPending || removeFavorite.isPending;

    const toggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (!currentUser) {
            loginModal.onOpen();
            return;
        }

        const mutation = hasFavorited ? removeFavorite : addFavorite;
        mutation.mutate(listingId, {
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <button
            type="button"
            onClick={toggleFavorite}
            aria-label={
                hasFavorited
                    ? "Remove from favorites"
                    : "Add to favorites"
            }
            aria-pressed={hasFavorited}
            disabled={isPending || isUserLoading}
            className="
                relative
                cursor-pointer
                transition
                hover:opacity-80
                disabled:cursor-wait
            "
        >
            <AiOutlineHeart
                size={28}
                className="
                    absolute
                    -top-0.5
                    -right-0.5
                    text-white
                    drop-shadow-md
                "
            />

            <AiFillHeart
                size={24}
                className={`
                    relative
                    transition
                    ${
                        hasFavorited
                            ? "text-rose-500"
                            : "text-neutral-500/70"
                    }
                `}
            />
        </button>

    );
}