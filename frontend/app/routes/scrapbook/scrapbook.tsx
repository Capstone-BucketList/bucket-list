import React, { useState } from "react";
import { Button, Card } from "flowbite-react";
import { FaCameraRetro, FaHeartbeat, FaBookOpen, FaUsers, FaTimes, FaShareAlt, FaTrash } from "react-icons/fa";
import { DivSlider } from "~/components/div_slider";
import PhotoCard from "~/components/photo-card";
import {
    groupGoalPhotos,
    healthPhotos,
    learningPhotos,
    type PhotoData
} from "../scrapbook/photoData";

const travelPhotos: PhotoData[] = [
    { title: "Balloon Fiesta", description: "hot air balloon view.", imageSrc: "/scrapbook/img_4.png" },
    { title: "Sandia Mountain hike", description: "Hiking open trails up the mountain.", imageSrc: "/scrapbook/img_5.png" },
    { title: "Road trip on route 66", description: "Driving west for 10 days on route 66.", imageSrc: "/scrapbook/img_6.png" },
    { title: "Backpacking Europe", description: "much more scenery while hiking.", imageSrc: "/scrapbook/img_16.png" },
    { title: "Hawaii Beaches", description: "Relaxing on the sandy shores.", imageSrc: "/scrapbook/img_17.png" },
    { title: "San Francisco", description: "hilltop views of Alcatraz", imageSrc: "/scrapbook/img_18.png" },
    { title: "South Lake Tahoe", description: "snow mountains and lake views", imageSrc: "/scrapbook/img_19.png" },
];

export const timelinePhotos: PhotoData[] = [
    { title: "Month 1 — Start of the journey", description: "First week exploring new places.", imageSrc: "/timeline/img.png" },
    { title: "Month 1 — Sandia Peak", description: "Breathtaking hikes early on.", imageSrc: "/timeline/img_1.png" },
    { title: "Month 2 — Community project", description: "Joined the neighborhood cleanup.", imageSrc: "/timeline/img_2.png" },
    { title: "Month 2 — Bootcamp progress", description: "Building the Wanderlist app.", imageSrc: "/timeline/img_3.png" },
    { title: "Month 2 — New friendships", description: "Met amazing people along the way.", imageSrc: "/timeline/img_4.png" },
    { title: "Month 3 - Foodie experience", description: "Red or Green options ", imageSrc: "/timeline/img_5.png"},
    { title: "Month 3 — First album creation", description: "Organizing memories into albums.", imageSrc: "/timeline/img_6.png" },
    { title: "Month 3 — Sharing moments", description: "Sharing photos with friends and family.", imageSrc: "/timeline/img_7.png" },
    { title: "Month 4 — Reflecting on the journey", description: "Looking back at all the memories made.", imageSrc: "/timeline/img_8.png" },
    { title: "Month 4 — New adventures", description: "Planning the next chapter of the journey.", imageSrc: "/timeline/img_9.png" },
    { title: "Month 5 - Soda rock trip", description: "see running river and wilderness ", imageSrc: "/timeline/img_10.png"},
    { title: "Month 5 — Celebrating milestones", description: "Celebrating the progress and growth.", imageSrc: "/timeline/img_11.png" },
    { title: "Month 5 — Looking forward", description: "Excited for the next adventures ahead.", imageSrc: "/timeline/img_12.png" },
    { title: "Month 5 — Sharing the story", description: "Sharing the journey with the world.", imageSrc: "/timeline/img_13.png" },
    { title: "Month 6 — Tent Rocks", description: "Setting new goals for the next phase.", imageSrc: "/timeline/img_14.png" },
    { title: "Month 6 — Autumn Santa Fe", description: "Reflecting on an incredible year of Wanderlist.", imageSrc: "/timeline/img_15.png" },
    { title: "Month 6 — Volcano hike", description: "Excited for the next chapter of the journey.", imageSrc: "/timeline/img_16.png" },
    { title: "Month 6 — Sharing the chile", description: "Sharing the aroma with friends and family.", imageSrc: "/timeline/img_17.png" },
    { title: "Month 6 — Final reflections", description: "Grateful for the incredible journey and memories made.", imageSrc: "/timeline/img_18.png" },
];

type AlbumData = {
    id: string;
    title: string;
    createdAt: Date;
    coverImage?: string;
    description?: string;
    photoCount?: number;
};

