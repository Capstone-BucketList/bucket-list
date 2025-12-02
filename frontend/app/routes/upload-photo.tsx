import type { Route } from '../.react-router/types/app/routes/+types/upload-photo';
import { uploadToCloudinary } from '~/utils/cloudinary.server';
import { getSession } from '~/utils/session.server';

export async function action({ request }: Route.ActionArgs) {
    // This route is API-only, no component needed
    // The action handler below processes POST requests
    // Only handle POST requests
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Verify authentication
        const cookie = request.headers.get('Cookie');
        const session = await getSession(cookie);
        const authorization = session.get('authorization');
        const profile = session.get('profile');

        if (!profile || !authorization) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get file from form data
        const formData = await request.formData();
        const file = formData.get('photo') as File | null;

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return new Response(JSON.stringify({ error: 'File must be an image' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: 'File must be smaller than 5MB' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Uploading photo:', { name: file.name, size: file.size, type: file.type });

        // Upload to Cloudinary
        const url = await uploadToCloudinary(
            file.stream() as ReadableStream<Uint8Array>,
            'wanderlist-scrapbook-v1'
        );

        console.log('Upload successful:', url);

        return new Response(JSON.stringify({ url, success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Upload error:', error?.message);
        return new Response(
            JSON.stringify({ error: error?.message || 'Failed to upload photo' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Default export required for React Router - this route handles API requests only
export default function UploadPhotoRoute() {
    return null;
}
