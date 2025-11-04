import {
    type PrivateProfile,
    PrivateProfileSchema,
    selectPrivateProfileByProfileEmail
} from "../profile/profile.model.ts";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type { Request, Response } from 'express'
import {generateJwt, validatePassword} from "../../utils/auth.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import { v4 as uuid } from 'uuid'
import {z} from "zod/v4";

/**
 * Express controller for sign-in
 * @endpoint POST /apis/sign-in/
 * @param request an object containing the body contain an email and password.
 * @param response an object modeling the response that will be sent to the client.
 * @returns response to the client indicating whether the sign in was successful or not
 * @throws {Error} an error indicating what went wrong
 */
export async function signInController(request: Request, response: Response) : Promise<void> {
    try {

        // validate the new profile data coming from the request body
        const validationResult = PrivateProfileSchema
            .pick({email: true})
            .extend({
                password: z.string('password is required')
                    .min(8, 'profile password cannot be less than 8 characters')
                    .max(32, 'profile password cannot be over 32 characters')
            }).safeParse(request.body)

        //if the validation is unsuccessful, return a preformatted response to the client
        if(!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        //deconstruct the email and password from the request body
        const {email, password} = validationResult.data

        //select the profile by the email from the database
        const profile: PrivateProfile | null = await selectPrivateProfileByProfileEmail(email)

        //create a preformatted response to send to the client if sign in fails
        const signInFailedStatus: Status = { status: 400, message: 'Email or password is incorrect please try again.', data: null }

        if(profile === null) {
            response.json(signInFailedStatus)
            return
        }
        //check if the password matches the hash
        const isPasswordValid = await validatePassword( profile.passwordHash, password,)

        //check for failed sign in
        //if sign in failed, return a response to the client
        if (!isPasswordValid) {
            response.json(signInFailedStatus)
            return
        }

        //if sign in was successful, create a new session for the client and return a response to the client
        //deconstruct the id, bio, profilePicture and userName from the profile
        const {id, bio,profilePicture, userName} = profile

        //generate a new signature for the session
        const signature: string = uuid()

        //generate a new jwt for the session using the id,bio,profilePicture,userName and signature
        const authorization: string = generateJwt({
            id,
            bio,
            profilePicture,
            userName,
        }, signature)

        //set the session variables
        request.session.profile = profile
        request.session.jwt = authorization
        request.session.signature = signature

        //set the authorization header
        response.header({
            authorization
        })

        //return a response to the client
        response.json({status: 200, message: 'Sign in successful', data: null})
        return

        //catch any errors that occurred during the sign-in process and return a response to the client
    } catch (error: any) {
        response.json({ status: 500, data: null, message: error.message})
    }
}

// making change to allow push