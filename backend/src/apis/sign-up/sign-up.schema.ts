import {z} from "zod/v4";
import {PrivateProfileSchema} from "../profile/profile.model.ts";

/**
 * The shape of the data that comes from the client when signing up
 * @property id {string} the primary key for the profile
 * @property email {string} the email for the profile
 * @property passwordConfirm {string} the password confirmation
 * @property password {string} the password
 */

export const SignUpProfileSchema = PrivateProfileSchema
    .omit({ passwordHash: true, activationToken: true, profilePicture: true, bio: true, dateCreated: true, visibility: true})
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