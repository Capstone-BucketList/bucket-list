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
    comment: z.string('Please provide a valid comment'),
    dateCreated: z.date('Please provide a valid date')
}).omit({dateCreated:true})

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
 * insert record to comment on post
 * @param comment object to insert
 * @returns string successfully insert message
 */

export async function postComment(comment: Comment) {
    CommentSchema.parse(comment)

    const {id, postId, profileId, comment, dateCreated} = comment

    await sql `INSERT INTO comment (id, post_id, profile_id, comment, date_created) VALUES (${id}, ${postId}, ${profileId}, ${comment}, date(${dateCreated}))`

    return ("Comment successfully posted")
}