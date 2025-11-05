import {
    deleteProfileById,
    getPublicProfileByPrimaryKey,
    type PrivateProfile,
    PrivateProfileSchema, type PublicProfile, PublicProfileSchema, selectPrivateProfileByProfileId,
    selectPublicFollowersByProfileId,
    updateProfile
} from "./profile.model.ts";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type { Request, Response } from 'express';
import {generateJwt} from "../../utils/auth.utils.ts";
import pkg from 'jsonwebtoken'

const {verify} = pkg

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
        const profile = await getPublicProfileByPrimaryKey(id)

        response.json({status: 200, data: profile, message: null})
        // catch any errors that occurred during the id validation process and return a response to the client
    } catch (error) {
        response.json({status: 500, data:null, message: error})
    }
}

export async function deleteProfileController(request:Request, response: Response) : Promise<void>  {
    try {
        // validate the profile data coming from the request body
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
        const message = await deleteProfileById(id)

        response.json({status: 200, data: null, message: message})
        // catch any errors that occurred during the id validation process and return a response to the client
    } catch (error) {
        response.json({status: 500, data:null, message: error})
    }

}

export async function putProfileController(request:Request, response: Response) : Promise<void>  { try {

    // validate the profile data coming from the request body
    const validationResult = PublicProfileSchema
        .safeParse(request.body)

    // if validation is unsuccessful, return a pre-formatted response to the client
    if (!validationResult.success) {

        zodErrorResponse(response, validationResult.error)
        return
    }

    //validate the id coming from the request parameters
    const validationResultForRequestParams = PublicProfileSchema.pick({id: true}).safeParse(request.params)

    //if the validation of the params is unsuccessful, return a preformatted response to the client
    if(!validationResultForRequestParams.success) {
        zodErrorResponse(response, validationResultForRequestParams.error)
        return
    }

    //grab the id from the session
    const profileFromSession = request.session?.profile
    const idFromSession = profileFromSession?.id

    //grab the id off of the validated request parameters
    const {id} = validationResultForRequestParams.data

    if(idFromSession !== id) {
        response.json({status: 400, message: "you cannot update a profile that is not yours", data: null})
        return
    }

    //grab the profile data off of the validated request body
    const {bio, userName, visibility} = validationResult.data

    //grab the profile by id
    const profile: PrivateProfile|null = await selectPrivateProfileByProfileId(id)

    //if the profile does not exist, return a preformatted response to the client
    if(profile == null) {
        response.json({status: 400, message: "profile does not exist", data: null})
        return
    }
    //update the profile in the database
    profile.bio = bio
    // profile.profilePicture = profilePicture
    profile.userName = userName
    profile.visibility = visibility


    //update the profile in the database
    await updateProfile(profile)

    //reissue the jwt token with the updated profile
    const jwt = request.session.jwt ?? ' '

    //grab the signature off of the session
    const signature = request.session.signature ?? ' '

    //if the jwt token or signature are undefined return a preformatted response to the client
    const parsedJwt = verify(jwt, signature)

    if(typeof parsedJwt === 'string') {
        response.json({status: 400, message: "invalid jwt token", data: null})
        return
    }

    //generate a new jwt token with the updated profile
    const newJwt = generateJwt(parsedJwt.auth, signature)

    //refresh the session profile with the updated profile
    request.session.profile = {
        id: profile.id,
        bio: profile.bio,
        profilePicture: profile.profilePicture,
        username: profile.userName
    }

    //set the new jwt token in the session
    request.session.jwt = newJwt

    //set the authorization header with the new kwt token
    response.header({authorization: newJwt})

    //return a response to the client with a success message
    response.json({status: 200, message: "profile successfully updated", data: null})


    // catch any errors that occurred during the id validation process and return a response to the client
} catch (error) {
    response.json({status: 500, data: null, message: error})
}


}

/**
 * get all followed profiles associated with logged-in user
 * @param request
 * @param response
 */
export async function getFollowersByProfileIdController(request:Request, response: Response) : Promise<void>  {
    try{
        // validate the id coming from the request parameters
        const validationResult = PublicProfileSchema.pick({id: true}).safeParse(request.params)

        // if the validation is unsuccessful, return a preformatted response to the client
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        // grab the id off of the validated request parameters
        const {id} = validationResult.data

        // grab the followers by id
        const data = await selectPublicFollowersByProfileId(id)

        // if the profile does not exist, return a preformatted response to the client
        if (data === null) {
            response.json({status: 400, message: "profile does not exist", data: null})
            return
        }

        response.json({status: 200, data: data, message: null})

    }catch(error:any){
        response.json({status: 500, data:null, message: error})
    }
}

