import {Router} from "express";
import {postPostController} from "./post.controller.ts";


const basePath = '/apis/post' as const
console.log("by route")
// instantiate a new router object
const router = Router()

router.route('/') .post(postPostController)

export const postRoute = {basePath, router}