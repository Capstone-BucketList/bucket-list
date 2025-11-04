// declare a basePath for this router
import {Router} from "express";
import {deleteFollowController, postFollowController} from "./follow.controller.ts";
import {isLoggedInController} from "../../utils/controller/is-logged-in-controller.ts";

const basePath = '/apis/follow' as const

// instantiate a new router object
const router = Router()

// define a follow route for this router
//router.route('/').post(postFollowController)

router.route('/:followedProfileId')
    .post(isLoggedInController,postFollowController)
    .delete(isLoggedInController,deleteFollowController)

// export the router with the basePath and router object
export const followRoute = {basePath, router}