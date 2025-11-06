import {Router} from "express";
import {
    deleteMediaController, getAllMediaForVisiblePosts,
    getMediaByPostIdController,
    getMediaByPrimaryKeyController,
    postMediaController
} from "./media.controller.ts";
import {isLoggedInController} from "../../utils/controller/is-logged-in-controller.ts";


const basePath = "/apis/media" as const

const router = Router();

router.route('/')
    .post(isLoggedInController,postMediaController)
    .get(isLoggedInController,getAllMediaForVisiblePosts)

router.route('/:id')
    .delete(isLoggedInController,deleteMediaController)
    .get(isLoggedInController,getMediaByPrimaryKeyController)

router.route('/post/:postId')
    .get(isLoggedInController,getMediaByPostIdController)



export const mediaRoute ={basePath, router};