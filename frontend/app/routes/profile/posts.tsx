
import { useActionData, Form, useRevalidator} from "react-router";
import type {WanderList} from "~/utils/models/wanderlist.model";
import {type Post,  PostSchema} from "~/utils/models/post.model";
import React, {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRemixForm} from "remix-hook-form";
import {FaPencil} from "react-icons/fa6";
import {VisibilityOptions} from "~/utils/interfaces/VisibilityType";
import {FaWindowClose} from "react-icons/fa";

type Props = {
    posts: Post[];
    wanderlistItem: WanderList[];
};



export default function Posts(props : Props) {
    const {posts, wanderlistItem} = props;
    // Debug: Log posts to see what data we're getting
    console.log("Posts from backend:", props);

    // Get 4 most recent posts (based on created OR modified date, whichever is newer)
    const recentPosts = posts
        ?.sort((a, b) => {
            // Get the most recent date for post A (created OR modified)
            const dateA = Math.max(
                new Date(a.datetimeCreated).getTime(),
                new Date(a.datetimeModified || a.datetimeCreated).getTime()
            )

            // Get the most recent date for post B (created OR modified)
            const dateB = Math.max(
                new Date(b.datetimeCreated).getTime(),
                new Date(b.datetimeModified || b.datetimeModified).getTime()
            )

            // Sort: newer dates first (descending)
            return dateB - dateA
        }) || [];

    // State for post modal
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to open modal for creating new post
    const openCreatePostModal = () => {
        setIsPostModalOpen(true);
    };

    // Function to close modal
    const closePostModal = () => {
        setIsPostModalOpen(false);
        setIsSubmitting(false);
        reset(); // Clear all form fields
    };

    // Form handling with validation
    const resolver = zodResolver(PostSchema);
    const {handleSubmit, formState: {errors}, register, watch, reset} = useRemixForm<Post>({
        mode: 'onSubmit',
        resolver
    });

    // Watch the content field to track character count
    const contentValue = watch('content') || '';

    // Get action data to detect successful submission
    const actionData = useActionData();
    const revalidator = useRevalidator();

    // Close modal and refresh posts after successful submission
    useEffect(() => {
        // If submission was successful, close modal and refresh data
        if (actionData?.success) {
            closePostModal();
            revalidator.revalidate();
        }
    }, [actionData, revalidator]);

    return (
        <>
        {/* My Posts Section */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">My Posts</h2>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">{posts?.length || 0} posts</div>
                    <button
                        type="button"
                        onClick={openCreatePostModal}
                        className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow transition"
                    >
                        <FaPencil/>
                        Create Post
                    </button>
                </div>
            </div>

            {/* Posts Cards Grid */}
            {recentPosts.length === 0 ? (
                <div className="rounded-md py-10 px-8 text-center bg-amber-50 border border-amber-200">
                    <p className="text-xl font-semibold text-amber-700 mb-2">
                        No posts yet
                    </p>
                    <p className="text-gray-600">
                        Share your journey by creating your first post!
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 max-h-100 overflow-y-auto pr-2">
                    {recentPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {post.content || "No content"}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>
                                                    {(() => {
                                                        // Use modified date if available, otherwise created date
                                                        const dateStr = post.datetimeModified || post.datetimeCreated;

                                                        if (!dateStr) return 'Just now';
                                                        const date = new Date(dateStr);
                                                        return isNaN(date.getTime()) ? 'Just now' : date.toLocaleDateString();
                                                    })()}
                                                </span>
                                <span className="text-amber-600 hover:text-amber-700 font-medium">
                                                    Read more →
                                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* All Posts Button */}
            {/*{posts && posts.length > 4 && (
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                    >
                        View All Posts
                    </button>
                </div>
            )}*/}
        </section>

        {/* CREATE POST MODAL */}
            {isPostModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="post-modal-title"
                    onClick={closePostModal}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-lg max-h-[90vh] m-12 relative overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            id="post-modal-title"
                            className="text-2xl font-semibold text-gray-900 mb-6"
                        >
                            Create New Post
                        </h3>

                        <Form action="createpost"
                           noValidate={true}
                            method="POST"
                            className="space-y-6"
                        >
                            {/* Title Field (Required) */}
                            <label className="block">
                                <span className="text-gray-700 font-medium">
                                    Title <span className="text-red-500">*</span>
                                </span>
                                <input
                                    {...register('title')}
                                    type="text"
                                    placeholder="Enter post title"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    autoFocus
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </label>

                            {/* Content Field (Required) */}
                            <label className="block">
                                <span className="text-gray-700 font-medium">
                                    Content <span className="text-red-500">*</span>
                                </span>
                                <textarea
                                    {...register('content')}
                                    placeholder="Share your story..."
                                    rows={6}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                                />

                                {/* Character Counter - Shows when approaching limit */}
                                {contentValue.length > 800 && (
                                    <div className="mt-1 text-right">
                                        <span className={`text-xs font-medium ${
                                            contentValue.length > 1000
                                                ? 'text-red-600'
                                                : contentValue.length > 950
                                                    ? 'text-amber-600'
                                                    : 'text-gray-500'
                                        }`}>
                                            {contentValue.length} / 1000 characters
                                        </span>
                                    </div>
                                )}

                                {errors.content && (
                                    <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                                )}
                            </label>

                            {/* Wanderlist Dropdown (Required) */}
                            <label className="block">
                                <span className="text-gray-700 font-medium">
                                    Link to Wanderlist Item <span className="text-red-500">*</span>
                                </span>
                                <select
                                    {...register('wanderlistId')}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="">-- Select a wanderlist item --</option>
                                    {wanderlistItem?.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.wanderlistId && (
                                    <p className="mt-1 text-sm text-red-500">{errors.wanderlistId.message}</p>
                                )}
                            </label>

                            {/* Visibility Radio Buttons (Required) */}
                            <fieldset className="block">
                                <legend className="text-gray-700 font-medium mb-3">
                                    Visibility <span className="text-red-500">*</span>
                                </legend>
                                <div className="space-y-2">
                                    {VisibilityOptions.map((option) => (
                                        <label
                                            key={option.id}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition"
                                        >
                                            <input
                                                {...register('visibility')}
                                                type="radio"
                                                value={option.id}
                                                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-gray-800 font-medium">{option.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.visibility && (
                                    <p className="mt-1 text-sm text-red-500">{errors.visibility.message}</p>
                                )}
                            </fieldset>

                            {/* Milestone Checkbox (Optional) */}
                          {/*  <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    {...register('milestone')}
                                    type="checkbox"
                                    className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500"
                                />
                                <span className="text-gray-700 font-medium">
                                    Add as milestone
                                    <span className="block text-xs text-gray-500 font-normal">
                                        This post will appear in your timeline as a significant moment
                                    </span>
                                </span>
                            </label>*/}

                            {/* File Upload Placeholder (Optional) */}
                            <label className="block">
                                <span className="text-gray-700 font-medium">
                                    Add Images or Videos (optional)
                                </span>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-amber-400 transition">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium text-amber-600 hover:text-amber-500">
                                                Upload files
                                            </span>
                                            {' '}or drag and drop
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4 up to 10MB</p>
                                        <p className="text-xs text-amber-600 font-medium mt-2">
                                            (File upload coming soon)
                                        </p>
                                    </div>
                                </div>
                            </label>

                            {/* Submit and Cancel Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closePostModal}
                                    className="rounded-lg px-5 py-3 bg-gray-300 hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg px-5 py-3 bg-amber-500 text-white hover:bg-amber-600 transition"
                                >
                                    Create Post
                                </button>
                            </div>
                        </Form>

                        {/* Close button (X in top right) */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={closePostModal}
                            aria-label="Close modal"
                        >
                            <FaWindowClose/>
                        </button>

                    </div>
                </div>
            )}
</>
    )
}