export default function Scrapbook() {
    const [activeCard, setActiveCard] = useState<PhotoData | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);

    const [newAlbumTitle, setNewAlbumTitle] = useState("");
    const [newAlbumDescription, setNewAlbumDescription] = useState("");

    // Handlers
    const openAlbum = (id: string) => {
        console.log("Opening album:", id);
    };

    const onPhotoClick = (photo: PhotoData) => {
        setActiveCard(photo);
    };

    const handleCreateNewAlbum = () => {
        const newAlbum: AlbumData = {
            id: crypto.randomUUID(),
            title: `New Album ${albums.length + 1}`,
            createdAt: new Date(),
            coverImage: "/placeholder.jpg",
            description: newAlbumDescription || "",
            photoCount: 0
        };

        setAlbums([newAlbum, ...albums]);
        setNewAlbumTitle("");
        setNewAlbumDescription("")
    };

    const [showTimelineModal, setShowTimelineModal] = useState(false);

    return (


        <main className="w-full min-h-screen bg-gray-100 pb-20">

            {/* HERO SECTION */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold">Your Collection of Memories</h1>
                    <p className="text-lg mt-4 opacity-90 max-w-2xl mx-auto">
                        Explore your favorite moments and inspirations captured along your journey.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT GRID */}
            <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 mt-12">

                {/* LEFT PHOTO FEED */}
                <div className="lg:col-span-9 flex flex-col gap-8">

                    { /*create new album location*/}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <h2 className="text-3xl font-extrabold mb-4">Create New Album</h2>
                        {albums.length === 0 ? (
                            <p className="text-gray-600">No albums yet. Start your first one!</p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {albums.map(album => (
                                        <li key={album.id} className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer">
                                            <p className="font-semibold">{album.title}</p>
                                            <p className="text-xs text-gray-500">{album.photoCount ?? 0} photos</p>
                                        </li>
                                    ))}
                                </ul>
                        )}
                    </Card>

                    {/* — Travel — */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaCameraRetro className="text-indigo-600 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Travel Memories</h2>
                        </div>
                        <DivSlider photo={travelPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                        <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white w-full">
                            Explore Travel
                        </Button>
                    </Card>

                    {/* — Health — */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaHeartbeat className="text-red-500 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Health & Fitness</h2>
                        </div>
                        <DivSlider photo={healthPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                        <Button className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 text-white w-full">
                            Explore Health
                        </Button>
                    </Card>

                    {/* — Learning — */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaBookOpen className="text-yellow-500 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Learning</h2>
                        </div>
                        <DivSlider photo={learningPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                        <Button className="mt-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white w-full">
                            Explore Learning
                        </Button>
                    </Card>

                    {/* — Groups — */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaUsers className="text-green-600 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Group Goals</h2>
                        </div>
                        <DivSlider photo={groupGoalPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                        <Button className="mt-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white w-full">
                            Explore Groups
                        </Button>
                    </Card>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {/* Featured Albums */}
                    <Card className="p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Featured Albums</h2>

                        {albums.length === 0 ? (
                            <p className="text-gray-600 text-sm">No albums yet. Start your first one!</p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {albums.map((album) => (
                                    <li
                                        key={album.id}
                                        className="p-3 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
                                        onClick={() => openAlbum(album.id)}
                                    >
                                        <p className="font-semibold">{album.title}</p>
                                        <p className="text-xs text-gray-500">{album.photoCount} photos</p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Button
                            className="mt-4 bg-indigo-600 w-full text-white"
                            onClick= {handleCreateNewAlbum}
                        >
                            Create New Album
                        </Button>
                    </Card>

                    {/* -create new album location - */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {albums.map(album => (
                            <PhotoCard
                                key={album.id}
                                title={album.title}
                                description={`Created: ${album.createdAt.toDateString()}`}
                                imageSrc={album.coverImage}
                                onClick={() => setActiveCard(album)}
                            />
                        ))}
                    </div>

                    {/* TIMELINE */}
                    <Card className="p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Timeline</h2>
                        <p className="text-gray-600 text-sm mb-3">
                            Every photo from your Wanderlist journey.
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                            {timelinePhotos.slice(0, 9).map((photo) => (
                                <img
                                    key={photo.imageSrc}
                                    src={photo.imageSrc}
                                    alt={photo.title}
                                    className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80"
                                    onClick={() => onPhotoClick(photo)}
                                />
                            ))}
                        </div>

                        <Button
                            className="mt-4 bg-blue-600 w-full text-white"
                            onClick={() => setShowTimelineModal(true)}>
                            View Full Timeline
                        </Button>
                    </Card>
                </div>
            </div>

            {showTimelineModal && (
                <div
                    className="fixed inset-0 backdrop-blur-sm flex flex-col items-center justify-start overflow-y z-[999] p-6"
                    role="dialog"
                    aria-modal="true">
                    <button
                        onClick={() => setShowTimelineModal(false)}
                        className="ml-auto mb-4 text-amber-400 text-6xl font-bold"
                        aria-label="Close Timeline Modal"
                    >
                        <FaTimes className="text-amber-400" size={28} />
                    </button>

                    <div className="w-full max-w-5xl">
                        <h2 className="text-white text-4xl mb-6 text-center font-bold">Timeline</h2>
                        <DivSlider photo={timelinePhotos} wanderListProp={[]} onPhotoClick={() => {}} />
                    </div>
                </div>
            )}


            {/* ACTIVE PHOTO MODAL */}
            {activeCard && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-opacity-30">
                    <Card className="max-w-3xl w-full p-6 relative shadow-lg">
                        <button
                            onClick={() => setActiveCard(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
                            aria-label="Close Photo Modal">
                            <FaTimes />
                        </button>

                        <img
                            src={activeCard.imageSrc}
                            alt={activeCard.altText || activeCard.title}
                            className="w-full h-auto rounded mb-4 max-h-[75vh] object-contain"
                        />

                        <input
                            type="text"
                            value={activeCard.title}
                            onChange={(e) => setActiveCard({ ...activeCard, title: e.target.value })}
                            className="w-full mb-2 text-2xl font-bold border border-gray-300 rounded px-3 py-1"
                        />

                        <textarea
                            value={activeCard.description}
                            onChange={(e) =>
                                setActiveCard({ ...activeCard, description: e.target.value })
                            }
                            rows={3}
                            className="w-full mb-6 border border-gray-300 rounded px-3 py-2"
                        />

                        <div className="flex gap-4">
                            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                                Submit Changes
                            </Button>

                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2"
                                onClick={() =>
                                    navigator.share
                                        ? navigator.share({
                                            title: activeCard.title,
                                            text: activeCard.description,
                                            url: window.location.href
                                        })
                                        : alert("Sharing not supported")}>
                                <FaShareAlt/> Share
                            </Button>

                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center gap-2"
                                onClick={() => {
                                    if (confirm("Delete this photo?")) setActiveCard(null);
                                }}>
                                <FaTrash /> Delete
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </main>
    );
}
