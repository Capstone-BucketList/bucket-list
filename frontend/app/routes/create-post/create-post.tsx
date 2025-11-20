import type {Route} from "../../../.react-router/types/app/routes/profile/+types/dashboard";
import {getSession} from "~/utils/session.server";
import {Form, redirect} from "react-router";
import {getWanderListById, WanderListFormSchema} from "~/utils/models/wanderlist.model";
import {ListItems} from "~/routes/profile/list-items";
import React from "react";
import {VisibilityOptions} from "~/utils/interfaces/VisibilityType";
import {StatusMessage} from "~/components/StatusMessage";
import {zodResolver} from "@hookform/resolvers/zod";

const resolver =  zodResolver(PostSchema)

export async function loader({request,params}: Route.LoaderArgs) {
    //Get existing session from cookie
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie)
    const wanderlistId = params.wanderlistId
console.log(wanderlistId)

    // const profile = session.get("profile");
    const authorization = session.get("authorization");


    if (!authorization || !cookie) {
        return redirect("/login");
    }
    //  get wanderlist by id
    const wanderList  =await getWanderListById(wanderlistId, authorization, cookie)

    return { wanderList}

}

export default function createPost({ loaderData }: Route.ComponentProps) {
    const { wanderList } = loaderData ?? {};
    console.log(wanderList);
    const editingItem = wanderList
    return (
        <>
            <h1>Create Post</h1>
            <ListItems wanderList={wanderList} />
            <Form onSubmit={handleSubmit}
                  noValidate={true}
                  method={'POST'}
                  className="space-y-4 md:space-y-6" >

                    <input {...register('wanderlistId')} type="hidden" id="wanderlistId" value={wanderlist.id} />


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

                {/* Content */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-medium">Content</span>
                    <textarea {...register('content')}
                              defaultValue={editingItem?.content ?? ''}
                              placeholder="Enter content"
                              rows={4}
                              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
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

        </>
    )
}