import { z } from 'zod/v4'
import {sql} from "../../utils/database.utils.ts";

export const PrivateProfileSchema = z.object({
    id: z.uuidv7('please provide a valid uuid for id'),

    activationToken: z.string('pLease provide a valid activationToken')
        .length(32,  'profile activation token must be 32 characters' ),

    bio: z.string('please provide a valid profile about')
        .max(160, 'please provide a valid about (max 160 characters)' )
        .trim()
        .nullable(),

    dateCreated: z.date('please provide a valid date')
        .nullable(),

    email: z.email('please provide a valid email')
        .max(128, 'please provide a valid email (max 128 characters)' ),

    passwordHash: z.string('Please provide a valid hash')
        .length(97, 'Please provide a valid password hash(must be 97 characters'),

    profilePicture: z.string('Please provide a valid image source')
        .max(255, 'Please Provide a valid profile picture (max 255 characters)')
        .nullable(),

    userName: z.string('please provide a valid user name')
        .min(1, 'please provide a valid user name')
        .max(32, 'please provide a valid user name(max 32 characters)')
        .trim(),

    visibility: z.string('please provide public or private setting'),
})

export type PrivateProfile = z.infer<typeof PrivateProfileSchema>

export async function insertProfile(profile: PrivateProfile): Promise<string> {
    PrivateProfileSchema.parse(profile)

    const {id , activationToken ,bio, dateCreated, email, passwordHash, profilePicture, userName, visibility} = profile
    await sql `INSERT INTO profile(id, activation_token, bio, date_created, email, password_hash, profile_picture, user_name, visibility) VALUES (${id}, ${activationToken}, ${bio},now(), ${email}, ${passwordHash}, ${profilePicture}, ${userName}, ${visibility})`
    return 'Profile Successfully created'
}