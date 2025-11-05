import {Router} from "express";
import {
    deleteWanderListItemController, getWanderlistByProfileIdAndVisibilityController, getWanderlistByProfileIdController,
    getWanderlistByVisibilityController,
    getWanderlistByWanderListIdController,
    postWanderListItemController,
    putWanderListItemController
} from "./wanderlist.controller.ts";

const basePath = '/apis/wanderlist' as const

const router=Router();

router.route('/')
        .post(postWanderListItemController)
        .put(putWanderListItemController)
        .get(getWanderlistByProfileIdAndVisibilityController)

router.route('/:id')
    .delete(deleteWanderListItemController)
    .get(getWanderlistByWanderListIdController)

router.route('/profile/:profileId').get(getWanderlistByProfileIdController)

router.route('/visibility/:visibility').get(getWanderlistByVisibilityController)

export const  wanderlistRoute = {basePath, router}
