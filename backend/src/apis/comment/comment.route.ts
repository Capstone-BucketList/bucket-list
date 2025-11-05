import {Router} from "express";
import {isLoggedInController} from "../../utils/controller/is-logged-in-controller.ts";
import {postCommentController} from "./comment.controller.ts";

// declare a basePath for this router
const basePath = '/apis/comment' as const

// instantiate a new router object
const router = Router()

//define comment route for this router
router.route('/')
      .post(postCommentController)
      .put(isLoggedInController)
            // add putCommentController to .put


// router.route('/comment/:id')
//       .get(getCommentsByCommentId)
//       .delete(deleteCommentController)

// export the router with the basePath and router object
export const commentRoute = {basePath, router}