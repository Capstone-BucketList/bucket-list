export async function signupProfileController(request: Request, response: Response) {
    try{
        const validationResult = SignUpProfileSchema.safeParse(request.body)
    }

}