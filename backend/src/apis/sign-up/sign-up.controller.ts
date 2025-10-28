import {SignUpProfileSchema} from "./sign-up.schema.ts"
import{zodErrorResponse} from "../../utils/response.utils.ts";
import type {Request} from "express"
import type {Response} from "express"
import formData from 'form-data'
import Mailgun from 'mailgun.js'
import {setHash} from "../../utils/auth.utils.ts";
import {setActivationToken} from "../../utils/auth.utils.ts";


export async function signUpProfileController (request:Request, response: Response) {
    try {
    const validationResult = SignUpProfileSchema.safeParse(request.body)
        if (!validationResult.success) {
            zodErrorRepsonse(response, validationResult.error)
            return
        }

        const mailgun: Mailgun = new Mailgun(formData)
        const mailgunClient: mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY as string })

        const {name, email, password, id} = validationResult.data

        const hash = await setHash(password)

        const activationToken = setActivationToken()

        const imageURL = 'https://res.cloudinary.com/cnm-ingenuity-deep-dive-bootcamp/image/upload/v1726159504/t32ematygvtcyz4ws9p5.png'

        const basePath: string = `${request.protocol}://${request.hostname}:8080${request.originalUrl}activation/${activationToken}`

        const message = `<h2>Welcome to Wander List.</h2>
        <p>In order to start creating your own Wander List you must confirm your account </p>
                <a href="${basePath}">${basePath}</a>`
    }
}