import { Router } from "express";
import { isLoggedInController } from "../../utils/controller/is-logged-in-controller.ts";
import {
    postSharedStoriesController,
    getSharedStoriesByIdController,
    deleteSharedStoriesController
} from "./shared-stories.controller.ts";

const basePath = '/apis/shared-stories' as const;
const router = Router();

router.route('/')
    .post(isLoggedInController, postSharedStoriesController);

router.route('/:id')
    .get(isLoggedInController, getSharedStoriesByIdController)
    .delete(isLoggedInController, deleteSharedStoriesController);

export const sharedStoriesRoute = { basePath, router };
