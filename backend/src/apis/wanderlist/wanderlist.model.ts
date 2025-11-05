import { z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";


/**
 * Schema for validating the wanderlist object
 * @shape id: string the primary key for the profile
 * @shape profileId: foreign key  form the profile id
 * @shape dateCreated: date | null the wanderlist item created date
 * @shape description: string the description of the wanderlist
 * @shape pinned: string the pinned to keep the item as priority
 * @shape status: string | null the status of wanderlist item
 * @shape targetDate: date for the wanderlist item completion date
 * @shape title: string the title of the wanderlist
 * @shape visibility: string visibility of the profile
 */
export const WanderListSchema =  z.object({

    id: z.uuidv7('Please provide a valid uuid for id'),
    profileId: z.uuidv7('Please provide a valid uuid for profile id'),
    dateCreated: z.date('please provide a valid created date')
        .nullable(),
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
}).omit({dateCreated:true})

/**
 * this type is used to represent a wanderlist object
 * @shape id: string the primary key for the profile
 * @shape profileId: foreign key  form the profile id
 * @shape dateCreated: date | null the wanderlist item created date
 * @shape description: string the description of the wanderlist
 * @shape pinned: string the pinned to keep the item as priority
 * @shape status: string | null the status of wanderlist item
 * @shape targetDate: date for the wanderlist item completion date
 * @shape title: string the title of the wanderlist
 * @shape visibility: string visibility of the profile
 */
export  type WanderList = z.infer<typeof WanderListSchema>

/**
 * insert record into wanderlist
 * @param wanderlist object to insert
 * @returns string successfully inserted message
 */
export async function insertWanderList(wanderlist:WanderList):Promise<string> {
    WanderListSchema.parse(wanderlist);

    const {id, profileId, wanderlistStatus, pinned, description,title,targetDate,visibility } = wanderlist

    await sql `INSERT INTO wanderlist (id, profile_id,date_created,description,pinned,wanderlist_status,target_date,title, visibility) VALUES(${id},${profileId}, now(), ${description}, ${pinned},${wanderlistStatus}, date(${targetDate} ),${title}, ${visibility})`

    return "Successfully inserted wanderlist"
}

/**
 * update record into wanderlist
 * @param wanderlist object to insert
 * @returns string successfully inserted message
 */
export async function updateWanderList(wanderlist:WanderList):Promise<string> {
    WanderListSchema.parse(wanderlist);

    const {id, wanderlistStatus, pinned, description,title,targetDate,visibility } = wanderlist

    await sql `UPDATE wanderlist SET  description= ${description}, pinned=${pinned}, wanderlist_status= ${wanderlistStatus}, target_date=${targetDate}, title= ${title}, visibility=${visibility} where id = ${id}`

    return "Successfully updated wanderlist"
}

/**
 * deleting wander list item by id
 * @param id primary key
 * @returns success message
 */
export async function deleteWanderList(id:string):Promise<string> {

    await sql `DELETE FROM wanderlist WHERE id = ${id}`

    return "Successfully deleted wanderlist"
}

/**
 * getting wanderlist items by profile id
 * @param profileId
 * @return wanderlist objects associated with profile id
 */
export async  function  selectWanderlistByProfileId(profileId:string):Promise<WanderList[] | null > {

    const rowList = await sql `SELECT id, profile_id,date_created,description,pinned,wanderlist_status,target_date,title, visibility FROM wanderlist WHERE profile_id =${profileId}`


    const result = WanderListSchema.array().parse(rowList)

    return result ?? null
}


/**
 * getting wanderlist items by profile id
 * @param id
 * @return wanderlist object associated with primary key id
 */
export async  function  selectWanderlistByPrimaryKey(id:string):Promise<WanderList | null > {

    const rowList = await sql `SELECT id, profile_id,date_created,description,pinned,wanderlist_status,target_date,title, visibility FROM wanderlist WHERE id =${id}`

    const result = WanderListSchema.array().max(1).parse(rowList)

    return result[0] ?? null
}

/**
 * get the wanderlist based on visibility
 * @param visibility
 * @return wanderlist items
 */
export async function selectWanderlistByVisibility(visibility:string):Promise<WanderList[] | null > {

    const rowList = await sql `SELECT id, profile_id,date_created,description,pinned,wanderlist_status,target_date,title, visibility FROM wanderlist WHERE visibility =${visibility}`


    const result = WanderListSchema.array().parse(rowList)

    return result ?? null
}