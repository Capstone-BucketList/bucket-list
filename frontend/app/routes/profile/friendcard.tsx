import type {Profile} from "~/utils/models/profile.model";
import {Form} from "react-router";
import { UserX, UserPlus } from "lucide-react";

type Props = {
    profile: Profile;
    isFriend: boolean;
    errorMessage?: string;
};

export function FriendCard(props: Props) {
    const {profile, isFriend} = props

    return (
        <Form
            action={isFriend ? "unfollow" : "follow"}
            noValidate={true}
            method={'POST'}
        >
            <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-shadow duration-300 rounded-lg p-3 md:p-4 border border-blue-100 hover:border-blue-300 overflow-hidden">
                <div className="flex gap-3 md:gap-4">
                    {/* Left Side - Profile Picture */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <img
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-2 ring-blue-300"
                                src={profile.profilePicture ?? ''}
                                alt={`${profile.userName}`}
                            />
                            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-5 h-5 border-2 border-white"></div>
                        </div>
                    </div>

                    {/* Right Side - Username and Button */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        {/* Username */}
                        <p className="font-bold text-gray-900 text-sm md:text-base truncate">
                            {profile.userName}
                        </p>

                        {/* Action Button */}
                        <input type="hidden" name="followedProfileId" value={profile.id} />
                        <button
                            type="submit"
                            className={`mt-2 px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 w-full flex-shrink-0 ${
                                isFriend
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                            }`}
                        >
                            {isFriend ? (
                                <>
                                    <UserX size={14} />
                                    <span className="hidden sm:inline">Unfollow</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={14} />
                                    <span className="hidden sm:inline">Follow</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    );
}