
import {ProgressBars} from "~/routes/profile/progress-bars";
import {Timeline} from "~/routes/profile/timeline";
import {
    deleteWanderList,
    getWanderListByProfileId, postWanderList, updateWanderList, type WanderListForm, WanderListSchema,
} from "~/utils/models/wanderlist.model";

import WanderList from "~/routes/profile/wanderlist";
import {zodResolver} from "@hookform/resolvers/zod";

import type {FormActionResponse} from "~/utils/interfaces/FormActionResponse";
import {getValidatedFormData, useRemixForm,validateFormData} from "remix-hook-form";
import {Form, redirect, useActionData, useRevalidator} from "react-router";
import React, {useState,useEffect} from "react";
import {getSession} from "~/utils/session.server";
import type {Route} from "../../../.react-router/types/app/routes/profile/+types/dashboard";
import {getFollwersByProfileId, getPublicProfiles, type SignUp} from "~/utils/models/profile.model";
import {FaPencil} from "react-icons/fa6";
import {StatusMessage} from "~/components/StatusMessage";
import {VisibilityOptions} from "~/utils/interfaces/VisibilityType";
import {FaWindowClose} from "react-icons/fa";

export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie)

    const profile = session.get("profile");
    const authorization = session.get("authorization");


    if (!profile || !authorization || !cookie) {
        return redirect("/login");
    }
    //  get wonderlist items by profileId
    const wanderList  =await getWanderListByProfileId(profile.id, authorization, cookie)
    // followers profiles
    const followingProfiles = await getFollwersByProfileId(profile.id, authorization, cookie)
    const publicProfiles = await getPublicProfiles(profile.id, authorization, cookie)

    const progressBars = await getWanderListByProfileId(profile.id, authorization, cookie)
     return {profile, wanderList,followingProfiles,publicProfiles,progressBars}

}

export async function action({ request }: Route.ActionArgs) {

    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const profile = session.get("profile");
    const authorization = session.get("authorization");

    if (!profile || !authorization) return redirect("/login");

    let response;

    const formData =   await request.formData()
    console.log("formData", formData)
    const mode =   formData.get("mode")

    if(mode && mode === 'delete') {
        const id = formData.get("id");
        response = await deleteWanderList(id, authorization, cookie);
    } else {

        const {errors, data, receivedValues: defaultValues} = await getValidatedFormData<WanderList>(formData, resolver)

        if (errors) {
            return { errors, defaultValues}
        }
        console.log("action update: ", data)
        if (data?.id) {
            /** EDIT MODE */
            response = await updateWanderList(data, authorization, cookie, profile.id);
        } else {
            /** ADD MODE */
            response = await postWanderList(data, authorization, cookie, profile.id);
        }
    }
    if (response.status !== 200) {
        return { success: false, status: response };
    }
    return {
         success: true,
         status: response
     };

    // ⬅️ redirect back to dashboard
   // return redirect('/dashboard');
}

const statusOptions = [
    "Not Started",
    "In Progress",
    "On Hold",
    "Completed",
];

