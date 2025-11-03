// declare a basePath for this router
import {Router} from "express";
import {followController} from "./follow.controller.ts";

const basePath = '/apis/follow' as const

// instantiate a new router object
const router = Router()

// define a follow route for this router
router.route('/follow/:id').get(followController)

// export the router with the basePath and router object
export const followRoute = {basePath, router}