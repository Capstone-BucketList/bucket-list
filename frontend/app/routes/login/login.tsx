
import {zodResolver} from "@hookform/resolvers/zod";
import {postSignIn, type SignIn, SignInSchema} from "~/utils/models/sign_in.model";
import {Form, Link, redirect, useActionData,} from "react-router";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {ProfileSchema} from "~/utils/models/profile.model";
import {jwtDecode} from "jwt-decode";
import {commitSession, getSession} from "~/utils/session.server";
import type { Route } from "./+types/login";
import {useState} from "react";
import {StatusMessage} from "~/components/StatusMessage";
import { Eye, EyeOff } from "lucide-react";
import {FieldError} from "~/components/FieldError";
import type {FormActionResponse} from "~/utils/interfaces/FormActionResponse";
/**
 * Steps for sign in
 * 1. create a schema and model for sign in
 * 4. registered our schema to work with remix-hook-form
 * 5. initialized the remix-form-hook in our component
 * 6. register the form with remix-form-hook
 * 7. create an action and preform a fetch request to the backend
 * 8. Add authorization to a cookie for future use
 * 9. on successful sign in redirect to the home page
 * 9.5 display an error
 *
 */

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Sign In - Rethreads" },
        { name: "description", content: "Sign in to your Rethreads account" },
    ];
}

export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const session = await getSession(request.headers.get('Cookie'))

    //Check if user is already authenticated
    if (session.has('profile')) {
        return redirect('/')
    }
}

//4
const resolver = zodResolver(SignInSchema)

export async function action({request}: Route.ActionArgs):Promise<FormActionResponse | Response>  {
        //Get existing session from cookie
        const session =await getSession(request.headers.get('Cookie'))

        const {errors, data, receivedValues: defaultValues} = await getValidatedFormData<SignIn>(request, resolver)

    if (errors) {
        return{errors, defaultValues}
    }

        const {result, headers} = await postSignIn(data)

        // extract the authorization token from the headers
        const authorization = headers.get('authorization')

        //extract the express cookie from response headers
        const  expressSessionCookie = headers.get('Set-Cookie')

         // Check if authentication was successful
        if (result.status !== 200 || !authorization ) {
            return {success: false, status: result}
        }
console.log(result)
        //Decode JWT token to extract user profile
        const parsedJwtToken = jwtDecode(authorization) as any
console.log(parsedJwtToken)
        //Validate profile data from JWT
        const validationResult = ProfileSchema.safeParse(parsedJwtToken.auth)
console.log(validationResult)
        //Handle invalid profile data
        if (!validationResult.success) {
            session.flash('error', 'profile is malformed')
            return {success: false, status: {status:400, message: 'sign in attempt failed try again', data: null}}
        }

        session.set('authorization', authorization)
        session.set('profile', validationResult.data)

        const responseHeaders = new Headers()
        responseHeaders.append('Set-Cookie', await commitSession(session))
        if (expressSessionCookie) {
            responseHeaders.append('Set-Cookie', expressSessionCookie)
        }

        return redirect('/dashboard', {headers: responseHeaders})
}

export default function  Login (){
    const [showPassword, setShowPassword] = useState(false);
    //5
    const {handleSubmit, formState: {errors}, register} = useRemixForm<SignIn>({mode:'onSubmit', resolver})

    const actionData = useActionData<typeof action>();


    return (
        <>
        <Form onSubmit={handleSubmit}
              method="POST"
            className="max-w-sm mx-auto m-6">
            <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                    email</label>
                <input {...register('email')}
                    type="email" id="email" placeholder="name@flowbite.com" required
                       className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                ${errors.email
                ? 'border-red-500 focus:ring-red 500'
                : 'border-gray-300 focus:ring-slate-500'}`}/>
                <FieldError error={errors} field={'email'}/>
            </div>
            <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                    password</label>
                <input {...register('password')}
                    type={showPassword ? "text" : "password"} id="password" required
                       className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       ${errors.password
                       ? 'border-red-500 focus:ring-red-500'
                       : 'border-gray-300 focus:ring-slate-500'}`}/>
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                    )}
                </button>
                <div>
                    <FieldError error={errors} field={'password'} />
                </div>
            </div>
            {/*<div className="flex items-start mb-5">*/}
            {/*    <div className="flex items-center h-5">*/}
            {/*        <input id="remember" type="checkbox" value=""*/}
            {/*               className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"*/}
            {/*               required/>*/}
            {/*    </div>*/}
            {/*    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember*/}
            {/*        me</label>*/}
            {/*</div>*/}
            <button
                type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
            </button>
            <StatusMessage actionData={actionData} />
        </Form>
        <div className ='mt-6 text-center'>
            <Link to={"/signup"}
                  className='text-sm text-gray-600 hover:text-gray-900 underline'>
                Don't have an account? Sign up
            </Link>
        </div>
        </>
    )
}