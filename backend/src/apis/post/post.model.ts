import {z} from "zod/v4";
import {FollowSchema} from "../follow/follow.model.ts";
import {sql} from "../../utils/database.utils.ts";

/**
 * Schema for validating post objects
 * @shape id: uuid for primary key referencing post table id
 * @shape wanderListId: uuid foreign key referencing wanderlist table id
*@shape content: string provide content information for post
 * @shape dateTimeCreated: timestamptz for setting post date created
*@shape dateTimeModified: timestamptz for modifying your post
*@shape title: string for providing title to post
*@shape visibility: string for showing post public or private
**/

export const PostSchema = z.object ({
    id: z.uuidv7('please provide a valid uuid'),

    wanderlistId: z.uuidv7('please provide a valid uuid'),

    content: z.string( 'please provide valid content')
        .max(1000, 'please provide valid content(max 1000 characters)')
        .trim()
        .nullable(),

    datetimeCreated:z.coerce.date('please provide a valid datetime created')
        .nullable(),

    datetimeModified:z.coerce.date('please provide a valid date time modified')
        .nullable(),

    title: z.string('please provide a valid title')
        .max(64, 'please provide a valid title (max 64 characters)'),

    visibility: z.string('please provide a valid visibility')
        .max(32, 'please provide a valid visibility (max 32 characters)')
})

export type Post = z.infer<typeof PostSchema>

export async function insertPost(post:Post): Promise<string> {
    PostSchema.parse(post);

    const{id, wanderlistId, content, datetimeCreated, datetimeModified, title, visibility} = post;

    await sql `INSERT INTO post(id, wanderlist_id, content, datetime_created, datetime_modified, title, visibility) VALUES(${id}, ${wanderlistId}, ${content}, ${datetimeCreated}, ${datetimeModified}, ${title}, ${visibility})`

    return "Successfully inserted post"
}

/**
 * deleting the record from post table
 * @param id to delete the record
 * @returns successfully deleted message
 */

export async function deletePost(id: string): Promise<string | null> {
    await sql `DELETE FROM post WHERE id = ${id}`

    return  "Successfully deleted"
}

/**
*select the post basedon wanderlist id and visibility
* @param visibility, and wanderlist id
* @return post items
 */

export async function selectPostbyWanderlistIdAndVisibility(visibility: string, wanderlistId: string): Promise<Post[]  | null>
{
    const rowList = await sql `SELECT id, wanderlist_id, content, datetime_created, datetime_modified, title, visibility FROM post WHERE visibility =${visibility} and wanderlist_id =${wanderlistId}`

    const result = PostSchema.array().parse(rowList)

    return result ?? null
}

/**
 *select the post by Primary Key
 * @param visibility, and wanderlist id
 * @return post items
 */

export async function selectPostbyPrimaryKey(id: string): Promise<Post  | null>
{
    const rowList = await sql `SELECT id, wanderlist_id, content, datetime_created, datetime_modified, title, visibility FROM post WHERE id =${id}`

    const result = PostSchema.array().max(1).parse(rowList)

    return result[0] ?? null
}
