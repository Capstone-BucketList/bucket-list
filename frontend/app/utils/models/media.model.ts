import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";
import {PostSchema} from "../post/post.model.ts";

/**
 * Schema for validating media objects
 * @shape id: string the primary key for the media
 * @shape postId:  foreign key from post table
 * @shape url: string the url for the image
 */
export const MediaSchema = z.object({
    id: z.uuidv7('Please provide valid uuid for id'),
    postId: z.uuidv7('Please provide valid uuid for post'),
    url: z.url('Please provide valid url').max(255, 'please provide valid url(max 255 characters long)')
})


/**
 * media type to hold objects
 * @shape id: string the primary key for the media
 * @shape postId:  foreign key from post table
 * @shape url: string the url for the image
 */
export type Media = z.infer<typeof MediaSchema>