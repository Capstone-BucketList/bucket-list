import type { Request, Response } from 'express'
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

export async function indexController (request: Request, response: Response) {
    response.json('🤯 😬 😱')
}

