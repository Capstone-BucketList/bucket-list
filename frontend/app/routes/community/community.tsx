import { useEffect, useState} from "react";
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
import { useLoaderData, Form, redirect } from "react-router";
import type { Route } from "../../.react-router/types/app/routes/+types/community";
import { getSession } from "~/utils/session.server";
import { PostCreationForm } from "~/components/post-creation-form";

const SHARED_STORIES_WANDERLIST_ID = "019abba2-6835-709a-bf6a-777a4b24da68";

export async function loader({ request }: Route.LoaderArgs) {
    const cookie = request.headers.get('Cookie');
    const session = await getSession(cookie);
    const authorization = session.get('authorization');
    const profile = session.get('profile');

    if (!profile || !authorization || !cookie) {
        return redirect('/login');
    }

    // Fetch all visible posts with media
    let posts = [];
    try {
        const postsResponse = await fetch('http://eric.ddfullstack.cloud:8080/apis/post/visible/posts', {
            headers: {
                'Authorization': `Bearer ${authorization}`,
                'Cookie': cookie,
            },
            credentials: 'include',
        });

        if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            const postsArray = postsData.data || [];

            // Fetch media for each post
            for (const post of postsArray) {
                try {
                    const mediaResponse = await fetch(`http://eric.ddfullstack.cloud:8080/apis/media/post/${post.id}`, {
                        headers: {
                            'Authorization': `Bearer ${authorization}`,
                            'Cookie': cookie,
                        },
                        credentials: 'include',
                    });

                    if (mediaResponse.ok) {
                        const mediaData = await mediaResponse.json();
                        post.media = mediaData.data || [];
                    } else {
                        post.media = [];
                    }
                } catch (error) {
                    console.error('Failed to fetch media for post:', error);
                    post.media = [];
                }
            }

            posts = postsArray;
        }
    } catch (error) {
        console.error('Failed to load posts:', error);
    }

    return { profile, authorization, cookie, posts, profileId: profile?.id };
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
    id?: string;
    postId?: string;
}

interface Post {
    id: string;
    wanderlistId?: string;
    title: string;
    content: string;
    visibility: string;
    datetimeCreated?: string;
    datetimeModified?: string;
    media?: Media[];
    user?: Profile;
    createdAt?: string;
    commentsCount?: number;
    likes?: number;
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

export default function Community() {
    // Static data states
    const [posts, setPosts] = useState<Post[]>([]);
    const [wanderlist, setWanderlist] = useState<Wanderlist[]>([]);
    const [suggestions, setSuggestions] = useState<FollowSuggestion[]>([]);
    const [inspiration, setInspiration] = useState<InspirationItem[]>([]);

    // Load auth data and posts from loader
    const { authorization, cookie, posts: loaderPosts, profileId } = useLoaderData<typeof loader>();

    const stories: SharedStory[] = [];

    useEffect(() => {
        // Use real posts from loader if available, otherwise use static data
        if (loaderPosts && loaderPosts.length > 0) {
            // Map backend posts to frontend format
            setPosts(loaderPosts.map((post: any) => ({
                id: post.id,
                wanderlistId: post.wanderlist_id,
                title: post.title || 'Untitled',
                content: post.content || '',
                visibility: post.visibility,
                datetimeCreated: post.datetime_created,
                media: post.media || [],
            })));
        } else {
            // Fallback to static demo data
            setPosts([
                {
                    id: "1",
                    title: "Exploring the mountains",
                    content: "Exploring the mountains this weekend! 🏔️✨",
                    visibility: "public",
                    datetimeCreated: "2025-02-01",
                    media: [{ url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" }],
                    user: { id: 101, name: "Ava Carter", avatarUrl: "https://i.pravatar.cc/150?img=32" },
                    commentsCount: 12,
                    likes: 87,
                },
                {
                    id: "2",
                    title: "Learning to cook",
                    content: "Learning to cook new recipes! 🍜🔥",
                    visibility: "public",
                    datetimeCreated: "2025-02-02",
                    media: [{ url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" }],
                    user: { id: 102, name: "Daniel Kim", avatarUrl: "https://i.pravatar.cc/150?img=58" },
                    commentsCount: 5,
                    likes: 32,
                },
            ]);
        }

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

            {/* POST CREATION SECTION */}
            <section className="max-w-3xl mx-auto px-6 py-16">
                <PostCreationForm
                    authorization={authorization}
                    cookie={cookie}
                    profileId={profileId}
                    onSuccess={() => {
                        // Optional: Refresh posts or show success message
                        console.log('Post created successfully');
                    }}
                />
            </section>

            {/* MAIN GRID LAYOUT (FEED + SIDEBAR) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                {/* FEED */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {posts.length === 0 ? (
                        <Card className="shadow-md p-6 text-center">
                            <p className="text-gray-600">No posts yet. Be the first to share your journey!</p>
                        </Card>
                    ) : (
                        posts.map((post) => (
                            <Card key={post.id} className="shadow-md hover:shadow-lg transition p-4">
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {post.datetimeCreated
                                            ? new Date(post.datetimeCreated).toLocaleDateString()
                                            : 'Recently'}
                                    </p>
                                </div>

                                <p className="mb-4 text-gray-700">{post.content}</p>

                                {post.media && post.media.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {post.media.map((media, index) => (
                                            <img
                                                key={index}
                                                src={media.url}
                                                alt={`post-media-${index}`}
                                                className="rounded-lg max-h-80 w-full object-cover"
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between mt-4 text-gray-600 text-sm">
                                    <span className="flex items-center gap-2">
                                        <FaHeart className="text-red-500" /> {post.likes || 0}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <FaComment /> {post.commentsCount || 0} comments
                                    </span>
                                </div>
                            </Card>
                        ))
                    )}
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
                        <div className="flex flex-col gap-4">
                            {suggestions.map((u) => (
                                <div key={u.id} className="flex items-center justify-between gap-3">
                                    <Avatar img={u.avatarUrl} rounded />
                                    <p className="font-semibold">{u.name}</p>
                                    <Button size="xs" color="info">
                                        Follow
                                    </Button>
                                </div>
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
