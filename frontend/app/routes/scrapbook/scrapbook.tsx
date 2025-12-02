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
import { getSession } from "~/utils/session.server";
import { redirect } from "react-router";
import type { Route } from "../../.react-router/types/app/routes/scrapbook/+types/scrapbook";
import { useLoaderData } from "react-router";
import { addHeaders } from "~/utils/utility";


export async function loader({ request }: Route.LoaderArgs) {
    const cookie = request.headers.get('Cookie');
    const session = await getSession(cookie);

    const profile = session.get("profile");
    const authorization = session.get("authorization");

    if (!profile || !authorization || !cookie) {
        return redirect("/login");
    }

    return { profile, authorization, cookie };
}

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
    photos?: PhotoData[];
};

export default function Scrapbook() {
    const [activeCard, setActiveCard] = useState<PhotoData | null>(null);
    const [albums, setAlbums] = useState<AlbumData[]>([]);
    const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState("");
    const [newAlbumDescription, setNewAlbumDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPhotoGalleryModal, setShowPhotoGalleryModal] = useState(false);
    const [selectedPhotosForAlbum, setSelectedPhotosForAlbum] = useState<PhotoData[]>([]);
    const [photoSelectionMode, setPhotoSelectionMode] = useState(false);
    const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [viewingAlbum, setViewingAlbum] = useState<AlbumData | null>(null);


    // Get auth from loader
    const { authorization, cookie } = useLoaderData<typeof loader>();

    // Load albums from localStorage on mount
    React.useEffect(() => {
        const savedAlbums = localStorage.getItem('wanderlist_albums');
        if (savedAlbums) {
            try {
                setAlbums(JSON.parse(savedAlbums));
            } catch (err) {
                console.error('Failed to parse saved albums:', err);
            }
        }
    }, []);

    // Save albums to localStorage whenever they change
    React.useEffect(() => {
        localStorage.setItem('wanderlist_albums', JSON.stringify(albums));
    }, [albums]);

    const handleSubmitChanges = async () => {
        if (!activeCard?.id || !activeCard?.wanderlistId) {
            setError("Missing post ID or wanderlist ID");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/apis/post/`, {
                method: "PUT",
                headers: addHeaders(authorization, cookie),
                body: JSON.stringify({
                    id: activeCard.id,
                    wanderlistId: activeCard.wanderlistId,
                    title: activeCard.title,
                    content: activeCard.description,
                    visibility: activeCard.visibility || "public",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update post");
            }

            const data = await response.json();

            if (data.status === 200) {
                alert("Changes saved successfully!");
                setActiveCard(null); // Close modal
            } else {
                setError(data.message || "Failed to update post");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while updating");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!activeCard?.id) {
            setError("No post ID available");
            return;
        }

        // Double confirmation for destructive action
        if (!confirm("Are you sure? This will permanently delete this photo. This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:8080/apis/post/${activeCard.id}`,
                {
                    method: "DELETE",
                    headers: addHeaders(authorization, cookie),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete photo");
            }

            const data = await response.json();

            if (data.status === 200) {
                alert("Photo deleted successfully!");
                setActiveCard(null); // Close modal
                // TODO: Remove photo from state array to update UI
            } else {
                setError(data.message || "Failed to delete photo");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while deleting");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePhotoSelection = (photo: PhotoData) => {
        const isAlreadySelected = selectedPhotosForAlbum.some(p => p.id === photo.id);

        if (isAlreadySelected) {                                                                                                                                              setSelectedPhotosForAlbum(
            selectedPhotosForAlbum.filter(p => p.id !== photo.id)
        );
            } else {
                setSelectedPhotosForAlbum([...selectedPhotosForAlbum, photo]);
        }
     };

    // Handlers
    const openAlbum = (id: string) => {
    };

    const onPhotoClick = (photo: PhotoData) => {
        setActiveCard(photo);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB');
            return;
        }

        setUploadingPhoto(true);
        setError(null);

        try {
            // Convert file to FormData for Cloudinary upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'wanderlist_scrapbook'); // Unsigned upload preset
            formData.append('folder', 'wanderlist-scrapbook-v1');

            // Upload directly to Cloudinary (client-side)
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            if (!cloudName) {
                throw new Error('Cloudinary cloud name not configured');
            }
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Failed to upload photo');
            }

            const data = await response.json();
            console.log('Upload successful:', data.secure_url);
            setUploadedPhotoUrl(data.secure_url);
            setError(null); // Clear any previous errors

            // Reset file input
            e.target.value = '';
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleCreateNewAlbumWithPhotos = () => {
        if (!newAlbumTitle.trim()) return;  // basic validation

        // Use uploaded photo as cover image, or first selected photo from collections
        const coverImage = uploadedPhotoUrl
            || (selectedPhotosForAlbum.length > 0 ? selectedPhotosForAlbum[0].imageSrc : "/placeholder.jpg");

        const newAlbum: AlbumData = {
            id: crypto.randomUUID(),
            title: newAlbumTitle.trim(),
            createdAt: new Date(),
            coverImage,
            description: newAlbumDescription.trim(),
            photoCount: selectedPhotosForAlbum.length,
            photos: selectedPhotosForAlbum
        };

        setAlbums([newAlbum, ...albums]);

        // Reset form and selections
        setNewAlbumTitle("");
        setNewAlbumDescription("");
        setSelectedPhotosForAlbum([]);
        setUploadedPhotoUrl(null);
        setShowPhotoGalleryModal(false);

        // Optional: Show success message
        alert(`Album "${newAlbum.title}" created with ${selectedPhotosForAlbum.length} photos!`);
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

                {/* LEFT EMPTY COLUMN */}
                <div className="hidden lg:block lg:col-span-1"></div>

                {/* CENTERED PHOTO FEED */}
                <div className="lg:col-span-10 flex flex-col gap-8">

                    { /*create new album location*/}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <h2 className="text-3xl font-extrabold mb-6">Create New Album</h2>

                        {/* Photo Upload Section */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-indigo-300">
                            <label className="block text-sm font-semibold mb-3">Upload a Photo</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    disabled={uploadingPhoto}
                                    id="photoInput"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="photoInput"
                                    className="flex-1 p-3 border-2 border-dashed border-indigo-300 rounded-lg text-center cursor-pointer hover:bg-indigo-50 transition disabled:opacity-50"
                                >
                                    <p className="text-sm text-gray-600">Click to select photo or drag and drop</p>
                                </label>
                                <Button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => document.getElementById('photoInput')?.click()}
                                    disabled={uploadingPhoto}
                                >
                                    {uploadingPhoto ? 'Uploading...' : 'Choose Photo'}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Max 5MB • JPG, PNG, GIF, WebP</p>

                            {uploadedPhotoUrl && (
                                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-300">
                                    <p className="text-sm font-semibold text-green-700 mb-2">✓ Photo uploaded successfully</p>
                                    <img
                                        src={uploadedPhotoUrl}
                                        alt="Uploaded preview"
                                        className="w-32 h-32 object-cover rounded border border-green-300"
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-300">
                                    <p className="text-sm font-semibold text-red-700">Error: {error}</p>
                                </div>
                            )}
                        </div>

                        {/* Album Title Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Album Title</label>
                            <input
                                type="text"
                                placeholder="Album Title"
                                value={newAlbumTitle}
                                onChange={e => setNewAlbumTitle(e.target.value)}
                                className="w-full p-2 border rounded mb-2"/>
                        </div>

                        {/* Album Description Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Album Description</label>
                            <textarea
                                placeholder="Description"
                                value={newAlbumDescription}
                                onChange={e => setNewAlbumDescription(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                                rows={3}/>
                        </div>

                        {/* Photo Selection Button */}
                        <Button
                            className="mb-4 bg-purple-600 hover:bg-purple-700 text-white w-full"
                            onClick={() => setShowPhotoGalleryModal(true)}>
                            + Select Photos for Album
                        </Button>

                        {/* Preview of Selected Photos */}
                        {selectedPhotosForAlbum.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="font-semibold text-blue-900 mb-2">
                                    {selectedPhotosForAlbum.length} Photo{selectedPhotosForAlbum.length !== 1 ? 's' : ''} Selected
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPhotosForAlbum.map((photo) => (
                                        <div key={photo.id} className="relative">
                                            <img
                                                src={photo.imageSrc}
                                                alt={photo.title}
                                                className="w-16 h-16 object-cover rounded border-2 border-blue-500"
                                                title={photo.title}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Create Album Button */}
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                            onClick={handleCreateNewAlbumWithPhotos}
                            disabled={!newAlbumTitle.trim()}>
                            Create Album
                        </Button>

                        {/* Existing albums list */}
                        {albums.length === 0 ? (
                            <p className="text-gray-600 mt-6">No albums yet. Start your first one!</p>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold mt-6 mb-3">Your Albums</h3>
                                <ul className="flex flex-col gap-3">
                                    {albums.map(album => (
                                        <li
                                            key={album.id}
                                            onClick={() => setViewingAlbum(album)}
                                            className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition">
                                            <p className="font-semibold">{album.title}</p>
                                            <p className="text-xs text-gray-500">{album.photoCount ?? 0} photos</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </Card>

                    {/* — Travel — */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaCameraRetro className="text-indigo-600 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Travel Memories</h2>
                        </div>
                        <DivSlider photo={travelPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                    </Card>

                    {/* — Health — */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaHeartbeat className="text-red-500 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Health & Fitness</h2>
                        </div>
                        <DivSlider photo={healthPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                    </Card>

                    {/* — Learning — */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaBookOpen className="text-yellow-500 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Learning</h2>
                        </div>
                        <DivSlider photo={learningPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                    </Card>

                    {/* — Groups — */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FaUsers className="text-green-600 text-3xl" />
                            <h2 className="text-3xl font-extrabold">Group Goals</h2>
                        </div>
                        <DivSlider photo={groupGoalPhotos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                    </Card>

                    {/* TIMELINE SECTION */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <h2 className="text-3xl font-extrabold mb-4">Timeline</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Every photo from your Wanderlist journey.
                        </p>

                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {timelinePhotos.slice(0, 12).map((photo) => (
                                <img
                                    key={photo.imageSrc}
                                    src={photo.imageSrc}
                                    alt={photo.title}
                                    className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                                    onClick={() => onPhotoClick(photo)}
                                    title={photo.title}
                                />
                            ))}
                        </div>

                        <Button
                            className="mt-6 bg-blue-600 w-full text-white"
                            onClick={() => setShowTimelineModal(true)}>
                            View Full Timeline
                        </Button>
                    </Card>
                </div>

                {/* RIGHT EMPTY COLUMN */}
                <div className="hidden lg:block lg:col-span-1"></div>
            </div>

            {showTimelineModal && (
                <div
                    className="fixed inset-0 backdrop-blur-sm flex flex-col items-center justify-start overflow-y z-[999] p-6"
                    role="dialog"
                    aria-modal="true">
                    <button
                        onClick={() => setShowTimelineModal(false)}
                        className="ml-auto mb-4 text-amber-400 text-6xl font-bold"
                        aria-label="Close Timeline Modal">
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
                            onClick={() => {
                                setActiveCard(null);
                                // If viewing an album, stay in album view; otherwise close everything
                                // viewingAlbum is still set, so modal stays open
                            }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
                            aria-label="Close Photo Modal">
                            <FaTimes />
                        </button>

                        <img
                            src={activeCard.imageSrc}
                            alt={activeCard.altText || activeCard.title}
                            className="w-full h-auto rounded mb-4 max-h-[75vh] object-contain"/>

                        <input
                            type="text"
                            value={activeCard.title}
                            onChange={(e) => setActiveCard({ ...activeCard, title: e.target.value })}
                            className="w-full mb-2 text-2xl font-bold border border-gray-300 rounded px-3 py-1"/>

                        <textarea
                            value={activeCard.description}
                            onChange={(e) =>
                                setActiveCard({ ...activeCard, description: e.target.value })
                            }
                            rows={3}
                            className="w-full mb-6 border border-gray-300 rounded px-3 py-2"/>

                        <div className="flex gap-4">
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmitChanges}
                                disabled={isLoading}>
                                {isLoading ? "Saving..." : "Submit Changes"}
                            </Button>

                            {/*<Button*/}
                            {/*    className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2"*/}
                            {/*    onClick={() =>*/}
                            {/*        navigator.share*/}
                            {/*            ? navigator.share({*/}
                            {/*                title: activeCard.title,*/}
                            {/*                text: activeCard.description,*/}
                            {/*                url: window.location.href*/}
                            {/*            })*/}
                            {/*            : alert("Sharing not supported")}>*/}
                            {/*    <FaShareAlt/> Share*/}
                            {/*</Button>*/}

                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center gap-2
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleDeletePhoto}
                                disabled={isLoading}>
                                <FaTrash /> {isLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* PHOTO GALLERY MODAL FOR ALBUM SELECTION */}
            {showPhotoGalleryModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[999] p-4 backdrop-blur-sm bg-black bg-opacity-50">
                    <Card className="max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-lg">
                        <button
                            onClick={() => {
                                setShowPhotoGalleryModal(false);
                                setPhotoSelectionMode(false);
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
                            aria-label="Close Gallery Modal">
                            <FaTimes />
                        </button>

                        <h2 className="text-3xl font-bold mb-6 text-center">Select Photos for Album</h2>

                        {/* Selected Photos Preview */}
                        {selectedPhotosForAlbum.length > 0 && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="font-semibold text-blue-900 mb-3">
                                    Selected Photos: {selectedPhotosForAlbum.length}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPhotosForAlbum.map((photo) => (
                                        <div key={photo.id} className="relative">
                                            <img
                                                src={photo.imageSrc}
                                                alt={photo.title}
                                                className="w-20 h-20 object-cover rounded border-2 border-blue-500"
                                            />
                                            <button
                                                onClick={() => togglePhotoSelection(photo)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600">
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery Tabs/Sections */}
                        <div className="space-y-8">
                            {/* Travel Photos Section */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-indigo-600 flex items-center gap-2">
                                    <FaCameraRetro /> Travel Memories
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {travelPhotos.map((photo) => {
                                        const isSelected = selectedPhotosForAlbum.some(p => p.id === photo.id);
                                        return (
                                            <div
                                                key={photo.id}
                                                className={`relative cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
                                                    isSelected ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300 hover:ring-blue-300'
                                                }`}
                                                onClick={() => togglePhotoSelection(photo)}>
                                                <img
                                                    src={photo.imageSrc}
                                                    alt={photo.title}
                                                    className="w-full h-20 object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                                                        <span className="text-white text-2xl font-bold">✓</span>
                                                    </div>
                                                )}
                                                <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                    {photo.title}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Health Photos Section */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
                                    <FaHeartbeat /> Health & Fitness
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {healthPhotos.map((photo) => {
                                        const isSelected = selectedPhotosForAlbum.some(p => p.id === photo.id);
                                        return (
                                            <div
                                                key={photo.id}
                                                className={`relative cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
                                                    isSelected ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300 hover:ring-blue-300'
                                                }`}
                                                onClick={() => togglePhotoSelection(photo)}>
                                                <img
                                                    src={photo.imageSrc}
                                                    alt={photo.title}
                                                    className="w-full h-20 object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                                                        <span className="text-white text-2xl font-bold">✓</span>
                                                    </div>
                                                )}
                                                <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                    {photo.title}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Learning Photos Section */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
                                    <FaBookOpen /> Learning
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {learningPhotos.map((photo) => {
                                        const isSelected = selectedPhotosForAlbum.some(p => p.id === photo.id);
                                        return (
                                            <div
                                                key={photo.id}
                                                className={`relative cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
                                                    isSelected ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300 hover:ring-blue-300'
                                                }`}
                                                onClick={() => togglePhotoSelection(photo)}>
                                                <img
                                                    src={photo.imageSrc}
                                                    alt={photo.title}
                                                    className="w-full h-20 object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                                                        <span className="text-white text-2xl font-bold">✓</span>
                                                    </div>
                                                )}
                                                <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                    {photo.title}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Group Goal Photos Section */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-green-600 flex items-center gap-2">
                                    <FaUsers /> Group Goals
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {groupGoalPhotos.map((photo) => {
                                        const isSelected = selectedPhotosForAlbum.some(p => p.id === photo.id);
                                        return (
                                            <div
                                                key={photo.id}
                                                className={`relative cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
                                                    isSelected ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300 hover:ring-blue-300'
                                                }`}
                                                onClick={() => togglePhotoSelection(photo)}>
                                                <img
                                                    src={photo.imageSrc}
                                                    alt={photo.title}
                                                    className="w-full h-20 object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                                                        <span className="text-white text-2xl font-bold">✓</span>
                                                    </div>
                                                )}
                                                <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                    {photo.title}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-8 sticky bottom-0 bg-white pt-4">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                                onClick={() => {
                                    setShowPhotoGalleryModal(false);
                                    setPhotoSelectionMode(false);
                                }}
                                disabled={selectedPhotosForAlbum.length === 0}>
                                Add {selectedPhotosForAlbum.length} Photo{selectedPhotosForAlbum.length !== 1 ? 's' : ''} to Album
                            </Button>
                            <Button
                                className="bg-gray-400 hover:bg-gray-500 text-white"
                                onClick={() => {
                                    setShowPhotoGalleryModal(false);
                                    setPhotoSelectionMode(false);
                                    setSelectedPhotosForAlbum([]);
                                }}>
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* ALBUM VIEW MODAL */}
            {viewingAlbum && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black bg-opacity-50">
                    <Card className="max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-lg">
                        <button
                            onClick={() => setViewingAlbum(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
                            aria-label="Close Album Modal">
                            <FaTimes />
                        </button>

                        <h2 className="text-4xl font-extrabold mb-2">{viewingAlbum.title}</h2>
                        {viewingAlbum.description && (
                            <p className="text-gray-600 mb-6">{viewingAlbum.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mb-6">{viewingAlbum.photoCount ?? 0} photos in this album</p>

                        {viewingAlbum.photos && viewingAlbum.photos.length > 0 ? (
                            <div className="mb-6">
                                <DivSlider
                                    photo={viewingAlbum.photos}
                                    wanderListProp={[]}
                                    onPhotoClick={(photo) => {
                                        setActiveCard(photo);
                                        setViewingAlbum(null); // Close album modal when photo clicked
                                    }}
                                    variant="large"
                                />
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-8">No photos in this album</p>
                        )}

                        <Button
                            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white w-full"
                            onClick={() => setViewingAlbum(null)}>
                            Close Album
                        </Button>
                    </Card>
                </div>
            )}
        </main>
    );
}
