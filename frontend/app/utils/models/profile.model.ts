import z from "zod/v4"
import type {Status} from "~/utils/interfaces/Status";
import {v7 as uuid} from 'uuid'


//1
/**
 * Schema for validating profile objects
 * @shape id: string the primary key for the profile
 * @shape email: string the email for the profile
 * @shape userName: string the name for the profile
 */

export const ProfileSchema = z.object({
    id: z.uuidv7('please provide a valid uuid for id'),

    email: z.email('please provide a valid email')
        .max(128, 'please provide a valid email (max 128 characters)' ),

    userName: z.string('please provide a valid user name')
        .min(1, 'please provide a valid user name')
        .max(32, 'please provide a valid user name(max 32 characters)')
        .trim(),
    bio: z.string('please provide a valid profile about')
        .max(160, 'please provide a valid about (max 160 characters)' )
        .trim()
        .nullable(),

    profilePicture: z.string('Please provide a valid image source')
        .max(255, 'Please Provide a valid profile picture (max 255 characters)')
        .nullable(),


})

export type Profile = z.infer<typeof ProfileSchema>

//2
export const SignUpSchema = ProfileSchema
    .omit({ id: true})
    .extend({
        passwordConfirm: z.string('password confirmation is required')
            .min(8, 'Password confirm cannot be less than 8 characters')
            .max(32, 'profile password '),
        password: z.string('password is required')
            .min(8,  'profile password cannot be less than 8 characters' )
            .max(32,  'profile password cannot be over 32 characters' )
    })
    .refine(
        data => data.password === data.passwordConfirm, {
            message: 'passwords do not match'
        })

export type SignUp = z.infer<typeof SignUpSchema>

export async function postSignUp(data: SignUp): Promise<{result: Status, headers: Headers}> {

    const modifiedSignUp = {id: uuid(), ...data }
    const response = await fetch(`${process.env.REST_API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(modifiedSignUp)
    })
console.log(response)
    if( !response.ok) {
        throw new Error('Failed to sign up')
    }

    const result = await response.json()

    return result
}