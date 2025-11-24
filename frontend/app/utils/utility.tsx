

export const commentBasePath = '/comment'
export const followBasePath = '/follow'
export const mediaBasePath = "/media"
export const postBasePath = '/post'
export const profileBasePath = '/profile'
export const wanderlistBasepath = '/wanderlist'

export function addHeaders(authorization:string, cookie:string)   :Headers{
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append("Authorization", authorization)
    requestHeaders.append("Cookie", cookie)
    return requestHeaders;
}