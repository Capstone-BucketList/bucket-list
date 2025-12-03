import type {Status} from "../../utils/interfaces/Status.ts";
import {
    WanderListSchema,
    type WanderList,
    insertWanderList,
    updateWanderList, deleteWanderList, selectWanderlistByProfileId, selectWanderlistByPrimaryKey,
    selectWanderlistByVisibility
} from "./wanderlist.model.ts";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type {Request, Response} from "express";
import { v7 as uuidv7 } from 'uuid';
import { selectPrivateProfileByProfileId } from "../profile/profile.model.ts";
import { sql } from "../../utils/database.utils.ts";

export async function postWanderListItemController(request:Request, response:Response): Promise<void> {
    try{
        const validationResult = WanderListSchema.safeParse(request.body);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id, profileId, wanderlistStatus, pinned, description,title,targetDate, visibility } = validationResult.data

        const wanderlist:WanderList = {
            id,
            profileId,
            wanderlistStatus,
            pinned,
            description,
            title,
            targetDate,
            visibility
        }
        const message = await insertWanderList(wanderlist);

        const status: Status = {
            status: 200,
            message: message,
            data: null
        }
        response.status(200).json(status)

    }catch(error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }

}

export async function putWanderListItemController(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = WanderListSchema.safeParse(request.body);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id, profileId, wanderlistStatus, pinned, description,title,targetDate, visibility } = validationResult.data

        const wanderlist:WanderList = {
            id,
            profileId,
            wanderlistStatus,
            pinned,
            description,
            title,
            targetDate,
            visibility
        }

        const message = await updateWanderList(wanderlist);

        const status: Status = {
            status: 200,
            message: message,
            data: null
        }
        response.status(200).json(status)

    }catch(error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}

/**
 * Delete Controller to delete the record in wanderlist table
 * @param request
 * @param response
 */
