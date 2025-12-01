import React, { useEffect, useState } from "react";
import { Button, Card, Avatar, TextInput, Textarea } from "flowbite-react";
import {
    FaUsers,
    FaHeart,
    FaComment,
    FaCompass,
    FaPlusCircle,
    FaStar,
    FaLightbulb,
    FaLayerGroup,
    FaPhotoVideo,
} from "react-icons/fa";
import {useLoaderData, Form, redirect, useActionData} from "react-router";
import type {Route} from "../../../.react-router/types/app/routes/profile/+types/dashboard";
import {getSession} from "~/utils/session.server";
import {getPublicProfiles} from "~/utils/models/profile.model";
import {type Follow, FollowSchema, postFollow} from "~/utils/models/follow.model";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FriendCard} from "~/routes/profile/friendcard";

const SHARED_STORIES_WANDERLIST_ID = "019abba2-6835-709a-bf6a-777a4b24da68";

export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie)

    const profile = session.get("profile");
    const authorization = session.get("authorization");


    if (!profile || !authorization || !cookie) {
        return redirect("/login");
    }
    const publicProfiles = await getPublicProfiles(profile.id,authorization, cookie)

    return {publicProfiles}
}


export async function action({ request }: Route.ActionArgs) {

    const formData = await request.formData();
    const followedProfileId = formData.get("followedProfileId");
console.log(followedProfileId);
    if(!followedProfileId){
        return "select profile"
    }
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const profile = session.get("profile");
    const authorization = session.get("authorization");

    if (!profile || !authorization) return redirect("/login");

    const response = await postFollow(followedProfileId,authorization,cookie)

    console.log(response)
    return {status:200, data:response}

}

//
// export async function loader() {
//     try {
//         const response = await fetch("http://localhost:5500/apis/post/visible/posts", {
//             credentials: "include",
//         });
//
//         if (!response.ok) {
//             throw new Response("Failed to load posts", { status: response.status });
//         }
//
//         const data = await response.json();
//
//         const filtered = (data ?? []).filter(
//             (p: any) => p.wanderlistId === SHARED_STORIES_WANDERLIST_ID
//         );
//
//         return filtered.map((p: any) => ({
//             id: p.id,
//             title: p.title,
//             content: p.content,
//             userName: "User", // Replace if you have actual user info
//             dateCreated: p.datetimeCreated,
//         }));
//     } catch (error) {
//         // Optionally return an error object here or throw
//         throw new Response("Failed to fetch shared stories", { status: 500 });
//     }
// }
//
// function validateFormData(title: any, content: any) {
//     const errors: Record<string, string> = {};
//     if (!title || typeof title !== "string" || title.trim() === "") {
//         errors.title = "Title is required";
//     }
//     if (!content || typeof content !== "string" || content.trim() === "") {
//         errors.content = "Content is required";
//     }
//     return errors;
// }

// export async function action({ request }: { request: Request }) {
//     const formData = await request.formData();
//     const title = formData.get("title");
//     const content = formData.get("content");
//
//     const errors = validateFormData(title, content);
//
//     if (Object.keys(errors).length > 0) {
//         // Return errors and form values so UI can display validation messages and keep inputs
//         return { errors, defaultValues: { title, content } };
//     }
//
//     const response = await fetch("http://localhost:5500/apis/post", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//             id: crypto.randomUUID(),
//             wanderlistId: SHARED_STORIES_WANDERLIST_ID,
//             title,
//             content,
//             visibility: "public",
//         }),
//     });
//
//     if (!response.ok) {
//         throw new Response("Failed to post story", { status: 500 });
//     }
//
//     // Redirect to reload the page and run the loader again to get fresh data
//     return redirect("/community");
// }


interface Profile {
    id: number;
    name: string;
    avatarUrl: string;
}

interface Media {
    url: string;
}

interface Post {
    id: number;
    user: Profile;
    content: string;
    createdAt: string;
    media: Media[];
    commentsCount: number;
    likes: number;
}

