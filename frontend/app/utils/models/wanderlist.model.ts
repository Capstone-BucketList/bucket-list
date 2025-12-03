import z from "zod/v4";
import type {Status} from "~/utils/interfaces/Status";
import {v7 as uuid} from 'uuid'
import {addHeaders, wanderlistBasepath} from "~/utils/utility";

/**
* Schema for validating the wanderlist object
* @shape id: string the primary key for the profile
* @shape profileId: foreign key  form the profile id
* @shape description: string the description of the wanderlist
* @shape pinned: string the pinned to keep the item as priority
* @shape status: string | null the status of wanderlist item
* @shape targetDate: date for the wanderlist item completion date
* @shape title: string the title of the wanderlist
* @shape visibility: string visibility of the profile
*/
export const WanderListSchema =  z.object({

    id: z.string().optional().transform(val => val === '' ? undefined : val).pipe(z.union([z.uuidv7('Please provide a valid uuid for id'), z.undefined()])),
    profileId: z.uuidv7('Please provide a valid uuid for profile id').optional(),

    description: z.string('Please provide a valid description')
        .max(256, 'please provide a valid description (max 256 characters)')
        .trim()
        .nullable(),
    pinned: z.boolean('please provide a valid pinned'),
    wanderlistStatus: z.string('please provide a valid status')
        // .max(32, 'please provide a valid status (max 32 characters)')
        .trim(),
    targetDate: z.coerce.date('please provide a valid target_date')
        .nullable(),
    title: z.string('Please provide a valid title')
        .max(64,'please provide a valid title (max 32 characters)'),
    visibility: z.string('please provide a public or private or friends visibility')
        .max(32, 'please provide a public or private or friends visibility (max 32 characters)'),
})

/**
 * this type is used to represent a wanderlist object
 * @shape id: string the primary key for the profile
 * @shape profileId: foreign key  form the profile id
 * @shape description: string the description of the wanderlist
 * @shape pinned: string the pinned to keep the item as priority
 * @shape status: string | null the status of wanderlist item
 * @shape targetDate: date for the wanderlist item completion date
 * @shape title: string the title of the wanderlist
 * @shape visibility: string visibility of the profile
 */
export  type WanderList = z.infer<typeof WanderListSchema>

/*export const WanderListFormSchema = WanderListSchema

export type WanderListForm = z.infer<typeof WanderListFormSchema>*/

export  async function getWanderListByProfileId(profileId: string, authorization: string, cookie: string | null): Promise<WanderList[]> {


    const response = await fetch(`${process.env.REST_API_URL}/wanderlist/profile/${profileId}`,{
        method: 'GET',
        headers:   addHeaders(authorization,cookie),
    }) .then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch unread messages')
        }
        return res.json()
    })

   const result = WanderListSchema.array().parse(response.data)
    return result
}

/**
 * insert wanderlist
 * @param data
 * @param authorization
 * @param cookie
 */
export async function postWanderList(data: WanderList,authorization: string, cookie: string, profileId:string): Promise<Status> {
    const modifiedWanderList = {id: uuid(), profileId:profileId, ...data }

    const response = await fetch(`${process.env.REST_API_URL}${wanderlistBasepath}`, {
        method: 'POST',
        headers:  addHeaders(authorization,cookie),
        body: JSON.stringify(modifiedWanderList)
    })
    if( !response.ok) {
        throw new Error('Failed to insert wanderlist')
    }

    const result = await response.json()

    return result
}

/**
 * insert wanderlist
 * @param data
 * @param authorization
 * @param cookie
 */
export async function updateWanderList(data: WanderList,authorization: string, cookie: string, profileId:string): Promise<Status> {
    const modifiedWanderList = {profileId:profileId, ...data }
    console.log("modifiedWanderList", modifiedWanderList)
    const response = await fetch(`${process.env.REST_API_URL}${wanderlistBasepath}`, {
        method: 'PUT',
        headers:  addHeaders(authorization,cookie),
        body: JSON.stringify(modifiedWanderList)
    })
    console.log(response)
    if( !response.ok) {
        throw new Error('Failed to update wanderlist')
    }

    const result = await response.json()

    return result
}
/**
 * insert wanderlist
 * @param data
 * @param authorization
 * @param cookie
 */
export async function deleteWanderList(id: string,authorization: string, cookie: string): Promise<Status> {

    const response = await fetch(`${process.env.REST_API_URL}${wanderlistBasepath}/${id}`, {
        method: 'DELETE',
        headers:  addHeaders(authorization,cookie),

    })
    console.log(response)
    if( !response.ok) {
        throw new Error('Failed to delete wanderlist')
    }

    const result = await response.json()
    console.log("result",result)
    return result
}