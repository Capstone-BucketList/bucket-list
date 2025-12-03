import {getValidatedFormData} from "remix-hook-form";
import {type Post, postPost, PostSchema} from "~/utils/models/post.model";
import {zodResolver} from "@hookform/resolvers/zod";
import {getSession} from "~/utils/session.server";
import {redirect} from "react-router";
import {v7 as uuid} from 'uuid'

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
      //  return { success: true, message: "Post created successfully" };
    } catch (error) {
        return { success: false, error: "Failed to create post" };
    }
 return   redirect('/dashboard')
}