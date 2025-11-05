import express, {response} from "express";
import {type Comment, CommentSchema, postComment} from "./comment.model.ts";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import type {Request, Response} from "express";



export async function postCommentController(request: Request, response: Response) :Promise<void> {
    try {
        const validationResult = CommentSchema.safeParse(request.body);

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        } // end if statement

        const {id, postId, profileId, comment, dateCreated} = validationResult.data

        const comment: Comment = {
            id,
            postId,
            profileId,
            comment,
            dateCreated
        }

        const message = await postComment(comment)

        const status: Status = {
            status: 200,
            message: message,
            data: null
        }
        response.status(200).json(status)
    } catch (error: any) {
        const status: Status = {
            status: 500,
            message: error.message,
            data: null
        }
        response.status(500).json(status)
    }
}