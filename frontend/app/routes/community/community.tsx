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
import { useLoaderData, Form, redirect, Link } from "react-router";
import type { Route } from "../../.react-router/types/app/routes/+types/community";
import { getSession } from "~/utils/session.server";
import { PostCreationForm } from "~/components/post-creation-form";
import { CommentSection } from "~/components/comment-section";
import { FollowButton } from "~/components/follow-button";
import {FriendCard} from "~/routes/profile/friendcard";
import {getPublicProfiles} from "~/utils/models/profile.model";
import { addHeaders } from "~/utils/utility";
import { createPostAction } from "./create-post-action";

const SHARED_STORIES_WANDERLIST_ID = "019abba2-6835-709a-bf6a-777a4b24da68";

export async function loader({ request }: Route.LoaderArgs) {
    const cookie = request.headers.get('Cookie');
    const session = await getSession(cookie);
    const authorization = session.get('authorization');
    const profile = session.get('profile');

    if (!profile || !authorization || !cookie) {
        return redirect('/login');
    }

    // Ensure shared stories wanderlist exists
    try {
        await fetch(`${process.env.REST_API_URL}/wanderlist/shared-stories`, {
            headers: addHeaders(authorization, cookie),
        });
    } catch (error) {
        console.error('Error ensuring shared stories wanderlist exists:', error);
    }

    const publicProfiles = await getPublicProfiles(profile.id,authorization, cookie)
    // Fetch all visible posts with media
    let posts = [];
    try {
        const postsResponse = await fetch(`${process.env.REST_API_URL}/post/visible/posts`, {
            headers: addHeaders(authorization, cookie),
        });

        if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            const postsArray = postsData.data || [];

            // Fetch media for each post
            for (const post of postsArray) {
                try {
                    const mediaResponse = await fetch(`${process.env.REST_API_URL}/media/post/${post.id}`, {
                        headers: addHeaders(authorization, cookie),
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

    // Fetch user's wanderlists
    let allWanderlists = [];
    let featuredWanderlists = [];
    try {
        const wanderlistsResponse = await fetch(`${process.env.REST_API_URL}/wanderlist/profile/${profile.id}`, {
            headers: addHeaders(authorization, cookie),
        });

        if (wanderlistsResponse.ok) {
            const wanderlistsData = await wanderlistsResponse.json();
            allWanderlists = wanderlistsData.data || [];
            // Get up to 3 wanderlists for featured section
            featuredWanderlists = allWanderlists.slice(0, 3);
        }
    } catch (error) {
        console.error('Failed to load wanderlists:', error);
    }


    return { profile, authorization, cookie, posts, profileId: profile?.id, featuredWanderlists, allWanderlists, publicProfiles };
}

export async function action({ request }: Route.ActionArgs) {
    if (request.method === "POST") {
        return await createPostAction(request);
    }
    return { error: "Method not allowed", status: 405 };
}

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
    id: string | number;
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

const INSPIRATION_ITEMS: InspirationItem[] = [
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
];

export default function Community() {
    // Dynamic data states
    const [posts, setPosts] = useState<Post[]>([]);
    const [wanderlist, setWanderlist] = useState<Wanderlist[]>([]);

    // Load auth data and posts from loader
    const { authorization, cookie, posts: loaderPosts, profileId, featuredWanderlists, allWanderlists, publicProfiles } = useLoaderData<typeof loader>();

    useEffect(() => {
        // Use real posts from loader
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
        }

        // Use real wanderlists from loader
        if (featuredWanderlists && featuredWanderlists.length > 0) {
            setWanderlist(featuredWanderlists.map((wl: any) => ({
                id: wl.id,
                title: wl.title,
                image: wl.coverImage || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            })));
        }
    }, [loaderPosts, featuredWanderlists]);

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
                    {INSPIRATION_ITEMS.map((item) => (
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
            <section className="max-w-7xl mx-auto px-6 py-16 bg-white">
                <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-10">Shared Stories</h2>

                {/* Share Your Story Form */}
                <div className="max-w-3xl mx-auto mb-8">
                    <Card className="p-6 bg-purple-50 border-2 border-purple-200">
                        <h3 className="text-xl font-bold text-purple-800 mb-4">Share Your Story</h3>
                        <PostCreationForm
                            authorization={authorization}
                            cookie={cookie}
                            profileId={profileId}
                            defaultWanderlistId={SHARED_STORIES_WANDERLIST_ID}
                            hideWanderlistSelector={true}
                            onSuccess={() => {
                                console.log('Shared story posted successfully');
                                // Reload the page to show new story
                                window.location.reload();
                            }}
                        />
                    </Card>
                </div>

                {/* Display Shared Stories */}
                <div className="max-w-3xl mx-auto space-y-6">
                    {posts.filter(post => post.wanderlistId === SHARED_STORIES_WANDERLIST_ID).length === 0 ? (
                        <Card className="p-6 text-center">
                            <p className="text-gray-600">No shared stories yet. Be the first to share your journey above!</p>
                        </Card>
                    ) : (
                        posts
                            .filter(post => post.wanderlistId === SHARED_STORIES_WANDERLIST_ID)
                            .map((story) => (
                                <Card key={story.id} className="shadow-md hover:shadow-lg transition p-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{story.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {story.datetimeCreated
                                            ? new Date(story.datetimeCreated).toLocaleDateString()
                                            : 'Recently'}
                                    </p>
                                    <p className="text-gray-700 whitespace-pre-line">{story.content}</p>

                                    {story.media && story.media.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {story.media.map((media, index) => (
                                                <img
                                                    key={index}
                                                    src={media.url}
                                                    alt={`story-media-${index}`}
                                                    className="rounded-lg max-h-80 w-full object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Comment Section for Shared Stories */}
                                    <CommentSection
                                        postId={story.id}
                                        authorization={authorization}
                                        cookie={cookie}
                                        currentProfileId={profileId}
                                    />
                                </Card>
                            ))
                    )}
                </div>
            </section>

            {/* POST CREATION SECTION */}
            <section className="max-w-3xl mx-auto px-6 py-16">
                <PostCreationForm
                    authorization={authorization}
                    cookie={cookie}
                    profileId={profileId}
                    wanderlists={allWanderlists}
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
                                        <FaComment /> Comments
                                    </span>
                                </div>

                                {/* Comment Section */}
                                <CommentSection
                                    postId={post.id}
                                    authorization={authorization}
                                    cookie={cookie}
                                    currentProfileId={profileId}
                                />
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
                        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
                            {publicProfiles?.map((profile) => (
                                <FriendCard key={profile.id} profile={profile} isFriend={false} />
                            ))}
                        </div>
                    </Card>

                    {/* Explore */}
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Explore</h2>
                        <div className="flex flex-col gap-4">
                            <Link to="/groups">
                                <Button className="w-full bg-indigo-600 flex items-center gap-2 justify-center">
                                    <FaCompass /> Discover Groups
                                </Button>
                            </Link>
                            <Link to="/groups">
                                <Button className="w-full bg-blue-600 flex items-center gap-2 justify-center">
                                    <FaUsers /> Your Network
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
