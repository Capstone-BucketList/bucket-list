import {getProfileByPrimaryKey, PrivateProfileSchema} from "./profile.model.ts";
import {z} from "zod/v4";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type { Request, Response } from 'express';


/**
 * Express controller for profile
 * @endpoint POST /apis/profile/
 * @param request an object containing the body contain an email and password.
 * @param response an object modeling the response that will be sent to the client.
 * @returns response to the client indicating whether the sign in was successful or not
 * @throws {Error} an error indicating what went wrong
 */

export async function profileController(request: Request, response: Response) : Promise<void>  {
    try {
        // validate the new profile data coming from the request body
        const validationResult = PrivateProfileSchema
            .pick({
                id: true})
           .safeParse(request.params)

        // if validation is unsuccessful, return a pre-formatted response to the client
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        // deconstructing body object
        const {id} = validationResult.data

        // getting profile data
        const profile = await getProfileByPrimaryKey(id)

        response.json({status: 200, data: profile, message: null})
        // catch any errors that occurred during the id validation process and return a response to the client
    } catch (error) {
        response.json({status: 500, data:null, message: error})
    }
}