import {getValidatedFormData} from "remix-hook-form";
import {type Post, postPost, PostSchema} from "~/utils/models/post.model";
import {zodResolver} from "@hookform/resolvers/zod";
import {getSession} from "~/utils/session.server";
import {redirect} from "react-router";
import {v7 as uuid} from 'uuid'
import {type Media, postMedia} from "~/utils/models/media.model";

export async function action({ request }: Route.ActionArgs) {


     // Get session data
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const profile = session.get("profile");
    const authorization = session.get("authorization");

    if (!profile || !authorization) {
        return redirect("/login");
    }

    const formData = await request.formData();

    const newPost:Post = {
        id: uuid(),
        title: formData.get("title"),
        content: formData.get("content"),
        wanderlistId: formData.get("wanderlistId"),
        visibility: formData.get("visibility")
    };

    // Create the post
    try {
        await postPost(newPost, authorization, cookie);

        // Handle media URLs if provided
        const mediaUrlsJson = formData.get("mediaUrls");
        if (mediaUrlsJson && typeof mediaUrlsJson === 'string') {
            try {
                const mediaUrls: string[] = JSON.parse(mediaUrlsJson);

                // Save each media URL to the database
                for (const url of mediaUrls) {
                    const mediaRecord: Media = {
                        id: uuid(),
                        postId: newPost.id,
                        url: url
                    };
                    await postMedia(mediaRecord, url, authorization, cookie);
                }
            } catch (mediaError) {
                console.error('Failed to save media:', mediaError);
                // Continue even if media fails - post is already created
            }
        }

      //  return { success: true, message: "Post created successfully" };
    } catch (error) {
        return { success: false, error: "Failed to create post" };
    }
 return   redirect('/dashboard')
}