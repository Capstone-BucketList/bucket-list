import {Router} from "express";
import {
    deleteMediaController, getAllMediaForVisiblePosts,
    getMediaByPostIdController,
    getMediaByPrimaryKeyController,
    postMediaController
} from "./media.controller.ts";


const basePath = "/apis/media" as const

const router = Router();

router.route('/')
    .post(postMediaController)
    .get(getAllMediaForVisiblePosts)

router.route('/:id')
    .delete(deleteMediaController)
    .get(getMediaByPrimaryKeyController)

router.route('/post/:postId')
    .get(getMediaByPostIdController)



export const mediaRoute ={basePath, router};