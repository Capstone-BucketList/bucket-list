import type { Request, Response } from "express";
import { zodErrorResponse } from "../../utils/response.utils.ts";
import {
    deleteSharedStories,
    getSharedStoriesById,
    insertSharedStories,
    type SharedStories,
    SharedStoriesSchema
} from "./shared-stories.model.ts";

export async function postSharedStoriesController(req: Request, res: Response) {
    try {
        const parseResult = SharedStoriesSchema.safeParse(req.body);
        if (!parseResult.success) {
            zodErrorResponse(res, parseResult.error);
            return;
        }

        const sharedStory: SharedStories = parseResult.data;
        const message = await insertSharedStories(sharedStory);
        res.status(201).json({ status: 201, message, data: null });
    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}

export async function getSharedStoriesByIdController(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const idValidation = SharedStoriesSchema.pick({ id: true }).safeParse({ id });
        if (!idValidation.success) {
            zodErrorResponse(res, idValidation.error);
            return;
        }

        const sharedStory = await getSharedStoriesById(id);
        if (!sharedStory) {
            res.status(404).json({ status: 404, message: "Shared story not found", data: null });
            return;
        }

        res.status(200).json({ status: 200, message: "Shared story retrieved successfully", data: sharedStory });
    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}

export async function deleteSharedStoriesController(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const idValidation = SharedStoriesSchema.pick({ id: true }).safeParse({ id });
        if (!idValidation.success) {
            zodErrorResponse(res, idValidation.error);
            return;
        }

        const message = await deleteSharedStories(id);
        res.status(200).json({ status: 200, message, data: null });
    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
}
