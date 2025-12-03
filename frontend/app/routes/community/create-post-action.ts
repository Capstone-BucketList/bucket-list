import { getSession } from "~/utils/session.server";
import type { Status } from "~/utils/interfaces/Status";
import { v7 as uuidv7 } from "uuid";

export interface CreatePostRequest {
    id: string;
    wanderlistId: string;
    title: string;
    content: string;
    visibility: string;
    mediaUrls: string[];
}

/**
 * Server-side action to create a new post
 * Handles post creation with associated media URLs
 *
 * @param request - The HTTP request containing form data
 * @returns Post creation response with status and data
 */
export async function createPostAction(request: Request): Promise<Status | { error: string; status: number }> {
    try {
        // Get session from cookie
        const session = await getSession(request.headers.get("Cookie"));
        const authorization = session.get("authorization");
        const cookie = request.headers.get("Cookie");

        if (!authorization || !cookie) {
            return { error: "Unauthorized", status: 401 };
        }

        // Parse form data from fetcher.submit
        const formData = await request.formData();

        const body = {
            id: formData.get("id") as string,
            wanderlistId: formData.get("wanderlistId") as string,
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            visibility: (formData.get("visibility") as string) || "public",
            mediaUrls: JSON.parse(formData.get("mediaUrls") as string) as string[],
        };

        // Validate required fields
        if (!body.wanderlistId || !body.title) {
            return { error: "Missing required fields: wanderlistId and title", status: 400 };
        }

        // Create request headers
        const requestHeaders = new Headers();
        requestHeaders.append("Content-Type", "application/json");
        requestHeaders.append("Authorization", authorization);
        requestHeaders.append("Cookie", cookie);

        console.log("Creating post with data:", {
            id: body.id,
            wanderlistId: body.wanderlistId,
            title: body.title,
            content: body.content,
            mediaUrls: body.mediaUrls,
        });

        const requestBody = {
            id: body.id,
            wanderlistId: body.wanderlistId,
            title: body.title,
            content: body.content,
            visibility: body.visibility || "public",
            mediaUrls: body.mediaUrls,
        };

        console.log("Request body being sent to backend:", JSON.stringify(requestBody, null, 2));

        // Call backend API to create post
        const response = await fetch(`${process.env.REST_API_URL}/post/`, {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(requestBody),
        });

        console.log("Backend response status:", response.status);

        const responseData = await response.json() as Status;

        if (!response.ok) {
            console.error("Failed to create post:", responseData);
            return {
                error: responseData.message || "Failed to create post",
                status: responseData.status || response.status,
            };
        }

        console.log("Post created successfully:", responseData);
        return responseData;
    } catch (error: any) {
        console.error("Error in createPostAction:", error);
        console.error("Error stack:", error.stack);
        return {
            error: error.message || "An error occurred while creating the post",
            status: 500,
        };
    }
}
