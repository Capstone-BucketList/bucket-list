import {z} from "zod/v4";


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