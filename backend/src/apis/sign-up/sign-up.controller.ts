import { SignUpProfileSchema } from './sign-up.schema.ts'
import { zodErrorResponse } from '../../utils/response.utils'
import type {Request} from "express"
import type {Response} from "express"
import {type Status} from "../../utils/interfaces/Status.ts";

import Mailgun from 'mailgun.js'
import {setHash} from "../../utils/auth.utils.ts";
import {setActivationToken} from "../../utils/auth.utils.ts";
import {insertProfile, type PrivateProfile} from "../profile/profile.model.ts";


export async function signUpProfileController (request:Request, response: Response) {
    try {
        //validate the new user's data coming from the request body
        const validationResult = SignUpProfileSchema.safeParse(request.body)
        //if validation fails, return an error response
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        console.log(process.env)
        //if validation succeeds, create a new user
        const {userName, email, password, id} = validationResult.data
        const passwordHash = await setHash(password)
        const profilePicture = 'https://res.cloudinary.com/cnm-ingenuity-deep-dive-bootcamp/image/upload/v1726159504/t32ematygvtcyz4ws9p5.png'
        const activationToken = setActivationToken()
        const profile: PrivateProfile = {
            id,
            bio: null,
            activationToken,
            dateCreated: null,
            email,
            passwordHash,
            userName,
            profilePicture,
            visibility: 'public',
        }
        await insertProfile(profile)

        //prepare and send activation email to new user, by create new mailgun client with mailgun api key
        const basePath: string = `${request.protocol}://${request.hostname}:8080${request.originalUrl}activation/${activationToken}`

        // create a new mailgun client with the mailgun api key
        const mailgun: Mailgun = new Mailgun(FormData)
        const mailgunClient = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY as string })

        const message = `
                <h2>Welcome to Wander List.</h2>
                <p>In order to start creating your own Wander List you must confirm your account </p>
                <a href="${basePath}">${basePath}</a>`

        const mailgunMessage = {
            from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN as string}>`,
            to: email,
            subject: 'One step closer to Sticky Head -- Account Activation',
            html: message
        }
        await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN as string, mailgunMessage)

        const status: Status = {
            status: 200,
            message: 'Profile successfully created please check your email.',
            data: null
        }
        response.status(200).json(status)

    }catch(error: any) {
        const status: Status = {
            status: 500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}