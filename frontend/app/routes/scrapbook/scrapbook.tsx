import React, { useState } from "react";
import { Button, Card } from "flowbite-react";
import { FaCameraRetro, FaTimes, FaShareAlt, FaTrash } from "react-icons/fa";
import { DivSlider } from "~/components/div_slider";
import PhotoCard from "~/components/photo-card";
import type { PhotoData } from "../scrapbook/ScrapbookTypes";
import { getSession } from "~/utils/session.server";
import { redirect, useFetcher } from "react-router";
import type { Route } from "../../.react-router/types/app/routes/scrapbook/+types/scrapbook";
import { useLoaderData } from "react-router";
import { addHeaders } from "~/utils/utility";
import { getWanderListByProfileId, type WanderList } from "~/utils/models/wanderlist.model";
import { createAlbumAction } from "./scrapbook-album-action";
import { v7 as uuidv7 } from "uuid";


export async function loader({ request }: Route.LoaderArgs) {
    const cookie = request.headers.get('Cookie');
    const session = await getSession(cookie);

    const profile = session.get("profile");
    const authorization = session.get("authorization");

    if (!profile || !authorization || !cookie) {
        return redirect("/login");
    }

    try {
        // Fetch user's wanderlists
        const wanderlists = await getWanderListByProfileId(profile.id, authorization, cookie);

        // Fetch all albums (posts) from all wanderlists
        let albums = [];
        for (const wanderlist of wanderlists) {
            const albumsResponse = await fetch(
                `${process.env.REST_API_URL}/post/wanderlist/${wanderlist.id}`,
                {
                    method: "GET",
                    headers: addHeaders(authorization, cookie),
                }
            );

            const albumsData = await albumsResponse.json();
            const posts = albumsData?.data || [];

            // For each post (album), fetch its media (photos)
            const albumsWithMedia = await Promise.all(
                posts.map(async (post: any) => {
                    const mediaResponse = await fetch(
                        `${process.env.REST_API_URL}/media/post/${post.id}`,
                        {
                            method: "GET",
                            headers: addHeaders(authorization, cookie),
                        }
                    );

                    const mediaData = await mediaResponse.json();
                    const mediaItems = mediaData?.data || [];

                    return {
                        id: post.id,
                        title: post.title,
                        description: post.content,
                        createdAt: post.datetime_created,
                        visibility: post.visibility,
                        wanderlistId: wanderlist.id,
                        photos: mediaItems.map((media: any) => ({
                            id: media.id,
                            title: post.title,
                            description: post.content,
                            imageSrc: media.url,
                            postId: post.id,
                        })),
                        photoCount: mediaItems.length,
                    };
                })
            );

            albums = [...albums, ...albumsWithMedia];
        }

        return { profile, authorization, cookie, wanderlists, albums };
    } catch (error) {
        console.error("Error loading scrapbook data:", error);
        // Return empty albums if fetch fails, user can still create new ones
        return { profile, authorization, cookie, wanderlists: [], albums: [] };
    }
}

export async function action({ request }: Route.ActionArgs) {
    if (request.method === "POST") {
        return await createAlbumAction(request);
    }
    return { error: "Method not allowed", status: 405 };
}

