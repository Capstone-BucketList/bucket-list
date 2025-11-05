/**
 * Schema for validating the comment object
 * @shape id: string for primary key of the comment
 * @shape postId: string for foreign key referencing post id
 * @shape profileId: string for foreign key referencing profile id
 * @shape comment: string for the comment on a post
 * @shape dateCreated: date for the comment creation date
 */
import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";


export const CommentSchema = z.object({

    id: z.uuidv7('Please provide a valid ID'),
    postId: z.uuidv7('Please provide a valid post ID'),
    profileId: z.uuidv7('Please provide a valid profile ID'),
    comment: z.string('Please provide a valid comment')
        .min(1, 'Please provide a valid comment')
        .max(160, 'Comment cannot exceed 160 characters')
        .trim(),
    dateCreated: z.coerce.date('Please provide a valid date')
})

/**
 * this type is used to represent comment object
 */

export type Comment = z.infer<typeof CommentSchema>

/**
 * insert new comment into database
 * @param comment the comment object to insert
 * @returns "Comment successfully created"
 */

export async function insertComment(comment: Comment): Promise<string> {
    // validate the thread object against the CommentSchema
    CommentSchema.parse(comment)

    const {id, postId, profileId, comment, dateCreated} = comment

    await sql `
        INSERT INTO comment (id, post_id, profile_id, comment, date_created) 
        VALUES (${comment.id}, ${comment.postId}, ${comment.profileId}, ${comment.comment}, date(${comment.dateCreated}))
        `

    return ("Comment successfully created")
}