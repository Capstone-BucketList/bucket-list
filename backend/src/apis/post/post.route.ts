import {Router} from "express";
import {
    deletePostController, getAllVisiblePosts, getPostByPrimaryKeyController,
    getPostByWanderlistIdAndVisibilityController, getPostsByProfileId, getVisiblePostsByLoggedInProfileFollow,
    postPostController, putPostController
} from "./post.controller.ts";
import {selectPostbyPrimaryKey} from "./post.model.ts";


const basePath = '/apis/post' as const

// instantiate a new router object
const router = Router()

router.route('/')
    .post(postPostController)
    .get(getPostByWanderlistIdAndVisibilityController)
    .put(putPostController)

router.route('/:id')
    .delete(deletePostController)
    .get(getPostByPrimaryKeyController)

router.route('/follow/:id')
    .get(getVisiblePostsByLoggedInProfileFollow)

router.route('/visible/posts')
    .get(getAllVisiblePosts)

router.route('/profile/:id')
    .get(getPostsByProfileId)

export const postRoute = {basePath, router}