const resolver =  zodResolver(WanderListSchema)

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { profile, wanderList,followingProfiles,publicProfiles,progressBars } = loaderData ?? {};

    if (!profile) {
        redirect("/");
    }

    const { userName, email, bio, profilePicture } = profile ?? {};

    const {handleSubmit, formState: {errors}, register} = useRemixForm<WanderList>({mode: 'onSubmit', resolver})
    const actionData = useActionData<typeof action>();

        const revalidator = useRevalidator();

        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editingItem, setEditingItem] = useState<WanderList | null>(null);

        const openAddModal = () => {
            setEditingItem(null);
            setIsModalOpen(true);
        };

        const openEditModal = (item: WanderList) => {
            setEditingItem(item);
            setIsModalOpen(true);
        };

        const closeModal = () => {
            setIsModalOpen(false);
            setEditingItem(null);
        };

      // Close modal & refresh loader on successful submit
        React.useEffect(() => {
            if (actionData?.success) {
                closeModal();
                revalidator.revalidate();
            }
        }, [actionData, revalidator]);
    return (
        <>
        {/*    <div
                className="min-h-screen bg-purple-300 relative overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 py-12 w-full"
                // style={{
                //     backgroundImage:
                //         `url('https://www.transparenttextures.com/patterns/asfalt-light.png'), linear-gradient(to top right, #e0e7ff, #fef3c7)`,
                //     backgroundRepeat: "repeat, no-repeat",
                //     backgroundSize: "auto, cover",
                //     backgroundPosition: "center",
                // }}
            >*/}
                {/* Profile header */}
                <header  className="p-10 flex flex-col sm:flex-row items-center gap-6 w-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/adventures3.jpg')" }}>
                    <img
                        src={profilePicture || "/images/avatar-placeholder.png"}
                        alt={`${userName ?? "User"} avatar`}
                        className="w-28 h-28 rounded-full object-cover ring-2 ring-offset-1 ring-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-4xl font-extrabold text-gray-900">{userName || "Anonymous"}</h1>
                        <p className="text-sm text-gray-600 italic">{email}</p>
                        <p className="mt-3 text-gray-700 max-w-prose">{bio || "No bio yet — tell people about your journey!"}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                           {/* <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow transition"
                            >
                                <FaPencil/>

                                Add Wander
                            </button>*/}
                        </div>
                    </div>
                </header>
        <div
            className="min-h-screen bg-purple-300 relative overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 py-12 w-full">


            {/* Main grid - FULL WIDTH */}
                <section
                    className="w-full grid grid-cols-1 lg:grid-cols-4 gap-10"
                    style={{ minHeight: "70vh" }}
                >
                    {/* LEFT + MIDDLE - Wanderlist + Posts */}
                    <section className="lg:col-span-3 space-y-10">
                        <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">My Wanderlist</h2>
                                <div className="text-sm text-gray-500">{wanderList?.length} items</div>
                                <button
                                    type="button"
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow transition"
                                >
                                    <FaPencil/>

                                    Add Wander
                                </button>
                            </div>


                        {/* WanderList Section */}
                        <WanderList wanderList={wanderList} openEditModal={openEditModal} />


                        {/* MODAL */}
                        {isModalOpen && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="modal-title"
                                onClick={closeModal}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") closeModal();
                                }}
                            >
                                <div
                                    className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-lg max-h-3/4 m-12 relative overflow-hidden overflow-y-scroll"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3
                                        id="modal-title"
                                        className="text-2xl font-semibold text-gray-900 mb-6"
                                    >
                                        {editingItem ? "Edit Wander Item" : "Add New Wander Item"}
                                    </h3>
                                    <Form onSubmit={handleSubmit}
                                          noValidate={true}
                                          method={'POST'}
                                          className="space-y-4 md:space-y-6" >
                                        {/* if editing */}
                                        {editingItem && (
                                            <input {...register('id')} type="hidden" id="id" value={editingItem?.id} />
                                        )}
                                        {/* Title */}
                                        <label className="block mb-4">
                                            <span className="text-gray-700 font-medium">Title</span>
                                            <input {...register('title')}
                                                   defaultValue={editingItem?.title}
                                                   type="text"
                                                   placeholder="Enter title"
                                                   className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                   autoFocus
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                                            )}
                                        </label>

                                        {/* Description */}
                                        <label className="block mb-4">
                                            <span className="text-gray-700 font-medium">Description</span>
                                            <textarea {...register('description')}
                                                      defaultValue={editingItem?.description ?? ''}
                                                      placeholder="Enter description"
                                                      rows={4}
                                                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"

                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                                            )}
                                        </label>


                                        {/* Target Date */}
                                        <label className="block mb-4">
                                            <span className="text-gray-700 font-medium">Target Completion Date</span>
                                            <input {...register('targetDate')} defaultValue={editingItem?.targetDate?.toISOString()?.slice(0, 10)}
                                                   type="date"
                                                   className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"

                                            />
                                            {errors.targetDate && (
                                                <p className="mt-1 text-sm text-red-500">{errors.targetDate.message}</p>
                                            )}
                                        </label>

                                        {/* Pinned */}
                                        <label className="inline-flex items-center mb-4 cursor-pointer">
                                            <input {...register('pinned')} defaultChecked={editingItem?.pinned}
                                                   type="checkbox"
                                                   className="form-checkbox h-5 w-5 text-amber-500"

                                            />
                                            <span className="ml-2 text-gray-700 font-medium">Pin as Favorite</span>
                                            {errors.pinned && (
                                                <p className="mt-1 text-sm text-red-500">{errors.pinned.message}</p>
                                            )}
                                        </label>

                                        {/* Wanderlist Status */}
                                        <label className="block mb-4">
                                            <span className="text-gray-700 font-medium">Wanderlist Status</span>
                                            <select {...register('wanderlistStatus')}
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    defaultValue={ editingItem?.wanderlistStatus }
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                            {errors.wanderlistStatus && (
                                                <p className="mt-1 text-sm text-red-500">{errors.wanderlistStatus.message}</p>
                                            )}
                                        </label>

                                        {/* Visibility */}
                                        <fieldset className="mb-6">
                                            <legend className="text-gray-700 font-medium mb-2">Visibility</legend>
                                            {VisibilityOptions.map((option) => (
                                                <label
                                                    key={option.id}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                                                  ${
                                                        editingItem?.visibility === option.id
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <input {...register('visibility')}
                                                           type="radio"
                                                           name="visibility"
                                                           value={option.id}
                                                           defaultChecked={editingItem?.visibility === option.id}
                                                           className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-gray-800 font-medium">{option.name}</span>
                                                </label>
                                            ))}
                                            {errors.visibility && (
                                                <p className="mt-1 text-sm text-red-500">{errors.visibility.message}</p>
                                            )}
                                        </fieldset>
                                        <StatusMessage actionData={actionData} />
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={closeModal}
                                                className="rounded-lg px-5 py-3 bg-gray-300 hover:bg-gray-400 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit"
                                                    className="rounded-lg px-5 py-3 bg-amber-500 text-white hover:bg-amber-600 transition"
                                            >
                                                {editingItem ? "Save" : "Add"}
                                            </button>
                                        </div>

                                        {/* Close button */}
                                        <button
                                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                            onClick={closeModal}
                                            aria-label="Close modal"
                                        >
                                            <FaWindowClose/>

                                        </button>
                                    </Form>
                                </div>
                            </div>
                        )}
                    </section>
                    </section>
                    {/* RIGHT Sidebar - Friends + Progress + Timeline */}
                    <aside className="space-y-10">
                        {/* Friends */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Friends</h3>
                                <a href="#" className="text-gray-500 hover:underline">
                                    See all
                                </a>
                            </div>

                            <div className="
                                  h-[300px]
                                  overflow-y-auto
                                  scroll-smooth
                                  flex flex-wrap justify-start
                                  gap-4 p-2
                                ">
                            {/* Example friend cards */}
                                {followingProfiles.map(profile => (
                                    <FriendCard name={profile.userName} img={profilePicture} />
                                ))
                                }
                                {
                                    publicProfiles.map(profile => (
                                        <FriendCard name={profile.userName} img={profilePicture} />
                                    ))
                                }

                            </div>
                        </section>

                        {/* Progress Bars */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">My Journey</h3>
                            <p className="text-gray-500 mb-6">
                                Progress on your wanderlists and milestones.
                            </p>
                            <div className="space-y-5">
                                <ProgressBars items={progressBars} />

                            </div>

                        </section>

                        {/* Timeline */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <ol className="space-y-4">
                                {[1, 2, 3].map((num) => (
                                    <li key={num} className="flex items-start gap-4">
                    <span className="mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-semibold">
                      {num}
                    </span>
                                        <div className="text-gray-700">
                                            <Timeline />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </aside>
                </section>

            </div>
        </>
    );


function FriendCard({
                        name,
                        img,
                    }: {
    name: string;
    img: string;
}) {
    return (
        <div className="flex items-center gap-5">
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={img}
                alt={`${name} avatar`}
            />
            <div>
                <p className="font-semibold text-gray-900">{name}</p>
                <button type="button" className="bg-blue-700 rounded p-1">Follow</button>
            </div>
        </div>
    );
} }