interface Wanderlist {
    id: number;
    title: string;
    image: string;
}

interface FollowSuggestion {
    id: number;
    name: string;
    avatarUrl: string;
}

interface InspirationItem {
    id: number;
    title: string;
    icon: JSX.Element;
    description: string;
}

interface SharedStory {
    id: string;
    title: string;
    content: string;
    userName: string;
    dateCreated: string;
}


const resolver =  zodResolver(FollowSchema)

export default function Community({ loaderData }: Route.ComponentProps) {
    const { publicProfiles } = loaderData ?? {};
    const {handleSubmit, formState: {errors}, register} = useRemixForm<Follow>({mode: 'onSubmit', resolver})
    const actionData = useActionData<typeof action>();

    // Static data states
    const [posts, setPosts] = useState<Post[]>([]);
    const [wanderlist, setWanderlist] = useState<Wanderlist[]>([]);
    const [suggestions, setSuggestions] = useState<FollowSuggestion[]>([]);
    const [inspiration, setInspiration] = useState<InspirationItem[]>([]);

    // Shared stories from loader
    const sharedStories = useLoaderData() as SharedStory[] | null | undefined;

    const stories = Array.isArray(sharedStories) ? sharedStories : [];

    useEffect(() => {
        setPosts([
            {
                id: 1,
                user: { id: 101, name: "Ava Carter", avatarUrl: "https://i.pravatar.cc/150?img=32" },
                content: "Exploring the mountains this weekend! 🏔️✨",
                createdAt: "2025-02-01",
                media: [{ url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" }],
                commentsCount: 12,
                likes: 87,
            },
            {
                id: 2,
                user: { id: 102, name: "Daniel Kim", avatarUrl: "https://i.pravatar.cc/150?img=58" },
                content: "Learning to cook new recipes! 🍜🔥",
                createdAt: "2025-02-02",
                media: [{ url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" }],
                commentsCount: 5,
                likes: 32,
            },
            {
                id: 3,
                user: { id: 103, name: "Sophia Martinez", avatarUrl: "https://i.pravatar.cc/150?img=47" },
                content: "Just joined a writing challenge ✍🏼📚",
                createdAt: "2025-02-03",
                media: [],
                commentsCount: 8,
                likes: 49,
            },
        ]);

        setWanderlist([
            { id: 1, title: "Visit Iceland", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
            { id: 2, title: "Build Fitness Routine", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b" },
            { id: 3, title: "Learn Guitar", image: "https://images.unsplash.com/photo-1511376777868-611b54f68947" },
        ]);

        setSuggestions([
            { id: 201, name: "Mia Thompson", avatarUrl: "https://i.pravatar.cc/150?img=21" },
            { id: 202, name: "Lucas Rivera", avatarUrl: "https://i.pravatar.cc/150?img=12" },
            { id: 203, name: "Ella Johnson", avatarUrl: "https://i.pravatar.cc/150?img=65" },
        ]);

        setInspiration([
            {
                id: 1,
                title: "Friends & Family",
                icon: <FaLayerGroup className="text-indigo-600 text-3xl" />,
                description:
                    "Your biggest supporters and cheerleaders. Share goals, celebrate wins, and stay accountable together.",
            },
            {
                id: 2,
                title: "Share Your Wins",
                icon: <FaStar className="text-yellow-500 text-3xl" />,
                description: "Accomplishments motivate progress. Capture your moments and inspire others with your journey!",
            },
            {
                id: 3,
                title: "Document Your Journey",
                icon: <FaPhotoVideo className="text-pink-500 text-3xl" />,
                description: "Photos and videos help track your memories. WanderList lets you save everything in one place.",
            },
            {
                id: 4,
                title: "Vision Boards",
                icon: <FaLightbulb className="text-amber-400 text-3xl" />,
                description: "Post-its, digital cards, goals by category—organize and visualize what you want to achieve.",
            },
        ]);
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-100 pb-20">
            {/* HERO SECTION */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold">Community Feed</h1>
                    <p className="text-lg mt-4 opacity-90 max-w-2xl mx-auto">
                        Explore what your community is achieving, posting, and sharing.
                    </p>
                </div>
            </section>

            {/* INSPIRATION SECTION */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">Inspiration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {inspiration.map((item) => (
                        <Card key={item.id} className="p-6 shadow-md hover:shadow-xl transition">
                            <div className="flex flex-col items-center text-center gap-4">
                                {item.icon}
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* SHARED STORIES SECTION */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">Shared Stories</h2>

                <Form method="post" className="mb-10 max-w-xl mx-auto flex flex-col gap-4">
                    <TextInput name="title" placeholder="Title" required />
                    <Textarea name="content" placeholder="Write your story here..." required rows={4} />
                    <Button type="submit">Story submission temporarily disabled — coming soon!</Button>
                </Form>

                <div className="space-y-6 max-w-xl mx-auto">
                    {stories.length === 0 &&
                      <p>No shared stories yet. Be the first!</p>}
                    {stories.map((story) => (
                        <Card key={story.id} className="shadow-md">
                            <h3 className="text-xl font-bold">{story.title}</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{story.content}</p>
                            <div className="text-sm text-gray-500 mt-2">
                                By <strong>{story.userName}</strong> on {new Date(story.dateCreated).toLocaleDateString()}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* MAIN GRID LAYOUT (FEED + SIDEBAR) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                {/* FEED */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {posts.map((post) => (
                        <Card key={post.id} className="shadow-md hover:shadow-lg transition p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar img={post.user.avatarUrl} rounded />
                                <div>
                                    <h3 className="font-bold">{post.user.name}</h3>
                                    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <p className="mb-4">{post.content}</p>

                            {post.media.length > 0 && (
                                <img
                                    src={post.media[0].url}
                                    alt="post-media"
                                    className="rounded-lg max-h-80 w-full object-cover"
                                />
                            )}

                            <div className="flex justify-between mt-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <FaHeart className="text-red-500" /> {post.likes}
                </span>
                                <span className="flex items-center gap-2">
                  <FaComment /> {post.commentsCount} comments
                </span>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Wander Goals */}
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Featured Wanderlist</h2>
                        <div className="flex flex-col gap-4">
                            {wanderlist.map((g) => (
                                <div key={g.id} className="flex items-center gap-3">
                                    <img src={g.image} className="w-20 h-20 rounded-lg object-cover" />
                                    <p className="font-semibold">{g.title}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Follow Suggestions */}
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Suggested for You</h2>
                        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                            {publicProfiles?.map((profile) => (
                               /* <Form  action="follow"
                                       noValidate={true}
                                       method={'POST'}
                                       className="space-y-4 md:space-y-6" >
                                    <input type="hidden" name="followedProfileId" value={profile.id} />
                                <div
                                     id={profile.id}
                                     className="flex items-center justify-between gap-3">
                                    <Avatar img={profile.profilePicture} rounded />
                                    <p className="font-semibold">{profile.userName}</p>
                                   {/!* <Button size="xs" color="info">
                                        Follow
                                    </Button>*!/}
                                    <button type="submit" color="info">Follow</button>
                                </div>
                                </Form>*/

                                    <FriendCard profile={profile} isFriend={false} />

                            ))}
                        </div>
                    </Card>

                    {/* Explore */}
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Explore</h2>
                        <div className="flex flex-col gap-4">
                            <Button className="bg-indigo-600 flex items-center gap-2">
                                <FaCompass /> Discover Groups
                            </Button>
                            <Button className="bg-purple-600 flex items-center gap-2">
                                <FaPlusCircle /> Create New Goal
                            </Button>
                            <Button className="bg-blue-600 flex items-center gap-2">
                                <FaUsers /> Your Network
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
