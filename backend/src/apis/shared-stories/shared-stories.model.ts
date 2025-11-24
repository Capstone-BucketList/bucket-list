import { z } from 'zod/v4';
import { sql } from "../../utils/database.utils.ts";

export const SharedStoriesSchema = z.object({
    id: z.uuidv7('please provide a valid UUID for id'),
    dateCreated: z.date('please provide a valid date').optional(),
    title: z.string('Please provide a valid title')
        .min(1)
        .max(64, 'Please provide a valid title (max 64 characters)'),
    content: z.string("PLease provide valid content for your story")
        .min(1),
    userName: z.string('please provide a valid user name')
        .min(1, 'please provide a valid user name')
        .max(32, 'please provide a valid user name(max 32 characters)')
        .trim(),
});

export type SharedStories = z.infer<typeof SharedStoriesSchema>;

export async function insertSharedStories(sharedstories: SharedStories): Promise<string> {
    SharedStoriesSchema.parse(sharedstories);

    const { id, content, title, userName } = sharedstories;
    await sql`INSERT INTO sharedstories(id, date_created, title, content, user_name) VALUES (${id}, now(), ${title}, ${content}, ${userName})`;

    return 'Shared Story Successfully created';
}

export async function deleteSharedStories(id: string): Promise<string> {
    await sql`DELETE FROM sharedstories WHERE id = ${id}`;
    return "Shared story successfully deleted";
}

export async function getSharedStoriesById(id: string): Promise<SharedStories | null> {
    const rows = await sql`SELECT * FROM sharedstories WHERE id = ${id}`;
    const result = SharedStoriesSchema.array().max(1).parse(rows);
    return result[0] ?? null;
}
