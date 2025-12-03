import { Router } from 'express';

/**
 * Placeholder upload route
 * TODO: Implement file upload functionality
 */

const router = Router();

// Placeholder route
router.post('/', (req, res) => {
    res.status(501).json({
        status: 501,
        message: 'Upload functionality not yet implemented',
        data: null
    });
});

export const uploadRoute = {
    basePath: '/apis/upload',
    router
};