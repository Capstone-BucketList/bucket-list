import type { Request, Response } from 'express';
import { Readable } from 'stream';
import { uploadFileToCloudinary, initializeCloudinary } from '../../utils/cloudinary.utils.ts';
import type { Status } from '../../utils/interfaces/Status.ts';

/**
 * Upload a single file to Cloudinary
 * @endpoint POST /apis/upload
 * @param request Contains the uploaded file in request.file (from multer middleware)
 * @param response Response object to send back to client
 * @returns JSON response with the secure URL of the uploaded file
 */
export async function uploadFileController(request: Request, response: Response): Promise<void> {
    try {
        // Initialize Cloudinary (should ideally be done once in App initialization)
        initializeCloudinary();

        // Check if file was uploaded
        if (!request.file) {
            const status: Status = {
                status: 400,
                message: 'No file provided',
                data: null,
            };
            response.status(400).json(status);
            return;
        }

        const { originalname, mimetype, buffer, size } = request.file;

        // Validate file size (additional check, multer should catch this)
        if (size > 5 * 1024 * 1024) {
            const status: Status = {
                status: 400,
                message: 'File size exceeds 5MB limit',
                data: null,
            };
            response.status(400).json(status);
            return;
        }

        // Validate file type
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimes.includes(mimetype)) {
            const status: Status = {
                status: 400,
                message: 'Only image files are allowed',
                data: null,
            };
            response.status(400).json(status);
            return;
        }

        // Convert buffer to stream for Cloudinary upload
        const stream = Readable.from(buffer);

        // Upload to Cloudinary
        const url = await uploadFileToCloudinary(stream, 'wanderlist-scrapbook-v1', originalname);

        const status: Status = {
            status: 200,
            message: 'File uploaded successfully',
            data: { url },
        };
        response.status(200).json(status);
    } catch (error: any) {
        console.error('Upload error:', error);
        const status: Status = {
            status: 500,
            message: error.message || 'Failed to upload file',
            data: null,
        };
        response.status(500).json(status);
    }
}

/**
 * Upload multiple files to Cloudinary
 * @endpoint POST /apis/upload/multiple
 * @param request Contains uploaded files in request.files (from multer middleware)
 * @param response Response object to send back to client
 * @returns JSON response with array of secure URLs
 */
export async function uploadMultipleFilesController(request: Request, response: Response): Promise<void> {
    try {
        // Initialize Cloudinary
        initializeCloudinary();

        // Check if files were uploaded
        if (!request.files || !Array.isArray(request.files) || request.files.length === 0) {
            const status: Status = {
                status: 400,
                message: 'No files provided',
                data: null,
            };
            response.status(400).json(status);
            return;
        }

        const urls: string[] = [];

        // Upload each file
        for (const file of request.files) {
            const { originalname, mimetype, buffer, size } = file;

            // Validate file size
            if (size > 5 * 1024 * 1024) {
                const status: Status = {
                    status: 400,
                    message: `File ${originalname} exceeds 5MB limit`,
                    data: null,
                };
                response.status(400).json(status);
                return;
            }

            // Validate file type
            const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedMimes.includes(mimetype)) {
                const status: Status = {
                    status: 400,
                    message: `File ${originalname} is not a valid image format`,
                    data: null,
                };
                response.status(400).json(status);
                return;
            }

            // Convert buffer to stream
            const stream = Readable.from(buffer);

            // Upload to Cloudinary
            const url = await uploadFileToCloudinary(stream, 'wanderlist-scrapbook-v1', originalname);
            urls.push(url);
        }

        const status: Status = {
            status: 200,
            message: `${urls.length} file(s) uploaded successfully`,
            data: { urls },
        };
        response.status(200).json(status);
    } catch (error: any) {
        console.error('Multiple upload error:', error);
        const status: Status = {
            status: 500,
            message: error.message || 'Failed to upload files',
            data: null,
        };
        response.status(500).json(status);
    }
}
