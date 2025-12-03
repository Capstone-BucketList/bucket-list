
import {ProgressBars} from "~/routes/profile/progress-bars";
import {TimelineComponent} from "~/routes/profile/timeline-component";
import {
    deleteWanderList,
    getWanderListByProfileId, postWanderList, updateWanderList, WanderListSchema,
    type WanderList
} from "~/utils/models/wanderlist.model";

import {zodResolver} from "@hookform/resolvers/zod";

import {getValidatedFormData, useRemixForm,validateFormData} from "remix-hook-form";
import {Form, redirect, useActionData, useRevalidator} from "react-router";
import React, {useState,useEffect} from "react";
import {getSession} from "~/utils/session.server";
import type {Route} from "../../../.react-router/types/app/routes/profile/+types/dashboard";
import {
    getFollwersByProfileId,
    getFollwingsByProfileId,
    getPublicProfiles,
    type SignUp
} from "~/utils/models/profile.model";
import {FaPencil} from "react-icons/fa6";
import {StatusMessage} from "~/components/StatusMessage";
import {VisibilityOptions} from "~/utils/interfaces/VisibilityType";
import {FaWindowClose} from "react-icons/fa";
import {FriendCard} from "~/routes/profile/friendcard";
import WanderListItems from "~/routes/profile/wanderlist";
import {Card} from "flowbite-react";
import Posts from "~/routes/profile/posts";
import {getPostByProfileId} from "~/utils/models/post.model";

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

    //  const publicProfiles = await getPublicProfiles(profile.id, authorization, cookie)
    // get posts by profileId
    const posts = await getPostByProfileId(profile.id, authorization, cookie)

    const progressBars = await getWanderListByProfileId(profile.id, authorization, cookie)
    return {profile, wanderList,followingProfiles,progressBars,posts}

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
            console.log("modify action")
            /** EDIT MODE */
            response = await updateWanderList(data, authorization, cookie, profile.id);
        } else {
            console.log("add action")
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
    const { profile, wanderList,followingProfiles,progressBars,posts } = loaderData ?? {};

    if (!profile) {
        redirect("/");
    }

    const { userName, email, bio, profilePicture } = profile ?? {};

    const {handleSubmit, formState: {errors}, register, reset} = useRemixForm<WanderList>({mode: 'onSubmit', resolver})
    const actionData = useActionData<typeof action>();

    const revalidator = useRevalidator();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<WanderList | null>(null);

    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
        // Reset form to empty values for Add mode
        reset({
            id: undefined,
            title: '',
            description: '',
            targetDate: null,
            pinned: false,
            wanderlistStatus: 'Not Started',
            visibility: 'Public',
        });
    };

    const openEditModal = (item: WanderList) => {
        setEditingItem(item);
        setIsModalOpen(true);
        // Reset form with the selected item's data
        // Convert ISO date string to YYYY-MM-DD format for date input
        let formattedDate = null;
        if (item.targetDate) {
          /*  if (typeof item.targetDate === 'string') {
                formattedDate = item.targetDate.split('T')[0];
            } else {*/
                formattedDate = new Date(item.targetDate).toISOString().split('T')[0];
            //}
        }
        console.log("date:", item.targetDate, "formatted:", formattedDate)
        reset({
            id: item.id,
            title: item.title,
            description: item.description ?? '',
            targetDate: formattedDate,
            pinned: item.pinned,
            wanderlistStatus: item.wanderlistStatus,
            visibility: item.visibility,
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        // Reset form to clean state
        reset({
            id: undefined,
            title: '',
            description: '',
            targetDate: null,
            pinned: false,
            wanderlistStatus: 'Not Started',
            visibility: 'Public',
        });
    };

    // Reset form when editingItem changes (for switching between different edit items)
    useEffect(() => {
        if (editingItem) {
            // Convert ISO date string to YYYY-MM-DD format for date input
            let formattedDate = null;
            if (editingItem.targetDate) {
                if (typeof editingItem.targetDate === 'string') {
                    formattedDate = editingItem.targetDate.split('T')[0];
                } else {
                    formattedDate = new Date(editingItem.targetDate).toISOString().split('T')[0];
                }
            }
            reset({
                id: editingItem.id,
                title: editingItem.title,
                description: editingItem.description ?? '',
                targetDate: formattedDate,
                pinned: editingItem.pinned,
                wanderlistStatus: editingItem.wanderlistStatus,
                visibility: editingItem.visibility,
            });
        }
    }, [editingItem, reset]);

    // Close modal & refresh loader on successful submit
    React.useEffect(() => {
        if (actionData?.success) {
            closeModal();
            revalidator.revalidate();
        }
    }, [actionData, revalidator]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Profile header - Vibrant gradient */}
            <header style={{ backgroundImage: "url('/img_4.png')" }}
                    //className="relative p-10 flex flex-col sm:flex-row items-center gap-8 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-xl overflow-hidden"
                    className="pr-5 pl-18 pt-5 flex flex-col sm:flex-row items-center gap-6 w-full bg-cover bg-center bg-no-repeat" >
                {/* Animated background elements */}
               {/* <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 left-10 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-2 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>*/}

                {/* Profile Image and Name Column */}
                <div className="flex flex-col items-center">
                    {/* Profile Image with animation */}
                    <img
                        src={profilePicture || "/images/avatar-placeholder.png"}
                        alt={`${userName ?? "User"} avatar`}
                        className="relative w-50 h-50 rounded-full object-cover ring-4 ring-white shadow-lg transform hover:scale-110 transition-transform duration-300 mb-4"
                    />
                    {/* Name Below Image */}
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <span className="text-transparent [-webkit-text-stroke:2px_black]">{userName}</span>
                    </h1>
                </div>

                {/* Profile Info */}
               {/* <div className="flex-1 min-w-0 max-w-70 relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      <span className="text-transparent [-webkit-text-stroke:2px_black]">  {userName}</span>                    </h1>
                    <p className="text-base md:text-lg text-black/95 mt-2 font-medium drop-shadow">{email}</p>
                    <p className="mt-3 text-black/90 max-w-prose text-sm md:text-base leading-relaxed drop-shadow">{bio || "No bio yet — tell people about your journey!"}</p>
                </div>*/}
            </header>

            <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-12 w-full">


                {/* Main grid - FULL WIDTH */}
                <section
                    className="w-full grid grid-cols-1 lg:grid-cols-4 gap-10"
                    style={{ minHeight: "70vh" }}
                >
                    {/* LEFT + MIDDLE - Wanderlist + Posts */}
                    <section className="lg:col-span-3 space-y-10">
                        <section className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                                <div>
                                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Wanderlist</h2>
                                    <p className="text-sm text-gray-500 mt-1">{wanderList?.length} amazing adventures waiting</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
                                >
                                    <FaPencil/>
                                    Add Wander
                                </button>
                            </div>


                            {/* WanderList Section */}
                            <WanderListItems wonderlistItems={wanderList} openEditModal={openEditModal} />


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
                                        className="bg-gradient-to-br from-white to-blue-50 rounded-3xl max-w-lg w-full p-8 shadow-2xl max-h-3/4 m-12 relative overflow-hidden overflow-y-scroll border-2 border-blue-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <h3
                                            id="modal-title"
                                            className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
                                        >
                                            {editingItem ? "✏️ Edit Wander Item" : "✨ Add New Wander Item"}
                                        </h3>
                                        <Form onSubmit={handleSubmit}
                                              noValidate={true}
                                              method={'POST'}
                                              className="space-y-4 md:space-y-6" >
                                            {/* if editing - ID will be populated by form reset */}
                                            <input {...register('id')} type="hidden" id="id" />
                                            {/* Title */}
                                            <label className="block mb-4">
                                                <span className="text-gray-700 font-semibold block mb-2">🎯 Title</span>
                                                <input {...register('title')}
                                                       defaultValue={editingItem?.title}
                                                       type="text"
                                                       placeholder="What's your dream adventure?"
                                                       className="mt-1 block w-full rounded-xl border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
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
                                                <input {...register('targetDate')}
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
                                            <div className="flex justify-end gap-4 mt-8">
                                                <button
                                                    onClick={closeModal}
                                                    className="rounded-xl px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition transform hover:scale-105"
                                                >
                                                    Cancel
                                                </button>
                                                <button type="submit"
                                                        className="rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition transform hover:scale-105"
                                                >
                                                    {editingItem ? "💾 Save" : "✨ Add"}
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

                        <Posts posts={posts} wanderlistItem={wanderList}/>
                        {/* Timeline */}
                        <section className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-extrabold mb-6">📅 <span className="bg-gradient-to-r from-violet-600 to-purple-600 text-transparent  bg-clip-text "> Journey Timeline </span></h3>
                            <TimelineComponent items={progressBars || []} />
                        </section>
                    </section>
                    {/* RIGHT Sidebar - Friends + Progress + Timeline */}
                    <aside className="space-y-5">
                        {/* Friends */}
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">👥 Friends</h2>
                            <div className="flex flex-col gap-4 max-h-100 overflow-y-auto pr-2">
                                {followingProfiles?.map((profile, idx) => (
                                    <FriendCard key={idx} profile={profile} isFriend={true} />
                                ))}
                            </div>
                        </div>

                        {/* Progress Bars */}
                      {/*  <section className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">🚀 My Journey</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Track your progress on amazing wanderlists and milestones.
                            </p>
                            <div className="space-y-5  max-h-80 overflow-y-auto pr-2">
                                <ProgressBars items={progressBars} />
                            </div>
                        </section>*/}


                    </aside>
                </section>

            </div>
        </div>
    );

}