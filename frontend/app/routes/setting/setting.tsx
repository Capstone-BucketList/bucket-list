import { useState } from "react";
import { Label, TextInput, Button, Textarea, Avatar, Spinner } from "flowbite-react";

import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {
    type Profile,
    ProfileSchema,
    profileUpdate,
} from "~/utils/models/profile.model";
import {Form, useActionData} from "react-router";
import {StatusMessage} from "~/components/StatusMessage";
import {zodResolver} from "@hookform/resolvers/zod";
import {getSession} from "~/utils/session.server";
import type { Route } from "./+types/my-profile";


export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const session = await getSession(request.headers.get('Cookie'))

    const profile = session?.get('profile') ?? null ;

    return {profile}

}

export async function action({ request }: { request: Request }) {
    const {errors, data, receivedValues: defaultValues} = await getValidatedFormData<Profile>(request, resolver)
console.log("updateprofile",data)
    if (errors) {
        return { errors, defaultValues}
    }

    const response = await profileUpdate(data)
    console.log("RESPONSE" , response)


    if (response.status !== 200) {
        return {success: false, status: response}
    }


    return {success: true, status: response}

      /*
    // Upload to Cloudinary if image selected
    let imageUrl = null;

    if (raw.image && raw.image instanceof File && raw.image.size > 0) {
        const imgData = new FormData();
        imgData.append("file", raw.image);
        imgData.append("upload_preset", "YOUR_UPLOAD_PRESET");

        const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
            imgData
        );
        imageUrl = uploadRes.data.secure_url;
    }

    // Example: Save to DB here

    return {
        success: true,
        message: "Settings updated successfully!",
        imageUrl,
    };*/
}


const resolver = zodResolver(ProfileSchema)
export default function SettingsPage({loaderData} :Route.ComponentProps) {
        const {profile} = loaderData
    const {profilePicture, userName,bio,email } = profile
    console.log("setting profile",profile)
    const {handleSubmit, formState: {errors}, register} = useRemixForm<Profile>({mode: 'onSubmit', resolver})
    console.log(errors)
    const actionData = useActionData<typeof action>();
    console.log()

    const [preview, setPreview] = useState<string | null>(null);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

            <Form onSubmit={handleSubmit}
                  noValidate={true}
                  method={'POST'}
                  className="space-y-4 md:space-y-6" encType="multipart/form-data">

                {/* Profile Image Upload */}
                <div className="flex items-center gap-4">
                    <Avatar rounded size="xl" img={preview || profilePicture} />
                    <div>
                        <Label htmlFor="image"  > Profile Image</Label>
                        <input {...register('profilePicture')}
                            type="file"

                            id="profilePicture"
                            accept="image/*"
                            className="block mt-1 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none"

                        />
                        {errors.profilePicture && (
                            <p className="mt-1 text-sm text-red-500">{errors.profilePicture.message}</p>
                        )}
                    </div>
                </div>


                    <div>
                        <label htmlFor="userName"
                               className="block mb-2 text-sm font-medium text-gray-900 ">User
                            Name</label>
                        <input  {...register('userName')}
                                type="userName" id="userName"  defaultValue={userName}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required/>
                        {errors.userName && (
                            <p className="mt-1 text-sm text-red-500">{errors.userName.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="email"
                               className="block mb-2 text-sm font-medium text-gray-900 ">Your
                            Email</label>
                        <input type="email" id="email" defaultValue={email}
                               {...register('email')}
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="name@company.com" required/>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                {/* Bio */}
                <div>
                    <label htmlFor="bio"
                           className="block mb-2 text-sm font-medium text-gray-900 ">Bio</label>
                    <textarea id="bio" defaultValue={bio} rows={4}
                              {...register('bio')}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                    {errors.bio && (
                        <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                    )}
                </div>

                <button type="submit"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Update an account
                </button>


                {/* Success message */}
                <StatusMessage actionData={actionData} />
            </Form>
        </div>
    );

}
