import {
    CommentSchema,
    type Comment,
    insertComment,
    deleteComment,
    getCommentByPrimaryKey,
    getCommentByPostId
} from "./comment.model.ts";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import type {Request, Response} from "express";

/**
 * post controller to insert new comment record into comment table
 * @endpoint POST /apis/comment
 * @param request and object containing the body with comment data
 * @param response an object modeling the response that will be sent to the client
 * @returns response to the client indicating whether the thread creation was successful or not
 */

export async function postCommentController(request: Request, response: Response): Promise<void> {
    try {

        // validate the comment object from the request body
        const validationResult = CommentSchema.safeParse(request.body)

        // if the validation is unsuccessful, return a preformatted response to the client
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        } // end if statement

        const {id, postId, profileId, comment} = validationResult.data

        const commentObject: Comment = {
            id,
            postId,
            profileId,
            comment
        }

        const message = await insertComment(commentObject)

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
        response.status(500).json(status)
    }
}


/**
 * Express controller for getting comment by its primary key
 * @endpoint Get /apis/comment/: id
 * @param request an object containing the comment ID in params
 * @param response an object modeling the response that will be sent to the client
 * @returns response with the comment data or null if not found
 */
export async function getCommentByPrimaryKeyController (request: Request, response: Response): Promise<void> {
    try {

        // validate the comment ID from params
        const validationResult = CommentSchema.pick({ id: true}).safeParse( request.params)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const { id } = validationResult.data

        // get the comment
        const data: Comment | null = await getCommentByPrimaryKey(id)


        // if the profile does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "comment does not exist", data: null})
            return
        }
        const status: Status = {
            status: 200,
            message: null,
            data: data
        }

        response.status(200).json(status)

    } catch (error: any) {
        const status: Status = {
            status: 500,
            message: error.message,
            data: null
        }
        response.status(500).json(status)
    }
}

/**
 * delete controller to remove comment from comment table
 * @param request an object containing the comment id in params
 * @param response an object modeling the response that will be sent to the client
 * @returns response delete message
 */

export async function deleteCommentController(request: Request, response: Response): Promise<void> {
    try {
        const validationResult = CommentSchema
            .pick({ id: true})
            .safeParse(request.params)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { id } = validationResult.data

        const message = await deleteComment(id)

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
        response.status(500).json(status)
    }
}

/**
 * controller to get comments by post id they are associated with from post table
 * @param request an object containing the comment id in params
 * @param response an object modeling the response that will be sent to the client
 * @returns response all comments on a post message
 */

export async function getCommentByPostIdController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = CommentSchema
            .pick({ postId: true})
            .safeParse(request.params)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const { postId } = validationResult.data

        const data: Comment[] | null = await getCommentByPostId(postId)


        // if the comments does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "comments does not exist", data: null})
            return
        }

        const status: Status = {
            status: 200,
            message: null,
            data: data
        }
        response.status(200).json(status)

    } catch (error:any) {
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(500).json(status)
    }
}