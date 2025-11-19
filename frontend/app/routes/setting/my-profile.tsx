
import {redirect, useActionData, useNavigation} from "react-router";
import {EditProfile} from "~/components/edit-profile";
import {Form} from "react-router";
import React from "react";
import { getSession} from "~/utils/session.server";
import type {Route} from "./+types/my-profile";
import {editProfileAction} from "./edit-profile-action";

export async function loader({request}: Route.LoaderArgs) {

    //Get existing session from cookie
    const session = await getSession(request.headers.get('Cookie'))

    const profile = session?.get('profile') ?? null ;

    return {profile}
}

/**
 * Action for my-profile route.
 * Handles profile updates and redirects user after submission.
 *
 * @param request Action request object
 */
export async function action({request}: Route.ActionArgs) {
   return await editProfileAction(request);

}

/**
 * MyProfile component renders the user's profile page.
 * Displays user information and profile edit options.
 */
export default function MyProfile({loaderData}: Route.ComponentProps) {

    const {profile} = loaderData
    console.log("setting profile",profile)
    const initialUser = profile

    const [editMode, setEditMode] = React.useState(false);
    const navigation = useNavigation();

    if (!initialUser) {
        return redirect("/login")
    }
    const actionData = useActionData()
    React.useEffect(() => {
        console.log("state",navigation.state);
        console.log("useeffecteditMode",editMode);
        if (navigation.state === "submitting" && editMode) {
            setEditMode(false);
        }
    }, [navigation.state]);
console.log("editMode",editMode);

    return (
        <>
            <section className="max-w-4xl min-w-1/2 md:mx-auto p-6 sm:pt-[4rem]">
                <div className="flex justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <div className="flex flex-row gap-4">
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="hover:cursor-pointer bg-gradient-to-br from-blue-500 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:to-indigo-700 transition"
                            >
                                Edit
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditMode(false)}
                                className="hover:cursor-pointer bg-gradient-to-br from-red-500 to-red-400 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition align-right"
                            >
                                Cancel
                            </button>
                        )}
                        {/* Sign Out Button */}
                        {!editMode ? (
                            <Form method='POST' action="/logout">
                                <button
                                    type="submit"
                                    className="hover:cursor-pointer bg-gradient-to-br from-red-500 to-red-400 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow transition"
                                >
                                    Log Out
                                </button>
                            </Form>
                        ) : null}
                    </div>
                </div>
                {editMode ? (
                    <div>

                        <EditProfile
                            profile={initialUser}
                            errorMessage={actionData?.error}

                        />
                    </div>

                ) : (
                    <div className="space-y-4 bg-white shadow-md p-6 rounded-xl">
                        <div className="flex items-center gap-4">
                            <img
                                src={initialUser.profilePicture}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border"
                            />
                            <div>
                                <h2 className="text-2xl font-semibold">{initialUser.userName}</h2>
                             <h2 className="text-2xl font-semibold">{initialUser.email}</h2>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700">Bio:</h3>
                            <p className="text-gray-800">{initialUser.bio || "No bio provided."}</p>
                        </div>
                      <div>
                            <h3 className="font-bold text-gray-700">Visibility:</h3>
                            <p className="text-gray-800">{initialUser.visibility || "No visibility provided."}</p>
                        </div>

                    </div>
                )}
            </section>

        </>
    )
}