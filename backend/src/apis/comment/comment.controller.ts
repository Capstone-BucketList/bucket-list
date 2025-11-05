import express, {response} from "express";
import {z} from 'zod/v4'
import {type Comment, CommentSchema, insertComment, postComment} from "./comment.model.ts";
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import type {Request, Response} from "express";

/**
 * express controller for creating a new comment
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

        // get the profile from the session
        const profile = request.session?.profile
        if (!profile) {
            response.json({ status: 401, message: 'Please login to leave a comment', data: null})
            return
        }

        // validate that the profileId in the request matches the session profileId
        if (validationResult.data.profileId !== profile.id) {
            response.json({ status: 403, message: 'Profile ID in request does not match authenticated user', data: null})
        }

        // insert the comment into the database
        const comment = await insertComment(validationResult.data)

        // return success response
        const status: Status = {
            status: 200, message, data: null
        }
        response.json(status)

    } catch (error: any) {
        console.error(error)
        serverErrorResponse(response, error.message)
    }
}