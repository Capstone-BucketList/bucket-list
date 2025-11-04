import {zodErrorResponse} from "../../utils/response.utils.ts";
import {
    deleteFollow,
    type Follow,
    FollowSchema,
    insertFollow
} from "./follow.model.ts";
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


export async function postFollowController(request:Request, response:Response) : Promise<void> {
    try {
        const validationResult = FollowSchema.pick({
            followedProfileId:true
        }).safeParse(request.params)

        if(!validationResult.success){
            zodErrorResponse(response, validationResult.error)
            return
        }

        //grab the id off of the validated request parameters
        const { followedProfileId} = validationResult.data

        //grab the id from the session
        const profileFromSession = request.session?.profile
        const followerProfileId = profileFromSession?.id


        //constructing delete object to pass to delete method
        const follow: Follow = {
             followedProfileId, //334
             followerProfileId //399
        }


      const message =  await insertFollow(follow)

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

/**
 * delete controller to unfollow the user
 * @param request
 * @param response
 */
export async function deleteFollowController(request:Request, response:Response) : Promise<void> {
    try{
        const validationResult = FollowSchema.pick({
            followedProfileId:true
        }).safeParse(request.params)

        if(!validationResult.success){
            zodErrorResponse(response, validationResult.error)
            return
        }

        //grab the id off of the validated request parameters
        const { followedProfileId} = validationResult.data

        //grab the id from the session
        const profileFromSession = request.session?.profile
        const followerProfileId = profileFromSession?.id

        //constructing delete object to pass to delete method
         const follow: Follow = {
                    followedProfileId: followedProfileId,
                followerProfileId:followerProfileId
         }
        //calling delete
        const message =await deleteFollow(follow)

        const status: Status = {
            status:200,
            message:message,
            data:null
        }
        //sending success response
        response.status(200).json(status)

    }catch(error:any){
        const status: Status = {
            status:500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}
