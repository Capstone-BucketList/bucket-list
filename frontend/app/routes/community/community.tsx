import React, { useEffect, useState, type ReactNode} from "react";
import { Button, Card, Avatar } from "flowbite-react";
import { Modal } from "flowbite-react";
import {
    FaUsers,
    FaHeart,
    FaComment,
    FaCompass,
    FaPlusCircle,
    FaStar,
    FaLightbulb,
    FaLayerGroup,
    FaPhotoVideo
} from "react-icons/fa";
import { TripCard, BucketListExamplesSection} from "~/components/Example-trips";

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
    icon: ReactNode;
    description: string;
}

interface Story {
    id: number;
    user: Profile;
    text: string;
    image?: string;
    category: string;
    createdAt: string;
}

export default function Community() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [wanderlist, setWanderlist] = useState<Wanderlist[]>([]);
    const [suggestions, setSuggestions] = useState<FollowSuggestion[]>([]);
    const [inspiration, setInspiration] = useState<InspirationItem[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [showStoryModal, setShowStoryModal] = useState(false);
    const [newStoryText, setNewStoryText] = useState("");
    const [newStoryImage, setNewStoryImage] = useState("");
    const [newStoryCategory, setNewStoryCategory] = useState("General");

    // ===== STATIC DATA =====
    useEffect(() => {
        setPosts([
            {
                id: 1,
                user: {id: 101, name: "Ava Carter", avatarUrl: "https://i.pravatar.cc/150?img=32"},
                content: "Exploring the mountains this weekend! 🏔️✨",
                createdAt: "2025-02-01",
                media: [{url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"}],
                commentsCount: 12,
                likes: 87
            },
            {
                id: 2,
                user: {id: 102, name: "Daniel Kim", avatarUrl: "https://i.pravatar.cc/150?img=58"},
                content: "Learning to cook new recipes! 🍜🔥",
                createdAt: "2025-02-02",
                media: [{url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836"}],
                commentsCount: 5,
                likes: 32
            },
            {
                id: 3,
                user: {id: 103, name: "Sophia Martinez", avatarUrl: "https://i.pravatar.cc/150?img=47"},
                content: "Just joined a writing challenge ✍🏼📚",
                createdAt: "2025-02-03",
                media: [],
                commentsCount: 8,
                likes: 49
            },
        ]);

        setStories([
            {
                id: 1,
                user: {id: 555, name: "Bobby Manuelito", avatarUrl: ""},
                text: "Just completed my first 5K run! Feeling amazing! Never did I think I could complete such a distance. Wanderlist motivated me in other tasks and now I'm able to run this distance. 🏃‍♂️💨",
                image: "http://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                category: "healthy living",
                createdAt: "2025-11-11"
            }
        ]);

        setWanderlist([
            {id: 1, title: "Visit Iceland", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"},
            {
                id: 2,
                title: "Build Fitness Routine",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
            },
            {id: 3, title: "Learn Guitar", image: "https://images.unsplash.com/photo-1511376777868-611b54f68947"},
        ]);

        setSuggestions([
            {id: 201, name: "Mia Thompson", avatarUrl: "https://i.pravatar.cc/150?img=21"},
            {id: 202, name: "Lucas Rivera", avatarUrl: "https://i.pravatar.cc/150?img=12"},
            {id: 203, name: "Ella Johnson", avatarUrl: "https://i.pravatar.cc/150?img=65"},
        ]);

        // NEW: Inspiration Cards
        setInspiration([
            {
                id: 1,
                title: "Friends & Family",
                icon: <FaLayerGroup className="text-indigo-600 text-3xl"/>,
                description:
                    "Your biggest supporters and cheerleaders. Share goals, celebrate wins, and stay accountable together."
            },
            {
                id: 2,
                title: "Share Your Wins",
                icon: <FaStar className="text-yellow-500 text-3xl"/>,
                description:
                    "Accomplishments motivate progress. Capture your moments and inspire others with your journey!"
            },
            {
                id: 3,
                title: "Document Your Journey",
                icon: <FaPhotoVideo className="text-pink-500 text-3xl"/>,
                description:
                    "Photos and videos help track your memories. WanderList lets you save everything in one place."
            },
            {
                id: 4,
                title: "Vision Boards",
                icon: <FaLightbulb className="text-amber-400 text-3xl"/>,
                description:
                    "Post-its, digital cards, goals by category—organize and visualize what you want to achieve."
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
                <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
                    Inspiration
                </h2>

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

            {/* example trips */}
            <BucketListExamplesSection/>

            {/*Story Sharing from Users*/}
            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-indigo-700">Community Stories</h2>
                    <Button
                        className="bg-amber-500 text-white"
                        onClick={() => setShowStoryModal(true)}>
                        Share a Story
                    </Button>
                </div>

                <div className="flex gap-6 overflow-y-visible overflow-x-auto pb-4">
                    {stories.map((s) => (
                        <Card key={s.id} className="min-w-[260px] shadow-md">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar img={s.user.avatarUrl} rounded/>
                                <div>
                                    <p className="font-bold">{s.user.name}</p>
                                    <p className="text-xs text-gray-500">{s.category}</p>
                                </div>
                            </div>

                            <p className="mb-2 text-gray-700">{s.text}</p>

                            {s.image && (
                                <img
                                    src={s.image}
                                    alt="story"
                                    className="rounded-lg h-40 w-full object-cover"
                                />
                            )}
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
                                <Avatar img={post.user.avatarUrl} rounded/>
                                <div>
                                    <h3 className="font-bold">{post.user.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
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
                  <FaHeart className="text-red-500"/> {post.likes}
                </span>
                                <span className="flex items-center gap-2">
                  <FaComment/> {post.commentsCount} comments
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
                                    <img src={g.image} className="w-20 h-20 rounded-lg object-cover"/>
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
                                    <div className="flex items-center gap-3">
                                        <Avatar img={u.avatarUrl} rounded/>
                                        <p className="font-semibold">{u.name}</p>
                                    </div>
                                    <Button size="xs" color="info">Follow</Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Explore */}
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Explore</h2>
                        <div className="flex flex-col gap-4">
                            <Button className="bg-indigo-600 flex items-center gap-2">
                                <FaCompass/> Discover Groups
                            </Button>
                            <Button className="bg-purple-600 flex items-center gap-2">
                                <FaPlusCircle/> Create New Goal
                            </Button>
                            <Button className="bg-blue-600 flex items-center gap-2">
                                <FaUsers/> Your Network
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>


    {/* STORY MODAL */
    }
    {
        showStoryModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-lg p-6 relative">

                    <button
                        className="absolute top-2 right-2 text-2xl"
                        onClick={() => setShowStoryModal(false)}>
                        &times;
                    </button>

                    <h3 className="text-xl font-bold mb-4">Share Your Story</h3>

                    <textarea
                        className="w-full border rounded p-2 mb-4"
                        rows={4}
                        placeholder="Write your story..."
                        value={newStoryText}
                        onChange={(e) => setNewStoryText(e.target.value)}/>

                    <input
                        type="text"
                        className="w-full border rounded p-2 mb-4"
                        placeholder="Image URL (optional)"
                        value={newStoryImage}
                        onChange={(e) => setNewStoryImage(e.target.value)}/>

                    <select
                        className="w-full border rounded p-2 mb-4"
                        value={newStoryCategory}
                        onChange={(e) => setNewStoryCategory(e.target.value)}>
                        <option>Travel</option>
                        <option>Learning</option>
                        <option>Health</option>
                        <option>Group Goals</option>
                    </select>

                    <Button
                        className="bg-indigo-600 w-full text-white"
                        onClick={() => {
                            const newStory: Story = {
                                id: Date.now(),
                                user: {
                                    id: 999,
                                    name: "You",
                                    avatarUrl: "https://i.pravatar.cc/150?img=3",
                                },
                                text: newStoryText,
                                image: newStoryImage,
                                category: newStoryCategory,
                                createdAt: new Date().toISOString(),
                            };

                            setStories([newStory, ...stories]);
                            setShowStoryModal(false);
                            setNewStoryText("");
                            setNewStoryImage("");
                        }}>
                        Post Story
                    </Button>
                </Card>
            </div>
        )}
        </div>
);
}

