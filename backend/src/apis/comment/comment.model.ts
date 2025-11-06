import {sql} from "../../utils/database.utils.ts";
import {z} from "zod/v4";

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
 * insert new comment into comment table
 * @param comments the comment object to insert
 * @returns success message
 */

export async function insertComment(comments: Comment): Promise<string> {
    // validate the thread object against the CommentSchema
    CommentSchema.parse(comments)

    const {id, postId, profileId, comment} = comments

    await sql `
        INSERT INTO comment (id, post_id, profile_id, comment, date_created) 
        VALUES (${id}, ${postId}, ${profileId}, ${comment}, now())
        `

    return ("Comment successfully created")
}

/**
 * Select a comment by its ID
 * @param id the id of the comment to select
 * @returns the comment or null if not found
 */
export async function getCommentByPrimaryKey(id: string): Promise<Comment | null> {
    const rowList = await sql `
        SELECT id, post_id, profile_id, comment 
        FROM comment
        WHERE id = ${id}
        `

    // Enforce that the result is an array of one thread, or null
    const result = CommentSchema
        .array()
        .max(1)
        .parse(rowList)
    return result[0] ?? null
}

/**
 * delete comment record
 * @param id an object that contains the comment id in params
 * @returns success message
 */

export async function deleteComment (id: string): Promise<string> {

    await sql `
        DELETE FROM comment
        WHERE id = ${id}
`
    return ("Comment successfully deleted")
}

/**
 * select comments by post id
 * @param postId an object that contains the comment id in params
 * @returns comments on post
 */

export async function getCommentByPostId (postId: string): Promise<Comment[] | null> {
    const rowList = await sql `
    SELECT id, post_id, profile_id, comment, date_created
    FROM comment
    WHERE post_id = ${postId}
    `

    const result = CommentSchema
        .array()
        .parse(rowList)
    return result ?? null
}

/**
 * select comments by post id
 * @param profileId an object that contains the comment id in params
 * @returns comments on post
 */

export async function getCommentByProfileId (profileId: string): Promise<Comment[] | null> {
    const rowList = await sql `
    SELECT id, post_id, profile_id, comment, date_created
    FROM comment
    WHERE post_id = ${profileId}
    `

    const result = CommentSchema
        .array()
        .parse(rowList)
    return result ?? null
}