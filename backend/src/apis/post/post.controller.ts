import type {Request, Response} from "express";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import {
    deletePost,
    insertPost,
    type Post,
    PostSchema,
    selectPostbyPrimaryKey,
    selectPostbyWanderlistIdAndVisibility
} from "./post.model.ts";


/**
 * Express controller for post
 * @endpoint POST apis/post/
 * @param request an object containing the body a user and their id
 * @param response an object modeling the response that will be sent to the client
 * @returns response to the client indicating whether the sign in was successful or not
 * @throws {error} an error indicating what went wrong
 */

export async function postPostController(request:Request, response:Response) : Promise<void> {
    try {

        const validationResult = PostSchema
            .safeParse(request.body)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const {id, wanderlistId, content, datetimeCreated, datetimeModified, title, visibility} = validationResult.data

        //constructing delete object to pass to delete method
        const post: Post = {
            id,
            wanderlistId,
            content,
            datetimeCreated,
            datetimeModified,
            title,
            visibility
        }

        const message = await insertPost(post)

        const status: Status = {
            status: 200,
            message: message,
            data: null
        }
        response.status(200).json(status)

    } catch (error: any) {
        const status: Status = {
            status: 500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}

export async function deletePostController(request: Request, response: Response) : Promise<void> {
    try {
        const validationResult = PostSchema.pick({id: true}).safeParse(request.params)

        if(!validationResult.success){
            zodErrorResponse(response, validationResult.error)
            return
        }

        const {id} = validationResult.data
    console.log("id: ", id)
        const message = await deletePost(id)

        const status: Status = {
            status: 200,
            message: message,
            data: null
        }
        response.status(200).json(status)

    } catch(error: any) {
        const status: Status = {
            status: 500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}

/**
 * get the post items by wanderlist id
 * @param request
 * @param response
 */
export async function getPostByWanderlistIdAndVisibilityController(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = PostSchema.pick({
            wanderlistId: true,
            visibility: true,
        }).safeParse(request.body);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {wanderlistId,visibility} = validationResult.data

        const data = await selectPostbyWanderlistIdAndVisibility(visibility, wanderlistId)

        const status: Status = {
            status: 200,
            message: null,
            data: data
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
 * get the post items by wanderlist id
 * @param request
 * @param response
 */
export async function getPostByPrimaryKeyController(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = PostSchema.pick({
            id: true,

        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id} = validationResult.data

        const data = await selectPostbyPrimaryKey(id)

        const status: Status = {
            status: 200,
            message: null,
            data: data
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

// /**
// * get the post items by profile id
// * @param request
// * @param response
// */
// export async function getPostByProfileIdAndVisibilityController(request:Request, response:Response): Promise<void> {
//     // try{
    //
    //     const validationResult = PostSchema.pick({
    //         profileId: true,
    //         visibility: true,
    //     }).safeParse(request.body);
    //
    //     if(!validationResult.success) {
    //         zodErrorResponse(response,validationResult.error)
    //         return
    //     }
    //     const {profileId,visibility} = validationResult.data
    //
    //     // const data = await selectPostByProfileIdAndVisibility(visibility, profileId)
    //
    //     const status: Status = {
    //         status: 200,
    //         message: null,
    //         data: data
    //     }
    //     response.status(200).json(status)
//
//     }catch (error: any){
//         const status: Status = {
//             status:500,
//             message: error.message,
//             data: null
//         }
//         response.status(200).json(status)
//     }
// }