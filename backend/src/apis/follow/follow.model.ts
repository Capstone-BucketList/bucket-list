import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";

/**
 * Schema for validating follow objects
 * @shape followedProfileId: uuid for foreign key referencing profile table id
 * @shape followerProfileId: uuid for foreign key referencing profile table id
 */


export const followSchema = z.object ({
    followedProfileId: z.uuidv7('please provide a valid uuid'),
    followerProfileId: z.uuidv7('please provide a valid uuid')
})

/**
 * this type is used to represent a follow object
 * @shape followedProfileId: uuid referencing profile table id
 * @shape followerProfileId: uuid referencing profile table id
 */
export type Follow = z.infer<typeof followSchema>

/**
 * inserts a new follow into follow table
 * @param follow the profile id to insert
 * @returns "follow successfully created for profile id"
 */

export async function insertFollow(follow: Follow): Promise<string> {
    followSchema.parse(follow)

    const {followedProfileId, followerProfileId} = follow
    await sql `INSERT INTO follow(followed_profile_id, follower_profile_id) VALUES (${followedProfileId}, ${followerProfileId})`
    return 'follow success'
}

/**
 * select a profile id from the follow table by follow(er/ed) id
 * @param followId the profile id used to locate follow id from follow table
 * @returns profile or null if no profile id was found
 */

export async function selectFollowProfileById(followId: string): Promise<Follow | null> {
    const rowList = await sql `SELECT followed_profile_id, follower_profile_id FROM follow WHERE followed_profile_id = ${followId}`
    const result = followSchema.array().max(1).parse(rowList)

    return result[0] ?? null
}



