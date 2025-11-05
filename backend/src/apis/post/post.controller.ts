import type {Request, Response} from "express";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import {insertPost, type Post, PostSchema} from "./post.model.ts";

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
        console.log("bypostPostController")
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