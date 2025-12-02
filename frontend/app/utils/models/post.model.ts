import {z} from "zod/v4";
import {addHeaders, postBasePath} from "~/utils/utility";

/**
 * Schema for validating post objects
 * @shape id: uuid for primary key referencing post table id
 * @shape wanderListId: uuid foreign key referencing wanderlist table id
 *@shape content: string provide content information for post
 * @shape dateTimeCreated: timestamptz for setting post date created
 *@shape dateTimeModified: timestamptz for modifying your post
 *@shape title: string for providing title to post
 *@shape visibility: string for showing post public or private
 *@shape milestone: boolean for marking post as a milestone for timeline
 **/

export const PostSchema = z.object ({
    id: z.uuidv7('please provide a valid uuid').optional(),

    wanderlist_id: z.uuidv7('please provide a valid uuid'),

    content: z.string( 'please provide valid content')
        .min(1, 'please provide valid content')
        .max(1000, 'please provide valid content(max 1000 characters)')
        .trim(),

    datetime_created:z.coerce.date('please provide a valid datetime created')
        .optional(),

    datetime_modified:z.coerce.date('please provide a valid date time modified')
        .optional(),

    title: z.string('please provide a valid title')
        .min(1, 'please provide a valid title')
        .max(64, 'please provide a valid title (max 64 characters)'),

    visibility: z.string('please provide a valid visibility')
        .max(32, 'please provide a valid visibility (max 32 characters)'),

    milestone: z.boolean('please provide a valid milestone value')
        .optional()
})

export type Post = z.infer<typeof PostSchema>

export async function getPostByWanderListId(wanderListId: string, authorization: string, cookie: string): Promise<Post[]> {


    const response = await fetch(`${process.env.REST_API_URL}/post/wanderlist/${wanderListId}`, {
        method: 'GET',
        headers: addHeaders(authorization,cookie),
    }) .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch posts by wanderlist id')
        }
        return response.json()
    })

    const result = PostSchema.array().parse(response.data)

    return result
}

export async function getPostByProfileId(profileId: string, authorization: string, cookie: string): Promise<Post[]> {

    const response = await fetch(`${process.env.REST_API_URL}${postBasePath}/profile/${profileId}`, {
        method: 'GET',
        headers: addHeaders(authorization,cookie),
    }) .then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch post(s) by profile id')
        }
        return res.json()
    })
    const result = PostSchema.array().parse(response.data)

    return result
}

export async function getPostByPrimaryKey(postId: string, authorization: string, cookie: string): Promise<Post> {

    const response = await fetch(`${process.env.REST_API_URL}${postBasePath}/${postId}`, {
        method: 'GET',
        headers: addHeaders(authorization,cookie),
    }) .then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch post by primary key')
        }
        return res.json()
    })
    const result = PostSchema.parse(response.data)
    return result
}

export async function getPostByWanderlistIdAndVisibility (wanderlistId: string, authorization: string, cookie: string): Promise<Post[]> {


    const response = await fetch (`${process.env.REST_API_URL}/post?wanderlistId=${wanderlistId}&visibility=public`, {
         method: 'GET',
        headers: addHeaders(authorization,cookie),
})  .then(res => {
    if(!res.ok) {
        throw new Error('failed to fetch post by wanderlist id and visibility')
    }
    return res.json()
})

    const result = PostSchema.array().parse(response.data)

    return result
}

export async function getAllVisiblePosts(authorization: string, cookie: string): Promise<Post[]> {

    const response = await fetch(`${process.env.REST_API_URL}${postBasePath}/visible/posts`, {
        method: 'GET',
        headers: addHeaders(authorization,cookie),
    }) .then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch all visible posts')
        }
        return res.json()
    })
    const result = PostSchema.array().parse(response.data)

    return result
}

export async function getVisiblePostsByLoggedInProfileFollow(profileId: string, authorization: string, cookie: string): Promise<Post[]> {

    const response = await fetch(`${process.env.REST_API_URL}${postBasePath}/follow/${profileId}`, {
        method: 'GET',
        headers: addHeaders(authorization,cookie),
    }).then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch all visible posts by logged in profile follow')
        }
        return res.json()
    })

        const result = PostSchema.array().parse(response.data)

        return result
}

/**
 * Create a new post
 * @param data - Post data from the form
 * @param authorization - Auth token
 * @param cookie - Session cookie
 */
export async function createPost(data: Post, authorization: string, cookie: string): Promise<any> {
    const response = await fetch(`${process.env.REST_API_URL}${postBasePath}`, {
        method: 'POST',
        headers: addHeaders(authorization, cookie),
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error('Failed to create post')
    }

    const result = await response.json()
    return result
}

export async function postPost(PostId: string, authorization: string, cookie: string) : Promise<Post> {

    return await fetch(`${process.env.REST_API_URL}${postBasePath}/${PostId}`, {
        method: 'POST',
        headers: addHeaders(authorization,cookie),

    }) .then(res => {
    if(!res.ok) {
         throw new Error(res.statusText)
    }
    return res.json()
    })
}

export async function deletePost(postId: string, authorization: string, cookie: string): Promise<Post> {

    return await fetch(`${process.env.REST_API_URL}${postBasePath}/${postId}`, {
        method: 'DELETE',
        headers: addHeaders(authorization, cookie),

    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        return res.json()
    })
}

export async function putPost(post: Post, authorization: string, cookie: string): Promise<Post> {
    return await fetch(`${process.env.REST_API_URL}${postBasePath}`, {
        method: 'PUT',
        headers: addHeaders(authorization,cookie),
        body: JSON.stringify(post)

    }) .then(res => {
        if(!res.ok) {
            throw new Error(res.statusText)
        }
        return res.json()
    })
}