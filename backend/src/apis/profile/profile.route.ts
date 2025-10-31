import {profileController} from "./profile.controller.ts";
import {Router} from "express";

//declare a basePath for this router
const basePath = '/apis/profile' as const

//instantiate a new router object
const router = Router()

//define signup route for this router
router.route('/:id').get(profileController)

//export the router with the basePath and router object
export const profileRoute = {basePath, router}