import {Router} from "express";
import {
    isLoggedInController
} from "../../utils/controller/is-logged-in-controller.ts";
import {
    postCommentController,
    getCommentByPrimaryKeyController,
    deleteCommentController, getCommentByPostIdController
} from "./comment.controller.ts"
import {getMediaByPostIdController} from "../media/media.controller.ts";


// declare a basePath for this router
const basePath = '/apis/comment' as const

// instantiate a new router object
const router = Router()

//define comment route for this router
router.route('/')
      .post(postCommentController)
      .put(isLoggedInController)

router.route('/comment/:id')
      .get(getCommentByPrimaryKeyController)
      .delete(deleteCommentController)

router.route('/post/:postId')
    .get(getCommentByPostIdController)

// export the router with the basePath and router object
export const commentRoute = {basePath, router}