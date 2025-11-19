
import {commitSession, getSession} from "../../utils/session.server";
import {type FileUpload, parseFormData} from "@remix-run/form-data-parser";
import {uploadToCloudinary} from "../../utils/cloudinary.server";
import {jwtDecode} from "jwt-decode";
import {ProfileSchema} from "../../utils/models/profile.model";
import {redirect} from "react-router";

/**
 * Handles the edit profile action, including image upload and location geocoding.
 * Parses form data, uploads profile image to Cloudinary if provided, and geocodes the user's city/state.
 * Returns an error if location is invalid.
 *
 * @param {Request} request - The HTTP request containing form data.
 * @returns {Promise<Object>} The updated user object or error response.
 */


export async function editProfileAction(request: Request) {

// pull the userId from the session
    const session = await getSession(
        request.headers.get("Cookie")
    )

    const uploadHandler = async (file: FileUpload | string | undefined | null) => {
        if (!file || typeof file === "string" || !file.stream) {
            // No file uploaded or invalid file type
            return undefined;
        }

        if (file.fieldName === 'profilePicture') {
            console.log(file.stream())
            try {
                // Upload image to Cloudinary and return the URL
                const cloudinaryUrl =await uploadToCloudinary(file.stream());
                return cloudinaryUrl;
            } catch (error) {
                console.error("Cloudinary upload failed:", error);
                return undefined;
            }
        }

        // Only handle userImgUrl uploads
        return undefined;
    };

    // Parse form data and handle file uploads
    const formData = await parseFormData(request, uploadHandler)
    const userInfo = Object.fromEntries(formData)

    // Merge updated user info with session data
    const updatedUser = {
        ...session.data.profile,
        ...userInfo,


    }
    console.log("updatedUser",updatedUser)
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }

    const response = await fetch(`${process.env.REST_API_URL}/profile/${updatedUser.id}`,
        {
            method: 'PUT',
            headers: requestHeaders,
            body: JSON.stringify(updatedUser),
        })
    const headers = response.headers
    const data = await response.json();
    if (data.status == 200) {
        const authorization = headers.get('authorization');
        if (!authorization) {
            session.flash('error', 'profile is malformed')
            return {success: false, error: 'internal server error try again later', status: 400}
        }
        const parsedJwtToken = jwtDecode(authorization) as any
        const validationResult = ProfileSchema.safeParse(parsedJwtToken.auth);

        if (!validationResult.success) {
            session.flash('error', 'profile is malformed')
            return {success: false, error: 'internal server error try again later', status: 400}
        }

        session.set('authorization', authorization);
        session.set('profile', validationResult.data)
        const responseHeaders = new Headers()
        responseHeaders.append('Set-Cookie', await commitSession(session))
        return redirect("/settings", {headers: responseHeaders});
    }
    return {success: false, error: data.message, status: data.status};
}

