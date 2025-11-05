import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";

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
/*
const MediaWithPost = MediaSchema.extend({
    posts:z.array(PostSc)
})*/
/**
 * inserts the record into media table
 * @param media
 * @return success message
 */
export async function insertMedia(media: Media):Promise<string> {
    MediaSchema.parse(media)
    const {id,postId,url} = media

    await sql `INSERT INTO media(id,post_id,url) VALUES(${id},${postId},${url})`

    return "Successfully inserted into Media."
}

/**
 * delete the media record
 * @param id
 * @return success message
 */
export async function deleteMedia(id: string):Promise<string> {

    await sql `DELETE FROM media WHERE id = ${id}`

    return "Successfully deleted into Media."
}

/**
 * select the media record using primary key
 * @param id
 * @return media objects
 */
export async function selectMediaByPrimaryKey(id: string):Promise<Media> {
    const rowList = await sql `SELECT id, post_id, url FROM media WHERE id = ${id}`
    const result = MediaSchema.array().max(1).parse(rowList)
    return result[0] ?? null
}

/**
 * select  media by post id
 * @param postId
 * @return media object
 */
export async function selectMediaByPostId(postId: string):Promise<string> {
    const rowList = await sql `SELECT id, post_id, url FROM media WHERE post_id = ${postId}`
    const result = MediaSchema.array().parse(rowList)
    return result ?? null
}

/**
 * select all visible medias
 * @return media objects
 */
export async function selectAllMediaForVisiblePosts() : Promise<Media[] | null> {
    const rowList = await  sql`SELECT m.id,m.post_id,m.url,p.title,p.content FROM Media m
                INNER JOIN post p on m.post_id = p.id
                    WHERE p.visibility = 'public'`

    const result = MediaSchema.array().parse(rowList)
    return result ?? null

}