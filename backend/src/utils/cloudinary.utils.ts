import { v2 as cloudinary } from 'cloudinary';

/**
 * Initialize Cloudinary with environment variables
 * Requires:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */
export function initializeCloudinary(): void {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

/**
 * Upload a file stream to Cloudinary
 * @param fileStream - File stream to upload
 * @param folder - Cloudinary folder path (e.g., 'wanderlist-scrapbook-v1')
 * @param filename - Original filename for reference
 * @returns Promise containing the secure URL of uploaded file
 */
export async function uploadFileToCloudinary(
    fileStream: NodeJS.ReadableStream,
    folder: string,
    filename: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
                filename_override: filename,
            },
            (error, result) => {
                if (error) {
                    reject(new Error(`Failed to upload file to Cloudinary: ${error.message}`));
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload returned no result'));
                }
            }
        );

        fileStream.pipe(uploadStream);
    });
}

/**
 * Delete a file from Cloudinary by URL
 * @param publicId - Cloudinary public ID of the file
 * @returns Promise containing deletion result
 */
export async function deleteFileFromCloudinary(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(new Error(`Failed to delete file from Cloudinary: ${error.message}`));
            } else {
                resolve();
            }
        });
    });
}

/**
 * Extract public ID from Cloudinary URL
 * Useful for deletions and updates
 * @param url - Cloudinary secure URL
 * @returns Public ID
 */
export function extractPublicIdFromUrl(url: string): string {
    const matches = url.match(/\/([^/]+)\/([^/]+)$/);
    if (matches && matches[2]) {
        return `${matches[1]}/${matches[2].split('.')[0]}`;
    }
    return '';
}
