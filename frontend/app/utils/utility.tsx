

export const commentBasePath = '/apis/comment'
export const followBasePath = '/apis/follow'
export const mediaBasePath = "/apis/media"
export const postBasePath = '/apis/post'
export const profileBasePath = '/apis/profile'
export const sharedstoriesBasePath = '/apis/shared-stories'

export function addHeaders(authorization:string, cookie:string)   :Headers{
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append("Authorization", authorization)
    requestHeaders.append("Cookie", cookie)
    return requestHeaders;
}