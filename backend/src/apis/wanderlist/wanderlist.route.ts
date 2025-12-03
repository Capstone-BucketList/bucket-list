import {Router} from "express";
import {
    deleteWanderListItemController, getWanderlistByProfileIdAndVisibilityController, getWanderlistByProfileIdController,
    getWanderlistByVisibilityController,
    getWanderlistByWanderListIdController,
    postWanderListItemController,
    putWanderListItemController,
    getOrCreateScrapbookWanderlistController,
    getOrCreateSharedStoriesWanderlistController
} from "./wanderlist.controller.ts";
import {isLoggedInController} from "../../utils/controller/is-logged-in-controller.ts";

const basePath = '/apis/wanderlist' as const

const router=Router();

router.route('/')
        .post(isLoggedInController,postWanderListItemController)
        .put(isLoggedInController,putWanderListItemController)
        .get(isLoggedInController,getWanderlistByProfileIdAndVisibilityController)

// Specific routes must come BEFORE generic :id route
router.route('/profile/:profileId')
    .get(isLoggedInController,getWanderlistByProfileIdController)

router.route('/visibility/:visibility')
    .get(isLoggedInController,getWanderlistByVisibilityController)

router.route('/scrapbook/:profileId')
    .get(isLoggedInController,getOrCreateScrapbookWanderlistController)

router.route('/shared-stories')
    .get(isLoggedInController,getOrCreateSharedStoriesWanderlistController)

// Generic :id route must come AFTER specific routes
router.route('/:id')
    .delete(isLoggedInController,deleteWanderListItemController)
    .get(isLoggedInController,getWanderlistByWanderListIdController)

export const  wanderlistRoute = {basePath, router}
