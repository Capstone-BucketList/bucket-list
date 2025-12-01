import { Router } from 'express';
import { uploadSingleFile, uploadMultipleFiles } from '../../utils/multer.utils.ts';
import { uploadFileController, uploadMultipleFilesController } from './upload.controller.ts';
import { isLoggedInController } from '../../utils/controller/is-logged-in-controller.ts';

export const uploadRoute = {
    basePath: '/apis/upload',
    router: Router()
        .post('/', isLoggedInController, uploadSingleFile, uploadFileController)
        .post('/multiple', isLoggedInController, uploadMultipleFiles, uploadMultipleFilesController),
};
