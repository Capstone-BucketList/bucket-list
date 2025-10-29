
import {Router} from "express";
import {signUpProfileController} from "./sign-up.controller.ts";

//define the base path for the route
const basePath = '/apis/signup' as const

//create a new express router
const router = Router()

//define the route
router.route('/').post(signUpProfileController)

//export the router with the basePath and router object
export const signupRoute = {basePath, router}