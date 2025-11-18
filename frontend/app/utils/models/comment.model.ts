import {z} from "zod/v4";
import type {Status} from "~/utils/interfaces/Status";
import {data} from "react-router";
import * as process from "node:process";
import {addHeaders, commentBasePath} from "~/utils/utility";

/**
 * Schema for validating the comment object
 * @shape id: string for primary key of the comment
 * @shape postId: string for foreign key referencing post id
 * @shape profileId: string for foreign key referencing profile id
 * @shape comment: string for the comment on a post
 * @shape dateCreated: date for the comment creation date
 */

export const CommentSchema = z.object({

    id: z
        .uuidv7('Please provide a valid ID'),
    postId: z
        .uuidv7('Please provide a valid post ID'),
    profileId: z
        .uuidv7('Please provide a valid profile ID'),
    comment: z
        .string('Please provide a comment')
        .min(1, 'Comment is required')
        .max(160, 'Comment cannot exceed 160 characters')
        .trim(),
    dateCreated: z.coerce
        .date('Please provide a valid date')
}).omit({dateCreated: true})

/**
 * this type is used to represent comment object
 * @shape id: string for primary key of the comment
 * @shape postId: string for foreign key referencing post id
 * @shape profileId: string for foreign key referencing profile id
 * @shape comment: string for the comment on a post
 * @shape dateCreated: date for the comment creation date
 */

export type Comment = z.infer<typeof CommentSchema>

/**
 * insert the comment
 * @param comment
 */
export async function postComment(comment: Comment, authorization:string, cookie:string): Promise<Status> {

     return  await fetch(`${process.env.REST_API_URL}${commentBasePath}`, {
            method: 'POST',
            headers:  addHeaders(authorization,cookie),
            body: JSON.stringify(comment)
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
export async function deleteComment(commentId: string, authorization:string, cookie:string): Promise<Status> {

    return  await fetch(`${process.env.REST_API_URL}${commentBasePath}/${commentId}`, {
        method: 'DELETE',
        headers: addHeaders(authorization, cookie),

    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        return res.json()
    })
}

/**
 * get the posts by ID
 * @param postId
 * @param authorization
 * @param cookie
 */
export async function getPostsByPostId(postId: string, authorization:string, cookie:string): Promise<Comment> {
    return await fetch(`${process.env.REST_API_URL}${commentBasePath}/${postId}`, {
        method: 'GET',
        headers: addHeaders(authorization, cookie),
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        return CommentSchema.parse(res.json())
    })
}

/**
 * get the posts by ID
 * @param postId
 * @param authorization
 * @param cookie
 */
export async function getCommentByProfileId(profileId: string, authorization:string, cookie:string): Promise<Comment> {
    return await fetch(`${process.env.REST_API_URL}${commentBasePath}/profile/${profileId}`, {
        method: 'GET',
        headers: addHeaders(authorization, cookie),

    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        return CommentSchema.parse(res.json())
    })
}

/**
 * get the posts by ID
 * @param postId
 * @param authorization
 * @param cookie
 */
export async function getCommentByPostId(postId: string, authorization:string, cookie:string): Promise<Comment> {
    return await fetch(`${process.env.REST_API_URL}${commentBasePath}/post/${postId}`, {
        method: 'GET',
        headers: addHeaders(authorization, cookie),
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        return CommentSchema.parse(res.json())
    })
}