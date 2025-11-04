import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";

/**
 * Schema for validating follow objects
 * @shape followedProfileId: uuid for foreign key referencing profile table id
 * @shape followerProfileId: uuid for foreign key referencing profile table id
 */


export const FollowSchema = z.object ({
    followedProfileId: z.uuidv7('please provide a valid uuid'),
    followerProfileId: z.uuidv7('please provide a valid uuid')
})

/**
 * this type is used to represent a follow object
 * @shape followedProfileId: uuid referencing profile table id
 * @shape followerProfileId: uuid referencing profile table id
 */
export type Follow = z.infer<typeof FollowSchema>

/**
 * inserts a new follow into follow table
 * @param follow the profile id to insert
 * @returns "follow successfully created for profile id"
 */

export async function insertFollow(follow: Follow): Promise<string> {
    FollowSchema.parse(follow)

    const {followedProfileId, followerProfileId} = follow
    console.log("insert follow", follow)
    await sql `INSERT INTO follow(followed_profile_id, follower_profile_id) VALUES (${followedProfileId}, ${followerProfileId})`
    return 'Successfully inserted into Follow table.'
}

/**
 * deleting the record from follow table to unfollow
 * @param follow to delete the record
 * @returns successfully deleted message
 */

export async function deleteFollow(follow: Follow): Promise<string | null> {
    FollowSchema.parse(follow)
    const {followedProfileId, followerProfileId} = follow

    const rowList = await sql `DELETE FROM follow WHERE followed_profile_id = ${followedProfileId} and follower_profile_id = ${followerProfileId}`

    return  "Successfully unfollowed"
}



