import type {Request, Response} from "express";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import {
    deletePost,
    insertPost,
    type Post,
    PostSchema, type PostWithProfileFollow, selectAllVisiblePosts,
    selectPostbyPrimaryKey,
    selectPostbyWanderlistIdAndVisibility, selectPostsByProfileId,
    selectPostsByWanderList, selectVisiblePostsByLoggedInProfileFollow, updatePost
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

        const {id, wanderlistId, content, title, visibility} = validationResult.data

        //constructing delete object to pass to delete method
        const post: Post = {
            id,
            wanderlistId,
            content,
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

        // if the post does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "post does not exist", data: null})
            return
        }

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

        // if the post does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "post does not exist", data: null})
            return
        }
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
 * controller used to update the post record by primary key
 * @param request
 * @param response
 */
export async function putPostController(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = PostSchema.safeParse(request.body);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id,wanderlistId,title,content,visibility} = validationResult.data

        const post:Post = {
            id: id,
            wanderlistId: wanderlistId,
            title: title,
            content: content,
            visibility: visibility
        }

        const message = await updatePost(post)

        const status: Status = {
            status: 200,
            message: message,
            data: null
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
 * get the post items by logged in user id
 * @param request
 * @param response
 */
export async function getVisiblePostsByLoggedInProfileFollow(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = PostSchema.pick({
            id: true,

        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id} = validationResult.data

        const data:PostWithProfileFollow[] | null = await selectVisiblePostsByLoggedInProfileFollow(id)

        // if the post does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "post does not exist", data: null})
            return
        }
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
 * get all visible posts
 * @param request
 * @param response
 */
export async function getAllVisiblePosts(request:Request, response:Response): Promise<void> {
    try{
        const data:Post[] | null = await selectAllVisiblePosts()

        // if the post does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "post does not exist", data: null})
            return
        }
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
 * get the post items by logged in user id
 * @param request
 * @param response
 */
export async function getPostsByProfileId(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = PostSchema.pick({
            id: true,

        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id} = validationResult.data

        const data:Post[] | null = await selectPostsByProfileId(id)

        // if the post does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "post does not exist", data: null})
            return
        }
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

export async function getPostByWanderlistId(request:Request, response:Response): Promise<void> {
    try{

        const validationResult = PostSchema.pick({
            id: true,

        }).safeParse(request.params);

        if(!validationResult.success) {
            zodErrorResponse(response,validationResult.error)
            return
        }
        const {id} = validationResult.data

        const data:Post[] | null = await selectPostsByWanderList(id)

        // if the post does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "post does not exist", data: null})
            return
        }
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