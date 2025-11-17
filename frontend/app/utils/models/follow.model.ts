import {z} from "zod/v4";
import type {Status} from "~/utils/interfaces/Status";
import {addHeaders, followBasePath} from "~/utils/utility";
import {data} from "react-router";


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
 * insert the Follow
 * @param comment
 */
export async function postFollow(followedProfileId:string,authorization:string, cookie:string): Promise<Status> {

    return  await fetch(`${process.env.REST_API_URL}${followBasePath}/${followedProfileId}`, {
        method: 'POST',
        headers:  addHeaders(authorization,cookie),
        body: JSON.stringify(data)
    }).then( res => {
        if(!res.ok){
            throw new Error(res.statusText)
        }
        return res.json()
    })
}

/**
 * delete the comment
 * @param commentId
 * @param authorization
 * @param cookie
 */
export async function deleteFollowedProfileId(profileId: string, authorization:string, cookie:string): Promise<Status> {

    return  await fetch(`${process.env.REST_API_URL}${followBasePath}/${profileId}`, {
        method: 'DELETE',
        headers: addHeaders(authorization, cookie),
        body: JSON.stringify(data)
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        return res.json()
    })
}