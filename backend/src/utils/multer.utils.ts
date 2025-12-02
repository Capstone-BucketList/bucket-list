import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Multer storage configuration for temporary file storage
 * Files are stored in memory to be streamed directly to Cloudinary
 */
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: (req, file, cb) => {
        // Only allow image files
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'));
        }
    },
});

/**
 * Middleware to handle single file upload
 * Usage: router.post('/upload', upload.single('file'), controller)
 */
export const uploadSingleFile = upload.single('file');

/**
 * Middleware to handle multiple file uploads
 * Usage: router.post('/upload-multiple', upload.array('files', 10), controller)
 */
export const uploadMultipleFiles = upload.array('files', 10);
