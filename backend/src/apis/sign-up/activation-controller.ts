import {z} from "zod/v4";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import {selectPrivateProfileByProfileActivationToken, updateProfile} from "../profile/profile.model.ts";
import type { Request, Response} from 'express';

/**
 * Handles the logic for account activation by checking for an existing activationToken and updating the activationToken to null
 * @param request {Request} the request object containing the activationToken
 * @param response {Response} the response object containing the status and message
 */
export async function activationController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult= z
        .object({
            activation: z
                .string('activation is required')
                .length(32, 'please provide a valid activation token')
        }).safeParse(request.params)


        // if the validation is unsuccessful, return a preformatted response to the client
        if(!validationResult.success){
            zodErrorResponse(response, validationResult.error)
            return
        }
        //deconstruct the activationToken from the request body
        const {activation} = validationResult.data

        //select the profile by activationTokent
        const profile = await selectPrivateProfileByProfileActivationToken(activation)

        //if the profile is null, return a preformatted response to the client
        if (profile === null) {
            response.json({
                status:400,
                data:null,
                message: 'Account activation has failed. Have you already activated this account?'
            })
            return
        }

        //if the profile is not null, update the activationToken to null and send a success prompt
        profile.activationToken = ""
        await updateProfile(profile)
        response.json({
            status:200,
            data:null,
            message: 'Account activation was successful.'
        })
    } catch (error) {
        console.error(error)
        response.json({status: 500, data: null, message: 'internal server error try again later'})
    }
}