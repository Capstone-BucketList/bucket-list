import React, { useState } from "react";
import { Button, Card } from "flowbite-react";
import { FaCameraRetro, FaHeartbeat, FaBookOpen, FaUsers, FaShareAlt } from "react-icons/fa";
import { DivSlider } from "~/components/div_slider";
import {groupGoalPhotos, healthPhotos, learningPhotos, type PhotoData} from "../scrapbook/photoData"

const travelPhotos: PhotoData[] = [
    { title: "Balloon Fiesta", description: "hot air balloon view.", imageSrc: "/scrapbook/img_4.png" },
    { title: "Sandia Mountain hike", description: "Hiking open trails up the mountain.", imageSrc: "/scrapbook/img_5.png" },
    { title: "Road trip on route 66", description: "Driving west for 10 days on route 66.", imageSrc: "/scrapbook/img_6.png" },
    { title: "Backpacking Europe", description: "much more scenery while hiking.", imageSrc: "/scrapbook/img_16.png" },
    { title: "Hawaii Beaches", description: "Relaxing on the sandy shores.", imageSrc: "/scrapbook/img_17.png" },
    { title: "San Francisco", description: "hilltop views of Alcatraz", imageSrc: "/scrapbook/img_18.png" },
    { title: "South Lake Tahoe", description: "snow mountains and lake views", imageSrc: "/scrapbook/img_19.png" },
];

// ... similarly for healthPhotos, learningPhotos, groupGoalPhotos

export default function Scrapbook() {
    const [activeCard, setActiveCard] = useState<PhotoData | null>(null);

    return (
        <div className="w-full min-h-screen bg-gray-100 pb-20">
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
                {/* PHOTO SLIDERS FEED */}
                <div className="lg:col-span-9 flex flex-col gap-8">
                    {/* Travel Section */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaCameraRetro className="text-indigo-600 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Travel Memories</h2>
                        </div>
                        <DivSlider photo={travelPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                        <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white w-full">Explore Travel</Button>
                    </Card>

                    {/* Health & Fitness Section */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaHeartbeat className="text-red-500 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Health & Fitness</h2>
                        </div>
                        {/* Insert your Health slider here */}
                        <DivSlider photo={healthPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                        <Button className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 text-white w-full">Explore Health</Button>
                    </Card>

                    {/* Learning Section */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaBookOpen className="text-yellow-500 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Learning</h2>
                        </div>
                        <DivSlider photo={learningPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                        <Button className="mt-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white w-full">Explore Learning</Button>
                    </Card>

                    {/* Group Goals Section */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaUsers className="text-green-600 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Group Goals</h2>
                        </div>
                        <DivSlider photo={groupGoalPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                        <Button className="mt-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white w-full">Explore Groups</Button>
                    </Card>
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <Card className="p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Featured Albums</h2>
                        <p className="text-gray-600">Organize your photos by themes and memories.</p>
                        <Button className="mt-4 bg-indigo-600 w-full text-white">Create New Album</Button>
                    </Card>

                    <Card className="p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Share Your Memories</h2>
                        <p className="text-gray-600">Invite friends and family to see your scrapbook.</p>
                        <Button className="mt-4 bg-blue-600 w-full text-white flex items-center justify-center gap-2">
                            <FaShareAlt /> Share Scrapbook
                        </Button>
                    </Card>
                </div>
            </div>

            {/* ACTIVE PHOTO MODAL */}
            {activeCard && (
                <div className="fixed inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-3xl w-full p-6 relative shadow-lg">
                        <button
                            onClick={() => setActiveCard(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <img
                            src={activeCard.imageSrc}
                            alt={activeCard.altText || activeCard.title}
                            className="w-full h-auto rounded mb-4 max-h-[75vh] object-contain"
                        />
                        <h3 className="text-2xl font-bold mb-2">{activeCard.title}</h3>
                        <p className="text-gray-700 mb-6">{activeCard.description}</p>

                        <div className="flex justify-between gap-4">
                            <Button
                                onClick={() => alert("Submit feature coming soon!")}
                                className="bg-green-600 hover:bg-green-700 text-white w-full"
                            >
                                Submit Changes
                            </Button>
                            <Button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: activeCard.title,
                                            text: activeCard.description,
                                            url: window.location.href,
                                        });
                                    } else {
                                        alert("Sharing not supported on this browser.");
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                            >
                                Share
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

