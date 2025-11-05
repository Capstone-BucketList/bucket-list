import {Router} from "express";
import {
    deletePostController, getPostByPrimaryKeyController,
    getPostByWanderlistIdAndVisibilityController,
    postPostController
} from "./post.controller.ts";
import {selectPostbyPrimaryKey} from "./post.model.ts";


const basePath = '/apis/post' as const

// instantiate a new router object
const router = Router()

router.route('/').post(postPostController)
    .get(getPostByWanderlistIdAndVisibilityController)

router.route('/:id').delete(deletePostController)
    .get(getPostByPrimaryKeyController)

export const postRoute = {basePath, router}