import { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, Select, Spinner } from 'flowbite-react';
import { FaCloudUploadAlt, FaImage } from 'react-icons/fa';
import { addHeaders } from '~/utils/utility';
import { v7 as uuidv7 } from 'uuid';
import { useFetcher } from 'react-router';

interface Wanderlist {
    id: string;
    title: string;
}

interface PostCreationFormProps {
    authorization: string;
    cookie: string;
    profileId?: string;
    onSuccess?: () => void;
    defaultWanderlistId?: string;
    hideWanderlistSelector?: boolean;
    wanderlists?: Wanderlist[];
}

export function PostCreationForm({
    authorization,
    cookie,
    profileId,
    onSuccess,
    defaultWanderlistId,
    hideWanderlistSelector = false,
    wanderlists = []
}: PostCreationFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [selectedWanderlist, setSelectedWanderlist] = useState(defaultWanderlistId || '');
    const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const fetcher = useFetcher();

    // Cloudinary configuration
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dgkckqptm';
    const uploadPreset = 'wanderlist_scrapbook';

    // Auto-select first wanderlist when wanderlists prop is loaded
    useEffect(() => {
        if (wanderlists && wanderlists.length > 0 && !selectedWanderlist && !hideWanderlistSelector) {
            setSelectedWanderlist(wanderlists[0].id);
        }
    }, [wanderlists, hideWanderlistSelector, selectedWanderlist]);

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Only image files are allowed');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage('File must be smaller than 5MB');
                return;
            }

            setIsUploading(true);
            setErrorMessage('');

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
                setUploadedPhotoUrls([...uploadedPhotoUrls, data.secure_url]);
                setSuccessMessage('Photo uploaded successfully');

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error('Upload error:', error);
                setErrorMessage('Failed to upload photo. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemovePhoto = (index: number) => {
        setUploadedPhotoUrls(uploadedPhotoUrls.filter((_, i) => i !== index));
    };

    // Monitor fetcher response for post creation
    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            const response = fetcher.data as any;
            if (response.status === 200) {
                // Post created successfully
                setSuccessMessage('Post created successfully!');

                // Clear form
                setTitle('');
                setContent('');
                setVisibility('public');
                setUploadedPhotoUrls([]);

                // Reset file input
                const fileInput = document.getElementById('photoInput') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);

                // Call onSuccess callback if provided
                if (onSuccess) {
                    setTimeout(onSuccess, 500);
                }
            } else {
                setErrorMessage(response.error || 'Failed to create post');
            }
        }
    }, [fetcher.state, fetcher.data, onSuccess]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setErrorMessage('Title is required');
            return;
        }

        if (!content.trim()) {
            setErrorMessage('Content is required');
            return;
        }

        if (!selectedWanderlist) {
            setErrorMessage('Please select a wanderlist');
            return;
        }

        setErrorMessage('');

        // Submit via fetcher to server-side action
        fetcher.submit(
            {
                id: uuidv7(),
                wanderlistId: selectedWanderlist,
                title: title.trim(),
                content: content.trim(),
                visibility,
                mediaUrls: JSON.stringify(uploadedPhotoUrls),
            },
            { method: 'POST' }
        );
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Post</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700">{errorMessage}</p>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-700">{successMessage}</p>
                    </div>
                )}

                {/* Wanderlist Selection - Hidden for Shared Stories */}
                {!hideWanderlistSelector && (
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Wanderlist <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={selectedWanderlist}
                            onChange={(e) => setSelectedWanderlist(e.target.value)}
                            required
                        >
                            <option value="">-- Select a wanderlist --</option>
                            {wanderlists.map((wl) => (
                                <option key={wl.id} value={wl.id}>
                                    {wl.title}
                                </option>
                            ))}
                        </Select>
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <TextInput
                        type="text"
                        placeholder="Enter post title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                        placeholder="Share your story, thoughts, or experiences..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        required
                    />
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Add Photos
                    </label>
                    <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
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
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Visibility Control */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Visibility
                    </label>
                    <Select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                    </Select>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={fetcher.state !== 'idle' || isUploading}
                        className="flex-1"
                    >
                        {fetcher.state !== 'idle' ? (
                            <>
                                <Spinner size="sm" className="mr-2" />
                                Creating Post...
                            </>
                        ) : (
                            'Create Post'
                        )}
                    </Button>
                    <Button
                        type="reset"
                        color="light"
                        onClick={() => {
                            setTitle('');
                            setContent('');
                            setVisibility('public');
                            setUploadedPhotoUrls([]);
                        }}
                    >
                        Clear
                    </Button>
                </div>
            </form>
        </div>
    );
}
