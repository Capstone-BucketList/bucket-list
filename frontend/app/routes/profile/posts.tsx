
import { useActionData, Form, useRevalidator, useFetcher} from "react-router";
import type {WanderList} from "~/utils/models/wanderlist.model";
import {type Post,  PostSchema} from "~/utils/models/post.model";
import React, {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRemixForm} from "remix-hook-form";
import {FaPencil, FaImage} from "react-icons/fa6";
import {VisibilityOptions} from "~/utils/interfaces/VisibilityType";
import {FaCloudUploadAlt, FaWindowClose} from "react-icons/fa";
import {type Media} from "~/utils/models/media.model";
import {Spinner} from "flowbite-react";
import {v7 as uuidv7} from 'uuid';

type PostWithMedia = Post & {
    media?: Media[];
};

type Props = {
    posts: PostWithMedia[];
    wanderlistItem: WanderList[];
    authorization?: string;
    cookie?: string;
};



export default function Posts(props : Props) {
    const {posts, wanderlistItem, authorization, cookie} = props;

    // State for post modal
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPost, setEditingPost] = useState<PostWithMedia | null>(null);
    const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

    // Image upload states
    const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
    const [existingMedia, setExistingMedia] = useState<Media[]>([]);
    const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const fetcher = useFetcher();
    const deleteFetcher = useFetcher();

    // Cloudinary configuration
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dgkckqptm';
    const uploadPreset = 'wanderlist_scrapbook';

    // Get 4 most recent posts (based on created OR modified date, whichever is newer)
    // Posts already have media from the loader
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

    // Function to open modal for creating new post
    const openCreatePostModal = () => {
        setEditingPost(null);
        setExistingMedia([]);
        setDeletedMediaIds([]);
        setUploadedPhotoUrls([]);
        setIsPostModalOpen(true);
    };

    // Function to open modal for editing post
    const openEditPostModal = (post: PostWithMedia) => {
        setEditingPost(post);
        setExistingMedia(post.media || []);
        setDeletedMediaIds([]);
        setUploadedPhotoUrls([]);
        setIsPostModalOpen(true);
    };

    // Function to close modal
    const closePostModal = () => {
        setIsPostModalOpen(false);
        setIsSubmitting(false);
        setEditingPost(null);
        setExistingMedia([]);
        setDeletedMediaIds([]);
        setUploadedPhotoUrls([]);
        setUploadError('');
        reset(); // Clear all form fields
    };

    // Function to handle delete
    const handleDelete = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            deleteFetcher.submit(
                { postId, postAction: 'delete' },
                { method: 'POST' }
            );
        }
    };

    // Remove existing media (mark for deletion)
    const handleRemoveExistingMedia = (mediaId: string) => {
        setDeletedMediaIds(prev => [...prev, mediaId]);
        setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
    };

    // Handle photo upload to Cloudinary
    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setUploadError('');

        for (const file of Array.from(files)) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setUploadError('Only image files are allowed');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File must be smaller than 5MB');
                return;
            }

            setIsUploading(true);

            try {
                // Upload directly to Cloudinary
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', uploadPreset);
                formData.append('folder', 'wanderlist-scrapbook-v1');

                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                const response = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload photo to Cloudinary');
                }

                const data = await response.json();
                setUploadedPhotoUrls(prev => [...prev, data.secure_url]);
            } catch (error) {
                console.error('Upload error:', error);
                setUploadError('Failed to upload photo. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    // Remove uploaded photo
    const handleRemovePhoto = (index: number) => {
        setUploadedPhotoUrls(uploadedPhotoUrls.filter((_, i) => i !== index));
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

    // Monitor fetcher response for post creation/edit
    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            const response = fetcher.data as any;
            if (response.success !== false) {
                // Post created/updated successfully
                closePostModal();
                revalidator.revalidate();
            }
        }
    }, [fetcher.state, fetcher.data, revalidator]);

    // Monitor delete fetcher response
    useEffect(() => {
        if (deleteFetcher.state === 'idle' && deleteFetcher.data) {
            const response = deleteFetcher.data as any;
            if (response.success !== false) {
                // Post deleted successfully
                revalidator.revalidate();
            }
        }
    }, [deleteFetcher.state, deleteFetcher.data, revalidator]);

    // Handle form submission with media
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        // Determine if we're editing or creating
        const isEditing = !!editingPost;

        if (isEditing) {
            // Add post ID for editing
            formData.set('id', editingPost.id);
            formData.set('postAction', 'edit');

            // Add deleted media IDs
            if (deletedMediaIds.length > 0) {
                formData.set('deletedMediaIds', JSON.stringify(deletedMediaIds));
            }

            // Add new media URLs
            if (uploadedPhotoUrls.length > 0) {
                formData.set('mediaUrls', JSON.stringify(uploadedPhotoUrls));
            }

            // Submit to dashboard action
            fetcher.submit(formData, {
                method: 'POST'
            });
        } else {
            // Add media URLs to form data for new post
            if (uploadedPhotoUrls.length > 0) {
                formData.set('mediaUrls', JSON.stringify(uploadedPhotoUrls));
            }

            // Add unique ID for the post
            formData.set('id', uuidv7());

            // Submit via fetcher to createpost action
            fetcher.submit(formData, {
                method: 'POST',
                action: 'createpost'
            });
        }
    };

    return (
        <>
        {/* My Posts Section */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Posts</h2>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">{posts?.length || 0} posts</div>
                    <button
                        type="button"
                        onClick={openCreatePostModal}
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
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
                            className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
                        >
                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mb-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditPostModal(post);
                                    }}
                                    disabled={deleteFetcher.state !== 'idle'}
                                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center gap-1 disabled:opacity-50"
                                    title="Edit post"
                                >
                                    <FaPencil className="text-xs" />
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(post.id);
                                    }}
                                    disabled={deleteFetcher.state !== 'idle'}
                                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-1 disabled:opacity-50"
                                    title="Delete post"
                                >
                                    {deleteFetcher.state !== 'idle' ? (
                                        <>
                                            <Spinner size="sm" className="w-3 h-3" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            ×
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {post.content || "No content"}
                            </p>

                            {/* Display media images */}
                            {post.media && post.media.length > 0 && (
                                <div className="mb-4">
                                    {post.media.length === 1 ? (
                                        // Single image - full width
                                        <img
                                            src={post.media[0].url}
                                            alt={post.title}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    ) : (
                                        // Multiple images - grid
                                        <div className="grid grid-cols-2 gap-2">
                                            {post.media.slice(0, 4).map((media, index) => (
                                                <div key={media.id} className="relative">
                                                    <img
                                                        src={media.url}
                                                        alt={`${post.title} - ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                    {/* Show +N overlay if more than 4 images */}
                                                    {index === 3 && post.media && post.media.length > 4 && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                                            <span className="text-white text-xl font-bold">
                                                                +{post.media.length - 4}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

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
                            {editingPost ? 'Edit Post' : 'Create New Post'}
                        </h3>

                        <form
                            onSubmit={handleFormSubmit}
                            noValidate={true}
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
                                    name="title"
                                    placeholder="Enter post title"
                                    defaultValue={editingPost?.title || ''}
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
                                    name="content"
                                    placeholder="Share your story..."
                                    rows={6}
                                    defaultValue={editingPost?.content || ''}
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
                                    name="wanderlistId"
                                    defaultValue={editingPost?.wanderlistId || ''}
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
                                                name="visibility"
                                                value={option.id}
                                                defaultChecked={editingPost?.visibility === option.id || (!editingPost && option.id === 'public')}
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

                            {/* Error/Success Messages for Upload */}
                            {uploadError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-700">{uploadError}</p>
                                </div>
                            )}

                            {/* Existing Media (Edit Mode) */}
                            {editingPost && existingMedia.length > 0 && (
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Existing Photos ({existingMedia.length})
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {existingMedia.map((media) => (
                                            <div key={media.id} className="relative group">
                                                <img
                                                    src={media.url}
                                                    alt="Existing"
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingMedia(media.id)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                    title="Remove this photo"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Add Photos (optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
                                    <input
                                        id="photoInput"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="photoInput"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Spinner size="md" />
                                                <p className="text-gray-600">Uploading...</p>
                                            </>
                                        ) : (
                                            <>
                                                <FaCloudUploadAlt className="text-3xl text-indigo-500" />
                                                <p className="text-gray-700 font-semibold">
                                                    Click to upload photos
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Max 5MB per file • PNG, JPG, GIF
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Uploaded Photos Preview */}
                            {uploadedPhotoUrls.length > 0 && (
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Uploaded Photos ({uploadedPhotoUrls.length})
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {uploadedPhotoUrls.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Uploaded ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Submit and Cancel Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closePostModal}
                                    disabled={fetcher.state !== 'idle' || isUploading}
                                    className="rounded-lg px-5 py-3 bg-gray-300 hover:bg-gray-400 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={fetcher.state !== 'idle' || isUploading}
                                    className="rounded-lg px-5 py-3 bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {fetcher.state !== 'idle' ? (
                                        <>
                                            <Spinner size="sm" />
                                            {editingPost ? 'Updating Post...' : 'Creating Post...'}
                                        </>
                                    ) : (
                                        editingPost ? 'Update Post' : 'Create Post'
                                    )}
                                </button>
                            </div>
                        </form>

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

