import {
    deleteMedia,
    insertMedia,
    type Media,
    MediaSchema, selectAllMediaForVisiblePosts,
    selectMediaByPostId,
    selectMediaByPrimaryKey
} from "./media.model.ts";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import type {Request, Response} from "express";

/**
 * post controller to insert records into media table
 * @param request
 * @param response
 */
export async function postMediaController(request:Request, response:Response):Promise<void>  {

    try{
        const validationResult = MediaSchema.safeParse(request.body);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id, postId, url } = validationResult.data

        const media:Media = {
            id,
            postId,
            url
        }
        const message = await insertMedia(media);

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
 * delete controller to insert records into media table
 * @param request
 * @param response
 */
export async function deleteMediaController(request:Request, response:Response):Promise<void>  {

    try{
        const validationResult = MediaSchema.pick({id:true}).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id} = validationResult.data

        const message = await deleteMedia(id)

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
 * select controller to pull media record by primaryKey
 * @param request
 * @param response
 */
export async function getMediaByPrimaryKeyController(request:Request, response:Response):Promise<void>  {
    try{
        const validationResult = MediaSchema.pick({id:true}).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id} = validationResult.data

        const data:Media | null = await selectMediaByPrimaryKey(id)

        // if the media does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "media does not exist", data: null})
            return
        }

        const status: Status = {
            status: 200,
            message: null,
            data: data
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
 * select controller to pull media record by post id
 * @param request
 * @param response
 */
export async function getMediaByPostIdController(request:Request, response:Response):Promise<void>  {
    try{
        const validationResult = MediaSchema.pick({postId:true}).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {postId} = validationResult.data

        const data:Media[] |null = await selectMediaByPostId(postId)

        // if the media does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "media does not exist", data: null})
            return
        }

        const status: Status = {
            status: 200,
            message: null,
            data: data
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
 * select controller to pull all public posts and media
 * @param request
 * @param response
 */
export async function getAllMediaForVisiblePosts(request:Request, response:Response):Promise<void>  {
    try{

        const data:Media[] | null = await selectAllMediaForVisiblePosts()

        // if the media does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "media does not exist", data: null})
            return
        }

        const status: Status = {
            status: 200,
            message: null,
            data: data
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