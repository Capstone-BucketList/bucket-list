import {z} from "zod/v4";

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

export async function getPostsByWanderListId(wanderListId: string, authorization: string, cookie: string): Promise<Post[]> {
    const requestHeaders = new Headers()
    requestHeaders.append
    ('Content-Type',
        'application/json')

    requestHeaders.append('Authorization', authorization)
    requestHeaders.append('Cookie', cookie)

    const response = await fetch(`${process.env.REST_API_URL}/post/wanderlist/${wanderListId}`, {
        method: 'GET',
        headers: requestHeaders,
    }) .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch posts by wanderlist id')
        }
        return response.json()
    })

    const result = PostSchema.array().parse(response.data)

    return result
}

export async function getPostByProfileId(profileId: string, authorization: string, cookie: string): Promise<Post> {

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')

    requestHeaders.append('Authorization', authorization)

    requestHeaders.append('Cookie', cookie)

    const response = await fetch(`${process.env.REST_API_URL}/post/profile/${profileId}`, {
        method: 'GET',
        headers: requestHeaders,
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
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')

    requestHeaders.append('Authorization', authorization)

    requestHeaders.append('Cookie', cookie)

    const response = await fetch(`${process.env.REST_API_URL}/post/${postId}`, {
        method: 'GET',
        headers: requestHeaders,
    }) .then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch post by primary key')
        }
        return res.json()
    })
    const result = PostSchema.parse(response.data)
    return result
}

export async function getPostsByWanderlistIdAndVisibility (wanderlistId: string, authorization: string, cookie: string): Promise<Post> {
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    rquestHeaders.append('Authorization', authorization)
    requestHeaders.append('Cookie', cookie)

    const response = await fetch (`${process.env.REST_API_URL}/post?wanderlistId=${wanderlistId}&visibility=public}`, {
         method: 'GET',
        headers: requestHeaders,
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
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', authorization)
    requestHeaders.append('Cookie', cookie)

    const response = await fetch(`${process.env.REST_API_URL}/post/visible/posts`, {
        method: 'GET',
        headers: requestHeaders,
    }) .then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch all visible posts')
        }
        return res.json()
    })
    const result = PostSchema.array().parse(response.data)

    return result
}

export async function getAllVisiblePostbyLoggedInProfileFollow(profileId: string, authorization: string, cookie: string): Promise<Post[]> {
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', authorization)
    requestHeaders.append('Cookie', cookie)

    const response = await fetch(`${process.env.REST_API_URL}/post/follow/${profileId}`, {
        method: 'GET',
        headers: requestHeaders,
    }).then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch all visible posts by logged in profile follow')
        }
        return res.json()
    })

        const result = PostSchema.array().parse(response.data)

        return result
}
