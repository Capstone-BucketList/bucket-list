import { SignUpProfileSchema } from './sign-up.schema.ts'
import { zodErrorResponse } from '../../utils/response.utils'
import type {Request} from "express"
import type {Response} from "express"
import {type Status} from "../../utils/interfaces/Status.ts";
import Mailgun from 'mailgun.js'
import {setHash} from "../../utils/auth.utils.ts";
import {setActivationToken} from "../../utils/auth.utils.ts";
import {insertProfile, type PrivateProfile} from "../profile/profile.model.ts";


/**
 * Express controller for sign-up
 * @endpoint POST /apis/sign-up/
 * @param request an object containing the body contain a name, email, password and passwordConfirm.
 * @param response an object modeling the response that will be sent to the client.
 * @returns response to the client indicating whether the sign up was successful or not
 * */
export async function signUpProfileController (request:Request, response: Response) {
    try {
        //validate the new user's data coming from the request body
        const validationResult = SignUpProfileSchema.safeParse(request.body)

        //if validation fails, return an error response
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        //deconstruct the name, email and password from the request body
        const {userName, email, password, id} = validationResult.data

        //hash the password
        const passwordHash = await setHash(password)

        //set a placeholder for profilePicture
        const profilePicture = 'https://res.cloudinary.com/cnm-ingenuity-deep-dive-bootcamp/image/upload/v1726159504/t32ematygvtcyz4ws9p5.png'

        //create a new activationToken
        const activationToken = setActivationToken()

        //create a new profile object
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

        //insert the new profile into the database
        await insertProfile(profile)

        // create a basePath variable containing the scheme, host, port, and base path
        const basePath: string = `${request.protocol}://${request.hostname}:8080${request.originalUrl}/activation/${activationToken}`

        // create a new mailgun client with the mailgun api key
        const mailgun: Mailgun = new Mailgun(FormData)
        const mailgunClient = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY as string })

        //create a message for the activation email body
        const message = `
                <h2>Welcome to Wanderlist.</h2>
                <p>In order to start creating your own Wanderlist you must confirm your account </p>
                <a href="${basePath}">${basePath}</a>`

        //create a mailgun message object
        const mailgunMessage = {
            from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN as string}>`,
            to: email,
            subject: 'One step closer to Wanderlist -- Account Activation',
            html: message
        }

        //send the email
        await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN as string, mailgunMessage)

        //create a status object to send back to the client
        const status: Status = {
            status: 200,
            message: 'Profile successfully created please check your email.',
            data: null
        }
        // send the status to the client
        response.status(200).json(status)

        // catch any errors that occurred during the signup process
    }catch(error: any) {
        const status: Status = {
            status: 500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }
}