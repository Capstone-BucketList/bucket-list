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