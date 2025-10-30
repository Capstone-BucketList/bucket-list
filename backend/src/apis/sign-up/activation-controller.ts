import {z} from "zod/v4";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import {selectPrivateProfileByProfileActivationToken, updateProfile} from "../profile/profile.model.ts";
import type { Request, Response} from 'express';

export async function activationController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult= z
        .object({
            activation: z
                .string('activation is required')
                .length(32, 'please provide a valid activation token')
        }).safeParse(request.params)

        if(!validationResult.success){
            zodErrorResponse(response, validationResult.error)
            return
        }
        const {activation} = validationResult.data

        const profile = await selectPrivateProfileByProfileActivationToken(activation)

        if (profile === null) {
            response.json({
                status:400,
                data:null,
                message: 'Account activation has failed. Have you already activated this account?'
            })
            return
        }

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