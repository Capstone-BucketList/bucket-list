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