import {Router} from "express";
import {
    deletePostController, getAllVisiblePosts, getPostByPrimaryKeyController, getPostByWanderlistId,
    getPostByWanderlistIdAndVisibilityController, getPostsByProfileId, getVisiblePostsByLoggedInProfileFollow,
    postPostController, putPostController
} from "./post.controller.ts";
import {selectPostbyPrimaryKey} from "./post.model.ts";
import {isLoggedInController} from "../../utils/controller/is-logged-in-controller.ts";


const basePath = '/apis/post' as const

// instantiate a new router object
const router = Router()

router.route('/')
    .post(isLoggedInController,postPostController)
    .get(isLoggedInController,getPostByWanderlistIdAndVisibilityController)
    .put(isLoggedInController,putPostController)

router.route('/:id')
    .delete(isLoggedInController,deletePostController)
    .get(isLoggedInController,getPostByPrimaryKeyController)

router.route('/follow/:id')
    .get(isLoggedInController,getVisiblePostsByLoggedInProfileFollow)

router.route('/visible/posts')
    .get(isLoggedInController,getAllVisiblePosts)

router.route('/profile/:id')
    .get(isLoggedInController,getPostsByProfileId)

router.route('/wanderlist/:id')
    .get(isLoggedInController,getPostByWanderlistId)

export const postRoute = {basePath, router}