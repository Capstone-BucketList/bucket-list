import {Form} from "react-router";
import {IconContext} from "react-icons";
import {CgProfile} from "react-icons/cg";
import React, {useState} from "react";
import type {Profile} from "~/utils/models/profile.model";
import {VisibilityOptions} from "~/utils/interfaces/VisibilityType";

type Props = {
    profile: Profile;
    errorMessage?: string;
};




/**
 * EditProfile component renders a form for editing user profile details.
 * Allows updating profile image, state, city, bio, availability, and interests.
 * Shows error messages for invalid input or file size.
 *
 * @param user Current user object
 * @param interests List of all available interests
 * @param userInterests List of user's selected interests
 * @param q Search query for interests
 * @param errorMessage Optional error message to display
 */
export function EditProfile (props: Props) {
    const {profile,  errorMessage} = props;
    const [formData, setFormData] = useState({
        profilePicture: null as File | null,

    })
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.profilePicture ?? null);
    const [selected, setSelected] = useState<string>(profile.visibility ?? "public");
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        // Validate file size before preview
        if (file && file.size > maxFileSize) {
            alert(`File size exceeds ${maxFileSize}MB limit.`);
            return;
        }
        // Show preview if file is valid
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }
    return (
        <>
            <section className="flex flex-col gap-10 px-4 sm:px-6 md:px-8 pb-[5rem] md:pb-0">
                {/* wrapper box around everything */}
                <div className="w-full bg-white shadow-xl rounded-3xl p-6 sm:p-10 space-y-10 transition-all">
                    {/* Profile update form */}
                    <Form method="put" encType="multipart/form-data" id="updateProfile"
                          className="w-full flex flex-col lg:flex-row justify-between items-start gap-8">
                        {/* LEFT SIDE: Profile image, name, state, city */}
                        <div className="flex flex-col items-center gap-2 lg:gap-4 w-full lg:w-1/3">

                            <input
                                type="file"
                                accept="image/*"
                                name="profilePicture"
                                id="profilePicture"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="profilePicture" className="hover:cursor-pointer flex flex-col items-center group">
                                <IconContext.Provider value={{ size: "6em" }}>
                                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 ease-out">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Profile Preview" className="object-cover w-full h-full" />
                                        ) : (
                                            <CgProfile className="text-indigo-400" />
                                        )}
                                    </div>
                                </IconContext.Provider>
                                <p className="text-sm text-indigo-500 mt-2 group-hover:underline">
                                    {previewUrl ? "Change photo" : "Select a profile picture"}
                                </p>
                            </label>

                            <h2 className="text-lg font-semibold text-gray-800">{profile.userName}</h2>
                            <h2 className="text-lg font-semibold text-gray-800">{profile.email}</h2>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex flex-col gap-6 w-full lg:w-2/3">

                            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
                                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    placeholder="Tell us about yourself..."
                                    required
                                    defaultValue={profile.bio ?? ''}
                                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                               <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
                                    <label className="block text-gray-700 font-semibold mb-2">Visibility</label>
                                    <div className="flex flex-col gap-3">
                                        {VisibilityOptions.map((option) => (
                                            <label
                                                key={option.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                                                  ${
                                                    selected === option.id
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="visibility"
                                                    value={option.id}
                                                    checked={selected ===  option.id}
                                                    onChange={() => setSelected(option.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-800 font-medium">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>

                                </div>

                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    className="hover:cursor-pointer bg-gradient-to-br from-blue-500 to-blue-400 text-white hover:to-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200 ease-in-out"
                                >
                                    Save Profile
                                </button>

                            </div>
                        </div>
                    </Form>

                </div>
            </section>
        </>
    )
}