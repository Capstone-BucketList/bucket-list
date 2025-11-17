import {z} from "zod/v4";

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

export async function getMediaByPostId(postId: string, authorization: string, cookie: string): Promise<Media[]> {
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', authorization)
    requestHeaders.append('Cookie', cookie)

    const response = await fetch(`${process.env.REST_API_URL}/media/post/${postId}`, {
        method: 'GET',
        headers: requestHeaders,
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch media by post id')
        }
        return response.json()
    })

    const result = MediaSchema.array().parse(response.data)
    return result
}

export async function getMediaByPrimaryKey(id: string, authorization: string, cookie: string): Promise<Media> {
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', authorization)
    requestHeaders.append('Cookie', cookie)

    const response = await fetch (`${process.env.REST_API_URL}/media/${id}`, {
        method: 'GET',
        headers: requestHeaders,
    }) .then(res => {
       if(!res.ok) { throw new Error('Failed to fetch media by primary key')
    }
    return res.json()
    })
    const result = MediaSchema.parse(response.data)
    return result
}

export async function getAllmediaForVisiblePosts(authorization: string, cookie: string): Promise<Media[]> {
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', authorization)
    requestHeaders.append('Cookie', cookie)

    const response = await fetch (`${process.env.REST_API_URL}/media`, {
        method: 'GET',
        headers: requestHeaders,
    }) .then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch all media for visible posts')
        }
        return res.json()
    })
    const result = MediaSchema.array().parse(response.data)
    return result
}

export async function postMedia(postId: string, url: string, authorization: string, cookie: string): Promise<Media> {
    const response = await fetch(`${process.env.RES_API_URL}/media`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization,
            'Cookie': cookie},
        body: JSON.stringify
    })
    if(!response.ok) {
        throw new Error('Failed to post media')
    }
    const headers = response.headers
    const result = await response.json()
    const media = MediaSchema.parse(result.data)
    return (result, media)
}