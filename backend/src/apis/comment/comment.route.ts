import {Router} from "express";
import {
    isLoggedInController
} from "../../utils/controller/is-logged-in-controller.ts";
import {
    deleteCommentController, getCommentByPostIdController,
    getCommentByPrimaryKeyController, getCommentByProfileIdController,
    postCommentController,
} from "./comment.controller.ts"


// declare a basePath for this router
const basePath = '/apis/comment' as const

// instantiate a new router object
const router = Router()

//define comment route for this router
router.route('/')
      .post(isLoggedInController,postCommentController)

router.route('/:id')
      .get(isLoggedInController,getCommentByPrimaryKeyController)
      .delete(isLoggedInController,deleteCommentController)

router.route('/post/:postId')
    .get(isLoggedInController,getCommentByPostIdController)

router.route('/post/:profileId')
    .get(isLoggedInController,getCommentByProfileIdController)

// export the router with the basePath and router object
export const commentRoute = {basePath, router}