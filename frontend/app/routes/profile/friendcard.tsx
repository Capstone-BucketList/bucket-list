import type {Profile} from "~/utils/models/profile.model";
import {zodResolver} from "@hookform/resolvers/zod";
import {WanderListSchema} from "~/utils/models/wanderlist.model";
import {type Follow, FollowSchema, postFollow} from "~/utils/models/follow.model";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {Form, redirect, useActionData} from "react-router";


type Props = {
    profile: Profile;
    isFriend:boolean;
    errorMessage?: string;
};



export function FriendCard(props:Props ) {

    const {profile,isFriend} = props

    return (
        <div className="flex items-center gap-5">
            <Form  action="follow"
                  noValidate={true}
                  method={'POST'}
                  className="space-y-4 md:space-y-6" >
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={profile.profilePicture ?? ''}
                alt={`${profile.userName} avatar`}
            />
            <div>
                <input type="hidden" name="followedProfileId" value={profile.id} />
                <p className="font-semibold text-gray-900">{profile.userName}</p>
                { !isFriend ?
                    <button type="submit" className="bg-blue-700 rounded p-1" >Follow</button>
                 :
                <button type="submit" className="bg-blue-700 rounded p-1">UnFollow</button>
                }
            </div>
            </Form>
        </div>
    );
}