export async function deleteWanderListItemController(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = WanderListSchema.pick({
            id:true
        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id } = validationResult.data


        const message = await deleteWanderList(id);

        const status: Status = {
            status: 200,
            message: message,
            data: null
        }
        response.status(200).json(status)

    }catch(error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}

/**
 * get the wanderlist items by profileid
 * @param request
 * @param response
 */
export async function getWanderlistByProfileIdController(request:Request, response:Response): Promise<void> {
    try{
        const validationResult = WanderListSchema.pick({
            profileId: true,
        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {profileId} = validationResult.data

        const wanderlist:WanderList[] | null= await selectWanderlistByProfileId(profileId)

        // if the wanderlist does not exist, return a preformatted response to the client
        if (wanderlist === null) {
            response.json({status: 400, message: "wanderlist does not exist", data: null})
            return
        }

        const status: Status = {
            status: 200,
            message: null,
            data: wanderlist
        }
        response.status(200).json(status)

    }catch (error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}

/**
 * get the wanderlist items by profileid
 * @param request
 * @param response
 */
export async function getWanderlistByProfileIdAndVisibilityController(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = WanderListSchema.pick({
            profileId: true,
            visibility: true,
        }).safeParse(request.body);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {profileId,visibility} = validationResult.data

        // getting all wanderlist items by profileId
        const wanderlist:WanderList[] | null= await selectWanderlistByProfileId(profileId)

        // if the wanderlist does not exist, return a preformatted response to the client
        if (wanderlist === null) {
            response.json({status: 400, message: "wanderlist does not exist", data: null})
            return
        }

        // filter by visibility
        const visibilityData = wanderlist?.filter(list => list.visibility === visibility)

        const status: Status = {
            status: 200,
            message: null,
            data: visibilityData
        }
        response.status(200).json(status)

    }catch (error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}

/**
 * get the wanderlist item by primary key
 * @param request
 * @param response
 */
export async function getWanderlistByWanderListIdController(request:Request, response:Response): Promise<void> {
    try{
        const validationResult = WanderListSchema.pick({
            id: true
        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id} = validationResult.data

        // get the wanderlist details by primary key
        const wanderlist:WanderList | null= await selectWanderlistByPrimaryKey(id)

        // if the wanderlist does not exist, return a preformatted response to the client
        if (wanderlist === null) {
            response.json({status: 400, message: "wanderlist does not exist", data: null})
            return
        }

        const status: Status = {
            status: 200,
            message: null,
            data: wanderlist
        }
        response.status(200).json(status)

    }catch (error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}


/**
 * get the wanderlist items by profileid
 * @param request
 * @param response
 */
export async function getWanderlistByVisibilityController(request:Request, response:Response): Promise<void> {
    try{
        const validationResult = WanderListSchema.pick({
            visibility: true
        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {visibility} = validationResult.data

        // getting the wanderlist items by visibility
        const wanderlist:WanderList[] | null= await selectWanderlistByVisibility(visibility)
        // if the wanderlist does not exist, return a preformatted response to the client
        if (wanderlist === null) {
            response.json({status: 400, message: "wanderlist does not exist", data: null})
            return
        }

        const status: Status = {
            status: 200,
            message: null,
            data: wanderlist
        }
        response.status(200).json(status)

    }catch (error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}

/**
 * Get or create the "My Scrapbook" wanderlist for a user
 * Used for storing user's photo albums
 * @param request
 * @param response
 */
export async function getOrCreateScrapbookWanderlistController(request:Request, response:Response): Promise<void> {
    try{
        const validationResult = WanderListSchema.pick({
            profileId: true,
        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {profileId} = validationResult.data

        // Get all wanderlists for the user
        const wanderlists:WanderList[] | null= await selectWanderlistByProfileId(profileId)

        // Check if scrapbook wanderlist already exists
        let scrapbookWanderlist = wanderlists?.find(w => w.title === "My Scrapbook")

        if (!scrapbookWanderlist) {
            // Create a new scrapbook wanderlist
            const newScrapbook: WanderList = {
                id: uuidv7(),
                profileId,
                title: "My Scrapbook",
                description: "Photo albums and memories",
                wanderlistStatus: "active",
                pinned: false,
                targetDate: null,
                visibility: "public"
            }

            await insertWanderList(newScrapbook)
            scrapbookWanderlist = newScrapbook
        }

        const status: Status = {
            status: 200,
            message: "Scrapbook wanderlist retrieved or created",
            data: scrapbookWanderlist
        }
        response.status(200).json(status)

    }catch (error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}

export async function getOrCreateSharedStoriesWanderlistController(request:Request, response:Response): Promise<void> {
    try{
        // Shared Stories is a global wanderlist, not tied to a specific user profile
        // We'll use a fixed ID for it
        const SHARED_STORIES_WANDERLIST_ID = "019abba2-6835-709a-bf6a-777a4b24da68";

        console.log("Checking for shared stories wanderlist with ID:", SHARED_STORIES_WANDERLIST_ID);

        // Check if the shared stories wanderlist exists
        let sharedStoriesWanderlist = await selectWanderlistByPrimaryKey(SHARED_STORIES_WANDERLIST_ID);

        console.log("Existing wanderlist result:", sharedStoriesWanderlist);

        if (!sharedStoriesWanderlist) {
            console.log("Shared stories wanderlist doesn't exist, creating it...");

            // Get any valid profile to own this wanderlist (we'll query for the first profile)
            const firstProfileResult = await sql`SELECT id FROM profile LIMIT 1`;
            const firstProfile = firstProfileResult[0];

            if (!firstProfile) {
                throw new Error("No profiles exist in the system. Cannot create shared stories wanderlist.");
            }

            const profileId = firstProfile.id;
            console.log("Using profile ID:", profileId);

            // Insert directly into the database
            await sql`
                INSERT INTO wanderlist (id, profile_id, date_created, description, pinned, wanderlist_status, target_date, title, visibility)
                VALUES(${SHARED_STORIES_WANDERLIST_ID}, ${profileId}, now(), 'Community shared travel experiences and stories', false, 'active', null, 'Shared Stories', 'public')
            `;

            console.log("Successfully created shared stories wanderlist");
            sharedStoriesWanderlist = {
                id: SHARED_STORIES_WANDERLIST_ID,
                profileId: profileId,
                title: "Shared Stories",
                description: "Community shared travel experiences and stories",
                wanderlistStatus: "active",
                pinned: false,
                targetDate: null,
                visibility: "public"
            };
        } else {
            console.log("Shared stories wanderlist already exists");
        }

        const status: Status = {
            status: 200,
            message: "Shared Stories wanderlist retrieved or created",
            data: sharedStoriesWanderlist
        }
        response.status(200).json(status)

    }catch (error: any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}