type AlbumData = {
    id: string;
    title: string;
    createdAt: Date;
    coverImage?: string;
    description?: string;
    photoCount?: number;
    photos?: PhotoData[];
    wanderlistId?: string;
    visibility?: string;
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
    const [selectedWanderlistId, setSelectedWanderlistId] = useState<string>("");


    // Get auth, wanderlists and albums from loader
    const { authorization, cookie, wanderlists, albums: initialAlbums } = useLoaderData<typeof loader>();

    // Setup fetcher for server action
    const fetcher = useFetcher();

    // Initialize state from loader
    React.useEffect(() => {
        if (initialAlbums && initialAlbums.length > 0) {
            setAlbums(initialAlbums);
        }
        // Set first wanderlist as default
        if (wanderlists && wanderlists.length > 0) {
            setSelectedWanderlistId(wanderlists[0].id || "");
        }
    }, [initialAlbums, wanderlists]);

    // Handle fetcher response for album creation
    React.useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            const response = fetcher.data as any;
            if (response.status === 200) {
                // Album created successfully
                const newAlbum: AlbumData = {
                    id: response.data?.id || uuidv7(),
                    title: newAlbumTitle,
                    createdAt: new Date(),
                    description: newAlbumDescription,
                    visibility: "public",
                    wanderlistId: selectedWanderlistId,
                    photos: (response.data?.mediaUrls || []).map((url: string) => ({
                        id: uuidv7(),
                        title: newAlbumTitle,
                        description: newAlbumDescription,
                        imageSrc: url,
                        postId: response.data?.id,
                    })),
                    photoCount: response.data?.mediaUrls?.length || 0,
                };

                setAlbums([newAlbum, ...albums]);

                // Reset form
                setNewAlbumTitle("");
                setNewAlbumDescription("");
                setSelectedPhotosForAlbum([]);
                setUploadedPhotoUrl(null);
                setShowPhotoGalleryModal(false);
                setError(null);
                setIsLoading(false);

                alert(`Album "${newAlbum.title}" created successfully!`);
            } else {
                setError(response.error || "Failed to create album");
                setIsLoading(false);
            }
        }
    }, [fetcher.state]);

    const handleSubmitChanges = async () => {
        if (!activeCard?.id || !activeCard?.postId) {
            setError("Missing photo ID");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REST_API_URL}/post/`, {
                method: "PUT",
                headers: addHeaders(authorization, cookie),
                body: JSON.stringify({
                    id: activeCard.postId,
                    wanderlistId: activeCard.wanderlistId || selectedWanderlistId,
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
        if (!activeCard?.postId) {
            setError("No post ID available");
            return;
        }

        // Double confirmation for destructive action
        if (!confirm("Are you sure? This will permanently delete this album. This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${process.env.REST_API_URL}/post/${activeCard.postId}`,
                {
                    method: "DELETE",
                    headers: addHeaders(authorization, cookie),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete album");
            }

            const data = await response.json();

            if (data.status === 200) {
                alert("Album deleted successfully!");
                setActiveCard(null); // Close modal
                // Remove album from albums state
                setAlbums(albums.filter(a => a.id !== activeCard.postId));
            } else {
                setError(data.message || "Failed to delete album");
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

        if (!selectedWanderlistId) {
            setError("Please select a wanderlist before creating an album.");
            return;
        }

        setIsLoading(true);
        setError(null);

        // Collect all photo URLs (uploaded + selected from collections)
        const mediaUrls = [];

        if (uploadedPhotoUrl) {
            mediaUrls.push(uploadedPhotoUrl);
        }

        // Also include URLs from selected photos if they have imageSrc
        for (const photo of selectedPhotosForAlbum) {
            if (photo.imageSrc && !mediaUrls.includes(photo.imageSrc)) {
                mediaUrls.push(photo.imageSrc);
            }
        }

        console.log("Creating album with mediaUrls:", mediaUrls);

        // Call the server action via fetcher
        fetcher.submit(
            {
                id: uuidv7(),
                wanderlistId: selectedWanderlistId,
                title: newAlbumTitle.trim(),
                description: newAlbumDescription.trim(),
                visibility: "public",
                mediaUrls: JSON.stringify(mediaUrls),
            },
            { method: "POST" }
        );
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

                        {/* Wanderlist Selection Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Save Album to Wanderlist</label>
                            <select
                                value={selectedWanderlistId}
                                onChange={e => setSelectedWanderlistId(e.target.value)}
                                className="w-full p-2 border rounded mb-2">
                                <option value="">Select a wanderlist...</option>
                                {wanderlists && wanderlists.map((wanderlist) => (
                                    <option key={wanderlist.id} value={wanderlist.id || ""}>
                                        {wanderlist.title}
                                    </option>
                                ))}
                            </select>
                            {!selectedWanderlistId && (
                                <p className="text-sm text-red-600 mt-1">Please select a wanderlist to save your album</p>
                            )}
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

                    {/* USER'S REAL ALBUMS */}
                    {albums && albums.length > 0 ? (
                        albums.map((album) => (
                            <Card key={album.id} className="shadow-md hover:shadow-lg transition p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <FaCameraRetro className="text-indigo-600 text-3xl" />
                                    <h2 className="text-3xl font-extrabold">{album.title}</h2>
                                </div>
                                {album.photos && album.photos.length > 0 ? (
                                    <DivSlider photo={album.photos} wanderListProp={[]} onPhotoClick={setActiveCard} />
                                ) : (
                                    <p className="text-gray-600">No photos in this album</p>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Card className="shadow-md hover:shadow-lg transition p-6">
                            <div className="text-center py-12">
                                <FaCameraRetro className="text-gray-400 text-5xl mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-600 mb-2">No Albums Yet</h3>
                                <p className="text-gray-500 mb-6">Create your first album above to get started!</p>
                            </div>
                        </Card>
                    )}

                    {/* TIMELINE SECTION */}
                    <Card className="shadow-md hover:shadow-lg transition p-6">
                        <h2 className="text-3xl font-extrabold mb-4">Timeline</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Every photo from your albums.
                        </p>

                        {(() => {
                            // Flatten all photos from all albums
                            const allPhotos = albums.flatMap(album => album.photos || []);
                            const timelinePhotosDisplay = allPhotos.slice(0, 12);

                            return timelinePhotosDisplay.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                        {timelinePhotosDisplay.map((photo) => (
                                            <img
                                                key={photo.id}
                                                src={photo.imageSrc}
                                                alt={photo.title}
                                                className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                                                onClick={() => setActiveCard(photo)}
                                                title={photo.title}
                                            />
                                        ))}
                                    </div>

                                    {allPhotos.length > 12 && (
                                        <Button
                                            className="mt-6 bg-blue-600 w-full text-white"
                                            onClick={() => setShowTimelineModal(true)}>
                                            View Full Timeline
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-600 py-8 text-center">No photos yet. Create an album to see your timeline!</p>
                            );
                        })()}
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
                        {(() => {
                            const allPhotos = albums.flatMap(album => album.photos || []);
                            return allPhotos.length > 0 ? (
                                <DivSlider photo={allPhotos} wanderListProp={[]} onPhotoClick={(photo) => {
                                    setActiveCard(photo);
                                    setShowTimelineModal(false);
                                }} />
                            ) : (
                                <p className="text-white text-center py-12">No photos in timeline</p>
                            );
                        })()}
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

                        {/* Gallery Sections - Real Albums + Newly Uploaded Photo */}
                        <div className="space-y-8">
                            {/* Show newly uploaded photo */}
                            {uploadedPhotoUrl && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-4 text-indigo-600 flex items-center gap-2">
                                        <FaCameraRetro /> Newly Uploaded
                                    </h3>
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        <div
                                            className={`relative cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
                                                selectedPhotosForAlbum.some(p => p.imageSrc === uploadedPhotoUrl) ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300 hover:ring-blue-300'
                                            }`}
                                            onClick={() => {
                                                const newUploadedPhoto: PhotoData = {
                                                    id: crypto.randomUUID(),
                                                    title: "Recently Uploaded",
                                                    description: "",
                                                    imageSrc: uploadedPhotoUrl,
                                                };
                                                togglePhotoSelection(newUploadedPhoto);
                                            }}>
                                            <img
                                                src={uploadedPhotoUrl}
                                                alt="Recently uploaded"
                                                className="w-full h-20 object-cover"
                                            />
                                            {selectedPhotosForAlbum.some(p => p.imageSrc === uploadedPhotoUrl) && (
                                                <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                                                    <span className="text-white text-2xl font-bold">✓</span>
                                                </div>
                                            )}
                                            <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                Recently Uploaded
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Show existing albums */}
                            {albums && albums.length > 0 ? (
                                albums.map((album) => (
                                    <div key={album.id}>
                                        <h3 className="text-2xl font-bold mb-4 text-indigo-600 flex items-center gap-2">
                                            <FaCameraRetro /> {album.title}
                                        </h3>
                                        {album.photos && album.photos.length > 0 ? (
                                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                                {album.photos.map((photo) => {
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
                                        ) : (
                                            <p className="text-gray-600 text-center py-4">No photos in this album</p>
                                        )}
                                    </div>
                                ))
                            ) : !uploadedPhotoUrl ? (
                                <p className="text-center text-gray-600 py-8">No albums yet. Upload a photo above to get started!</p>
                            ) : null}
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
