import {
    deleteProfileController,
    getFollowersByProfileIdController,
    profileController,
    putProfileController
} from "./profile.controller.ts";
import {Router} from "express";
import {deleteProfileById} from "./profile.model.ts";
import {isLoggedInController} from "../../utils/controller/is-logged-in-controller.ts";

//declare a basePath for this router
const basePath = '/apis/profile' as const

//instantiate a new router object
const router = Router()

//define signup route for this router
router.route('/:id').get(profileController)
    .put(isLoggedInController, putProfileController)
    .delete(deleteProfileController)

router.route('/followers/:id')
    .get(getFollowersByProfileIdController)

//export the router with the basePath and router object
export const profileRoute = {basePath, router}

