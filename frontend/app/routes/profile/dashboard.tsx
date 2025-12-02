import {ListItems} from "~/routes/profile/list-items";
import {ProgressBars} from "~/routes/profile/progress-bars";
import {Timeline} from "~/routes/profile/timeline";
import {getSession} from "~/utils/session.server";
import type { Route } from "./+types/dashboard";
import {getWanderListByProfileId, WanderListSchema} from "~/utils/models/wanderlist.model";
import {getPostByProfileId, createPost, PostSchema, type Post} from "~/utils/models/post.model";
import {redirect} from "react-router";
import {getFollwersByProfileId} from "~/utils/models/profile.model";
import {FaPencil} from "react-icons/fa6";
import WanderList from "~/routes/profile/wanderlist";
import {useState, useEffect} from "react";
import {useRemixForm, getValidatedFormData} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, useActionData, useNavigate} from "react-router";
import {VisibilityOptions} from "~/utils/interfaces/VisibilityType";
import {v7 as uuid} from 'uuid';

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
    // followers profiles
    const followingProfiles = await getFollwersByProfileId(profile.id, authorization, cookie)
    // get posts by profileId
    const posts = await getPostByProfileId(profile.id, authorization, cookie)

     return {profile, wanderList,followingProfiles, posts}

}

export async function action({ request }: Route.ActionArgs) {
    // Validate form data against PostSchema
    const { error, data } = await getValidatedFormData<Post>(request, zodResolver(PostSchema));

    if (error) {
        return { errors: error, defaultValues: data };
    }

    // Get session data
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const profile = session.get("profile");
    const authorization = session.get("authorization");

    if (!profile || !authorization) {
        return redirect("/login");
    }

    // Add ID and timestamps to the post
    const now = new Date().toISOString();
    const newPost = {
        ...data,
        id: uuid(),
        datetimeCreated: now,
        datetimeModified: now, // Backend requires this field too
        milestone: data.milestone || false // Ensure milestone is a boolean
    };

    // Create the post
    try {
        const result = await createPost(newPost, authorization, cookie);
        console.log("Backend response after creating post:", result);
        return { success: true, message: "Post created successfully!" };
    } catch (error) {
        console.error("Error creating post:", error);
        return { success: false, error: "Failed to create post" };
    }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { profile, wanderList, followingProfiles, posts } = loaderData ?? {};

    if (!profile) {
        redirect("/");
    }

    const { userName, email, bio, profilePicture } = profile ?? {};

    // Debug: Log posts to see what data we're getting
    console.log("Posts from backend:", posts);

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
        })
        .slice(0, 4) || [];

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
    const navigate = useNavigate();

    // Close modal and refresh data after successful submission
    useEffect(() => {
        // If there's action data and it's successful (no errors)
        if (actionData && actionData.success) {
            closePostModal();
            // Force a page reload to show the new post
            window.location.reload();
        }
    }, [actionData]);

    return (
        <>
            <div
                className="min-h-screen bg-gray-100 relative overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 py-12 w-full"
                // style={{
                //     backgroundImage:
                //         `url('https://www.transparenttextures.com/patterns/asfalt-light.png'), linear-gradient(to top right, #e0e7ff, #fef3c7)`,
                //     backgroundRepeat: "repeat, no-repeat",
                //     backgroundSize: "auto, cover",
                //     backgroundPosition: "center",
                // }}
            >
                {/* Profile header */}
                <header className="mb-12 flex flex-col sm:flex-row items-center gap-6 w-full">
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

                {/* Main grid - FULL WIDTH */}
                <section
                    className="w-full grid grid-cols-1 lg:grid-cols-4 gap-10"
                    style={{ minHeight: "70vh" }}
                >
                    {/* LEFT + MIDDLE - Wanderlist + Posts */}
                    <div className="lg:col-span-3 space-y-10">
                        <WanderList wanderList={wanderList}/>

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

                            {/* Post Cards Grid */}
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
                                <div className="grid gap-6 md:grid-cols-2">
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
                                                <span suppressHydrationWarning>
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
                            {posts && posts.length > 4 && (
                                <div className="mt-6 text-center">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                                    >
                                        View All Posts
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

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

                            <div className="flex flex-wrap justify-start lg:grid lg:grid-cols-2 gap-4 p-2">
                                {/* Example friend cards */}
                                {followingProfiles.map(profile => (
                                    <FriendCard key={profile.id} name={profile.userName} img={profilePicture} />
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
                                <ProgressBars />
                                <ProgressBars />
                                <ProgressBars />
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

                        <Form
                            onSubmit={handleSubmit}
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
                                    {wanderList?.map((item) => (
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
                            <label className="flex items-center gap-3 cursor-pointer">
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
                            </label>

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
                    </div>
                </div>
            )}
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
        <div className="flex items-center gap-4">
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={img}
                alt={`${name} avatar`}
            />
            <div>
                <p className="font-semibold text-gray-900">{name}</p>

            </div>
        </div>
    );
} }