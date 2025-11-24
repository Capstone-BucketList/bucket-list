import { z } from "zod/v4";
import type { SharedStory } from "~/types/shared-story";
import { addHeaders, sharedstoriesBasePath } from "~/utils/utility";

export const SharedStoriesSchema = z.object({
    id: z.string().uuid(),
    dateCreated: z.string().optional(),
    title: z.string().min(1).max(64),
    content: z.string().min(1),
    userName: z.string().min(1).max(32).trim(),
});

export type SharedStories = z.infer<typeof SharedStoriesSchema>;

export async function getSharedStories(
    authorization: string,
    cookie: string
): Promise<SharedStory[]> {
    const response = await fetch(
        `${process.env.REST_API_URL}${sharedstoriesBasePath}`,
        {
            method: "GET",
            headers: addHeaders(authorization, cookie),
        }
    ).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch shared stories");
        return res.json();
    });

    return z.array(SharedStoriesSchema).parse(response.data);
}

export async function postSharedStory(
    story: SharedStory,
    authorization: string,
    cookie: string
): Promise<SharedStory> {
    const response = await fetch(
        `${process.env.REST_API_URL}${sharedstoriesBasePath}`,
        {
            method: "POST",
            headers: {
                ...addHeaders(authorization, cookie),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(story),
        }
    ).then((res) => {
        if (!res.ok) throw new Error("Failed to create story");
        return res.json();
    });

    return SharedStoriesSchema.parse(response.data);
}

export async function deleteSharedStory(
    id: string,
    authorization: string,
    cookie: string
): Promise<string> {
    const response = await fetch(
        `${process.env.REST_API_URL}${sharedstoriesBasePath}/${id}`,
        {
            method: "DELETE",
            headers: addHeaders(authorization, cookie),
        }
    ).then((res) => {
        if (!res.ok) throw new Error("Failed to delete story");
        return res.json();
    });

    return response?.message ?? "Story deleted";
}
