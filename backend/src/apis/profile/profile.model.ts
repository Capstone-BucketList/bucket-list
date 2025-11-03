import { z } from 'zod/v4'
import {sql} from "../../utils/database.utils.ts";

/**
 * Schema for validating private profile objects
 * @shape id: string the primary key for the profile
 * @shape bio: string | null the about section for the profile
 * @shape activationToken: string | null the activation token for the profile
 * @shape email: string the email for the profile
 * @shape passwordHash: string the password hash for the profile
 * @shape profilePicture: string | null the image URL for the profile
 * @shape userName: string the name for the profile
 * @shape visibility: string visibility of the profile
 */
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

/**
 * Schema for validating public profile objects
 * @shape id: string the primary key for the profile
 * @shape about: string | null the about section for the profile
 * @shape imageUrl: string | null the image URL for the profile
 * @shape name: string the name for the profile
 */
export const PublicProfileSchema = PrivateProfileSchema.omit({passwordHash: true, activationToken: true, email: true, dateCreated: true, profilePicture: true})

/**
 * this type is used to represent a private profile object
 * @shape id: string the primary key for the profile
 * @shape bio: string | null the about section for the profile
 * @shape activationToken: string | null the activation token for the profile
 * @shape email: string the email for the profile
 * @shape passwordHash: string the password hash for the profile
 * @shape profilePicture: string | null the image URL for the profile
 * @shape userName: string the name for the profile
 * @shape visibility: string visibility of the profile
 */
export type PrivateProfile = z.infer<typeof PrivateProfileSchema>

/**
 * this type is used to represent a public profile object
 * @shape id: string the primary key for the profile
 * @shape about: string | null the about section for the profile
 * @shape imageUrl: string the image URL for the profile
 * @shape name: string the name for the profile
 **/
export type PublicProfile = z.infer<typeof PublicProfileSchema>

/**
 * Inserts a new profile into the profile table
 * @param profile the profile to insert
 * @returns "profile successfully created"
 */

export async function insertProfile(profile: PrivateProfile): Promise<string> {
    PrivateProfileSchema.parse(profile)

    const {id , activationToken ,bio, dateCreated, email, passwordHash, profilePicture, userName, visibility} = profile
    await sql `INSERT INTO profile(id, activation_token, bio, date_created, email, password_hash, profile_picture, user_name, visibility) VALUES (${id}, ${activationToken}, ${bio},now(), ${email}, ${passwordHash}, ${profilePicture}, ${userName}, ${visibility})`
    return 'Profile Successfully created'
}

/**
 *Selects a profile from the profile table by activationToken
 * @param activationToken the profile's activation token to search for in the profile table
 * @returns Profile or null if no profile was found
 */
export async function selectPrivateProfileByProfileActivationToken(activationToken: string) : Promise<PrivateProfile|null> {

    const rowList = await sql `SELECT id, bio,date_created, activation_token, email,profile_picture, password_hash, user_name, visibility FROM profile WHERE activation_token = ${activationToken}`
    const result = PrivateProfileSchema.array().max(1).parse(rowList)
    return result[0] ?? null
}

/**
 * update profile table by activation token
 * @param profile
 * @returns {Promise<string>} 'Profile successfully updated
 */
export async function updateProfile(profile: PrivateProfile): Promise<string> {
    const {id,activationToken, bio,  email, passwordHash, profilePicture, userName, visibility} = profile
    await sql `UPDATE profile SET bio = ${bio}, activation_token = ${activationToken}, email = ${email},password_hash = ${passwordHash}, profile_picture = ${profilePicture}, user_name = ${userName}, visibility = ${visibility} WHERE id = ${id}`
    return 'Profile successfully updated'
}

/**
 * Selects the privateProfile from the profile table by email
 * @param email the profile's email to search for in the profile table
 * @returns Profile or null if no profile was found
 */
export async function selectPrivateProfileByProfileEmail(email: string): Promise<PrivateProfile | null> {

    // create a prepared statement that selects the profile by email and execute the statement
    const rowList = await sql`SELECT id, bio,activation_token,date_created, email, password_hash, profile_picture, user_name, visibility FROM profile WHERE email = ${email} `

    //enforce that the result is an array of one profile, or null
    const result = PrivateProfileSchema.array().max(1).parse(rowList)

        //return the profile or null if no profile was found
    return result[0] ?? null
}

/**
 * Selects a user profile based on their unique profile id
 * @param id
 * @returns profile or null if profile not found
 */
export async function getPublicProfileByPrimaryKey(id: string): Promise<PublicProfile | null > {
    // create a prepared statement that selects the profile by id and execute the statement
    const rowList = await sql`SELECT id, bio, email, profile_picture, user_name, visibility FROM profile WHERE id = ${id} `

    //enforce that the result is an array of one profile, or null
    const result = PublicProfileSchema.array().max(1).parse(rowList)
//console.log(result[0])
    //return the profile or null if no profile was found
    return result[0] ?? null
}
/**
 * selects the privateProfile from the profile table by id
 * @param id the profile's id to search for in the profile table
 * @returns PrivateProfile or null if no profile was found
 */
export async function selectPrivateProfileByProfileId(id: string): Promise<PrivateProfile | null> {

    // create a prepared statement that selects the profile by id and execute the statement
    const rowList = await sql`SELECT id, bio, activation_token, date_created, email, password_hash, profile_picture, user_name, visibility FROM profile WHERE id = ${id}`

// enforce that the result is an array of one profile, or null
    const result = PrivateProfileSchema.array().max(1).parse(rowList)

    // return the profile or null if no profile was found
    return result[0] ?? null
}

/**
 * Selects a user profile and deletes the profile from database
 * @param id used to locate Profile & deletes that user Profile
 * @returns message that tells user, their profile has been deleted
 */
export async function deleteProfileById(id: string): Promise<string>
{
    // method used to delete all attributes of Profile table for Profile ID
    const rowList = await sql `DELETE FROM profile WHERE id = ${id} `

    // return message that Profile has been deleted
    return 'Profile successfully deleted'
}

// export async function getProfilesByFollowedId(id: string): Promise<PrivateProfile |null > {
//
//     const rowList = await sql `SELECT ID, BIO, user_name FROM profile p
//         inner join follow f on p.id = f.followed_profile_id where p.id = ${id} `
//
//     const result = PrivateProfileSchema.array().max(1).parse(rowList)
//
//     return result[0] ?? null
// }

