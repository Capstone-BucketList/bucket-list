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
import type {Route} from "../../../.react-router/types/app/routes/profile/+types/dashboard";


export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const session = await getSession(request.headers.get('Cookie'))

    const profile = session?.get('profile') ?? null ;

    return {profile}

}

export async function action({ request }: { request: Request }) {
    const {errors, data, receivedValues: defaultValues} = await getValidatedFormData<Profile>(request, resolver)

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
    console.log(actionData)

    const [preview, setPreview] = useState<string | null>(null);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

            <Form method="post" encType="multipart/form-data" className="space-y-6" onSubmit ={handleSubmit} >

                {/* Profile Image Upload */}
                <div className="flex items-center gap-4">
                    <Avatar rounded size="xl" img={preview || profilePicture} />
                    <div>
                        <Label htmlFor="image"  > Profile Image</Label>
                        <input {...register('profilePicture')}
                            type="file"

                            id="profilePicture"
                            accept="image/*"
                            className="block mt-1"

                        />
                        {errors.profilePicture && (
                            <p className="mt-1 text-sm text-red-500">{errors.profilePicture.message}</p>
                        )}
                    </div>
                </div>

                {/* Full Name */}
                <div>
                    <Label htmlFor="userName" > User Name </Label>
                    <TextInput {...register("userName")}
                               id="userName" placeholder="Enter your name"
                    value={userName}/>
                    {errors.userName && (
                        <p className="mt-1 text-sm text-red-500">{errors.userName.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email" >Email Address</Label>
                    <TextInput {... register('email')} id="email" type="email" placeholder="Enter your email"
                    value = {email}/>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Bio */}
                <div>
                    <Label htmlFor="bio" >Bio</Label>
                    <Textarea {...register('bio')}
                        id="bio"  rows={4} placeholder="Tell something about yourself..."
                    value={bio}/>
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
