import express, {type Application } from 'express'
import morgan from 'morgan'
import cors from 'cors'
// Routes
import session from 'express-session'
import type {  RedisClientType } from 'redis'
import {RedisStore} from 'connect-redis'
import {indexRoute} from "./apis/index.route.ts";
import {signupRoute} from "./apis/sign-up/sign-up-route.ts";
import {signInRoute} from "./apis/sign-in/sign-in.route.ts";
import {profileRoute} from "./apis/profile/profile.route.ts";
import {followRoute} from "./apis/follow/follow.route.ts";
import {wanderlistRoute} from "./apis/wanderlist/wanderlist.route.ts";
import {mediaRoute} from "./apis/media/media.route.ts";
import {postRoute} from "./apis/post/post.route.ts";
import {commentRoute} from "./apis/comment/comment.route.ts";
import {uploadRoute} from "./apis/upload/upload.route.ts";
//import helmet from "helmet";


export class App {
	app: Application
	redisStore : RedisStore

    //constructor that takes ina  redis client and set s up the app, settings, middleware and
	constructor (  redisClient: RedisClientType
	) {
		this.redisStore = new RedisStore({client: redisClient})
		this.app = express()
       // this.app.use(helmet())
		this.settings()
		this.middlewares()
		this.routes()
	}

	// private method that sets the port for the sever, to one from index.route.ts, and external .env file or defaults to 3000
	public settings (): void {}

	// private method to setting up the middleware to handle json responses, one for dev and one for prod
	private middlewares (): void {

		this.app.use(morgan('dev'))

		// CORS configuration - allow requests for development
		const isProduction = process.env.NODE_ENV === 'production';
		this.app.use(cors({
			origin: isProduction
				? process.env.FRONTEND_URL || 'https://eric.ddfullstack.cloud'
				: true, // Allow all origins in development
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
		}))

		this.app.use(express.json())
		this.app.use(session( {
			store: this.redisStore,
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET as string,
			resave: false
		}))
	}
	// private method for setting up routes in their basic sense (ie. any route that performs an action on profiles starts with /profiles)
	private routes (): void {
		this.app.use(indexRoute.basePath, indexRoute.router)
        this.app.use(signupRoute.basePath, signupRoute.router)
        this.app.use(signInRoute.basePath, signInRoute.router)
        this.app.use(profileRoute.basePath, profileRoute.router)
        this.app.use(followRoute.basePath, followRoute.router)
        this.app.use(wanderlistRoute.basePath, wanderlistRoute.router)
        this.app.use(uploadRoute.basePath, uploadRoute.router)
        this.app.use(mediaRoute.basePath, mediaRoute.router)
        this.app.use(postRoute.basePath, postRoute.router)
        this.app.use(commentRoute.basePath, commentRoute.router)
    }

	// starts the server and tells the terminal to post a message that the server is running and on what port
	public  listen (): void {
		 this.app.listen(4200)
		console.log('Express application built successfully')
	}
}
