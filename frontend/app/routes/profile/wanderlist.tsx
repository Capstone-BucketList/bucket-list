import {ListItems} from "~/routes/profile/list-items";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    getWanderListByProfileId,
    postWanderList,
    type WanderListForm,
    WanderListFormSchema,
} from "~/utils/models/wanderlist.model";
import type {FormActionResponse} from "~/utils/interfaces/FormActionResponse";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {Form, redirect, useActionData} from "react-router";
import React, {useState,useEffect} from "react";
import {VisibilityOptions} from "~/utils/interfaces/VisibilityType";
import {getSession} from "~/utils/session.server";
import type {Route} from "../../../.react-router/types/app/routes/profile/+types/dashboard";
import {getFollwersByProfileId} from "~/utils/models/profile.model";


const resolver = zodResolver(WanderListFormSchema)

export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie)

    const profile = session.get("profile");
    const authorization = session.get("authorization");


    if (!profile || !authorization || !cookie) {
        return redirect("/sign-in");
    }
    //  get wonderlist items by profileId
    const wanderList  =await getWanderListByProfileId(profile.id, authorization, cookie) //profile.id)


    return {profile, wanderList}

}

export async function action ({request} : Route.ActionArgs) :Promise<FormActionResponse>{
/*    const formData = await request.formData()
console.log(formData);*/

    console.log("wanderlist action")
    const  {error, data, receivedValues:defaultValues} = await getValidatedFormData<WanderListForm>(request, resolver)

    console.log("DATA",data)
  //  console.log("RECEIVED DATA",receivedValues)
        if(error){
            return {errors, defaultValues}
        }
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie);
    const profile = session.get("profile");
    const authorization = session.get("authorization");
    if (!profile || !authorization) return redirect("/login");


    const response = await postWanderList(data,authorization,cookie,profile.id)

    if (response.status !== 200) {
        return {success: false, status: response}
    }

    return {success: true, status: response}

}

const statusOptions = [
    "Not Started",
    "In Progress",
    "On Hold",
    "Completed",
];

export default function WanderList({loaderData}:Route.ComponentProps) {
    const { wanderList} = loaderData;
    console.log("wanderList loading",wanderList)
    const {handleSubmit, formState: {errors}, register} = useRemixForm<WanderListForm>({mode: 'onSubmit', resolver})
    console.log("errors in form ",errors)
    const actionData = useActionData<typeof action>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null as null | { id: string; name: string });
    const [modalInput, setModalInput] = useState("");

    // Lock scroll when modal open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isModalOpen]);

// Open modal for adding new item
    const openAddModal = () => {
        setEditingItem(null);
        setModalInput("");
        setIsModalOpen(true);
    };

// Open modal for editing existing item
    const openEditModal = (item: { id: string; name: string }) => {
        setEditingItem(item);
        setModalInput(item.name);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalInput("");
        setEditingItem(null);
    };


    return(
       <>
    <section className="lg:col-span-3 space-y-10">
        <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">My Wanderlist</h2>
                <div className="text-sm text-gray-500">{wanderList?.length} items</div>
            </div>

            {!wanderList ? (
                <div className="rounded-md py-10 px-8 text-center bg-amber-50 border border-amber-200">
                    <p className="text-xl font-semibold text-amber-700 mb-2">
                        Your wanderlist is empty
                    </p>
                    <p className="text-gray-600 mb-6">
                        Add places, experiences, and ideas to start building your bucketlist.
                    </p>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-amber-500 text-white text-lg font-semibold hover:bg-amber-600 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                        </svg>
                        Add first item
                    </button>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2">
                    {wanderList?.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col"
                        >
                            <ListItems wanderList={item} />

                            {/* Controls - Edit button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    </section>

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
                <Form onSubmit={handleSubmit} action="addWanderList"
                      noValidate={true}
                      method={'POST'}
                      className="space-y-4 md:space-y-6" >

                {/* Title */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-medium">Title</span>
                    <input {...register('title')}
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
                    <input {...register('pinned')}
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
                       defaultValue={ wanderList?.wanderlistStatus }
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
                                wanderList?.visibility === option.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            <input {...register('visibility')}
                                type="radio"
                                name="visibility"
                                value={option.id}
                                   defaultChecked={wanderList?.visibility === option.id}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-800 font-medium">{option.name}</span>
                        </label>
                    ))}
                    {errors.visibility && (
                        <p className="mt-1 text-sm text-red-500">{errors.visibility.message}</p>
                    )}
                </fieldset>

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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                </Form>
            </div>
        </div>
    )}

    </>
           )
           }