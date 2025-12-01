import { uploadToCloudinary } from './cloudinary.server';

export async function handlePhotoUpload(file: File, folder: string = 'wanderlist-scrapbook-v1'): Promise<string> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('File must be smaller than 5MB');
    }

    // Upload to Cloudinary
    const url = await uploadToCloudinary(
        file.stream() as ReadableStream<Uint8Array>,
        folder
    );

    return url;
}
