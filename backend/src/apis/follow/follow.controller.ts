import {zodErrorResponse} from "../../utils/response.utils.ts";
import {type Follow, followSchema, insertFollow} from "./follow.model.ts";
import type {Request} from "express"
import type {Response} from "express"
import type {Status} from "../../utils/interfaces/Status.ts";

/**
 * Express controller for follow
 * @endpoint POST apis/follow/
 * @param request an object containing the body a user and their id
 * @param response an object modeling the response that will be sent to the client
 * @returns response to the client indicating whether the sign in was successful or not
 * @throws {error} an error indicating what went wrong
 */


export async function followController(request:Request, response:Response) : Promise<void> {
    try {
        // validate the follow data from the request body
        const validationResult = followSchema.safeParse(request.body)
        // if validation fails, return an error response
            if (!validationResult.success){
             zodErrorResponse(response, validationResult.error)
             return
            }

            // if validation succeeds, create a new follow
            const {followedProfileId, followerProfileId} = validationResult.data
            const follow: Follow = {
                followedProfileId,
                followerProfileId
            }

            await insertFollow(follow)

        const status: Status = {
                status: 200,
                message: 'Follow success',
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