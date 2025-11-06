import {z} from "zod/v4";
import {FollowSchema} from "../follow/follow.model.ts";
import {sql} from "../../utils/database.utils.ts";
import {PublicProfileSchema} from "../profile/profile.model.ts";
import {WanderListSchema} from "../wanderlist/wanderlist.model.ts";

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
}).omit({datetimeCreated:true, datetimeModified : true})

export type Post = z.infer<typeof PostSchema>

/**
 * insert the post record
 * @param post
 * @return success message
 */
export async function insertPost(post:Post): Promise<string> {
    PostSchema.parse(post);

    const{id, wanderlistId, content, title, visibility} = post;

    await sql `INSERT INTO post(id, wanderlist_id, content, datetime_created, datetime_modified, title, visibility) VALUES(${id}, ${wanderlistId}, ${content}, now(),now(), ${title}, ${visibility})`

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
*select the post based on wanderlist id and visibility
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
 * @param postId
 * @return post items
 */

export async function selectPostbyPrimaryKey(id: string): Promise<Post  | null>
{
    const rowList = await sql `SELECT id, wanderlist_id, content, datetime_created, datetime_modified, title, visibility FROM post WHERE id =${id}`

    const result = PostSchema.array().max(1).parse(rowList)

    return result[0] ?? null
}

/**
 * Update the post record
 * @param post
 * @return success message
 */
export async function  updatePost(post:Post): Promise<string> {
    PostSchema.parse(post);

    const{id,  content,  title, visibility} = post;

    await sql `UPDATE post SET 
                content=${content}, 
                datetime_modified =now(), 
                title=${title},
                visibility=${visibility} 
            WHERE id = ${id}`
    return "Successfully updated post"
}

export const PostWithProfileFollowSchema = PostSchema.extend(
    {
     profile: PublicProfileSchema.optional(),
     wanderlist: WanderListSchema.optional()
    }
)

export type PostWithProfileFollow = z.infer<typeof PostWithProfileFollowSchema>

/**
 * get all visible post to friends
 * @param id
 */
export async function selectVisiblePostsByLoggedInProfileFollow(id: string): Promise<PostWithProfileFollow[]> {
    const rowList = await
        sql ` SELECT 
            pt.title, pt.content, pt.datetime_created, pt.datetime_modified, pt.visibility,pt.id, p.id,p.bio,p.id,  p.date_created, p,email, p.visibility, p.profile_picture,pt.wanderlist_id,
            w.description, w.title, w.date_created,w.target_date,w.pinned,w.visibility,w.id, w.profile_id, w.pinned, w.wanderlist_status    
        FROM profile p
            INNER JOIN follow f on p.id = f.follower_profile_id 
            INNER JOIN wanderlist w on f.followed_profile_id = w.profile_id
            INNER JOIN post pt on w.id = pt.wanderlist_id
                WHERE p.id = ${id} AND p.visibility = 'public' `
    console.log(rowList)
    return PostWithProfileFollowSchema.array().parse(rowList)
}

/**
 * selects all visible post
 */
export async function selectAllVisiblePosts():Promise<Post[]> {
    const rowlist = await sql
        `SELECT id,wanderlist_id,content, title,visibility FROM POST WHERE visibility='public' `

    return PostSchema.array().parse(rowlist)
}

/**
 * select all the posts by profileId
 * @param id
 * @return posts associated with profileId
 */
export async function selectPostsByProfileId(id:string):Promise<Post[]> {
    const rowlist = await sql
        `SELECT pt.id,pt.wanderlist_id,pt.content, pt.title,pt.visibility 
            FROM POST pt
            INNER JOIN wanderlist w on pt.wanderlist_id = w.id
            INNER JOIN profile p on w.profile_id = p.id
         WHERE p.id= ${id}`

    return PostSchema.array().parse(rowlist)

}

/**
 * select post by wanderlist
 * @param wanderlist id
 * @return posts associated with wanderlist id
 */
export async function selectPostsByWanderList(id:string):Promise<Post[]> {
    const rowlist = await sql
        `SELECT id,wanderlist_id,content, title,visibility FROM POST WHERE wanderlist_id =${id} `

    return PostSchema.array().parse(rowlist)
}