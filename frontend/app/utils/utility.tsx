

export const commentBasePath = '/apis/comment'
export const followBasePath = '/apis/follow'

export function addHeaders(authorization:string, cookie:string)   :Headers{
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append("Authorization", authorization)
    requestHeaders.append("Cookie", cookie)
    return requestHeaders;
}