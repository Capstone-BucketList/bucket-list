import React from "react";
import type {Profile} from "~/utils/models/profile.model";

/**
 * ProfilePreview component displays a compact preview card for a profile's profile.
 * Shows profile image, name, and bio. Used for quick profile popups.
 *
 * @param profile profile object to preview
 */
export function ProfilePreview({ profile }: { profile: Profile }) {
    return (
        <div className="absolute z-50 top-10 right-0 bg-white shadow-lg rounded-lg p-4 w-64 border">
            <div className="flex flex-col items-center gap-3">
                {/* Profile image */}
                <img src={profile.profilePicture} alt="Profile" className="w-1/2 h-1/2 rounded-full" />
                {/* profile name */}
                <div>
                    <div className="font-semibold">{profile.userName}</div>
                </div>
                {/* profile bio or fallback */}
                <div className="text-sm text-gray-500">{profile.bio || "No bio available"}</div>
            </div>
        </div>
    );
}