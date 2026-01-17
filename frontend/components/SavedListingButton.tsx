'use client';

import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface SavedListingButtonProps {
    listingId: number;
    className?: string;
    iconSize?: number;
}

export default function SavedListingButton({
    listingId,
    className,
    iconSize = 20
}: SavedListingButtonProps) {

    const { user, savedListingIds, toggleSave } = useAuth();

    const isSaved = savedListingIds?.includes(listingId) ?? false;

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || !listingId) {
            toast.error("Please login to save properties");
            return;
        }

        try {
            await toggleSave(listingId);
            toast.success(isSaved ? "Removed from watchlist" : "Added to watchlist");
        } catch (error) {
            toast.error("Failed to update watchlist");
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "p-2 rounded-full transition-all hover:bg-white/80 active:scale-90",
                className
            )}
            title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
        >
            <Heart
                size={iconSize}
                className={cn(
                    "transition-all duration-300",
                    isSaved
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-600 hover:text-red-500"
                )}
            />
        </button>
    );
}
