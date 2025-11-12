import {SignUpSchema} from "./profile.model";
import {z} from "zod/v4";
import type {Status} from "~/utils/interfaces/Status";

/**
 * Steps for sign in
 * 1. create a schema and model for sign in
 * 4. registered our schema to work with remix-hook-form
 * 5. initialized the remix-form-hook in our component
 * 6. register the form with remix-form-hook
 * 7. create an action and preform a fetch request to the backend
 * 8. Add authorization to a cookie for future use
 * 9. on successful sign in redirect to the home pgae
 * 9.5 display an error
 *
 */


//1

export const SignInSchema = SignUpSchema.pick({email:true, password: true})

export type SignIn = z.infer<typeof SignInSchema>

export async function postSignIn(data: SignIn):Promise<{result:Status, headers: Headers}> {
    const response = await fetch(`${process.env.REST_API_URL}/sign-in`, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
        throw new Error('Failed to sign in')
    }
    const headers = response.headers
    const result = await response.json()
    console.log("RESULT", result)
    return {result, headers}
}