import {z} from "zod/v4";
import {FollowSchema} from "../follow/follow.model.ts";
import {sql} from "../../utils/database.utils.ts";
import {PublicProfileSchema} from "../profile/profile.model.ts";
import {WanderListSchema} from "../wanderlist/wanderlist.model.ts";

/**
 * Schema for validating post objects
 * @shape id: uuid for primary key referencing post table id
 * @shape wanderListId: uuid foreign key referencing wanderlist table id
 *@shape content: string provide content information for post
 * @shape dateTimeCreated: timestamptz for setting post date created
 *@shape dateTimeModified: timestamptz for modifying your post
 *@shape title: string for providing title to post
 *@shape visibility: string for showing post public or private
 **/

export const PostSchema = z.object ({
    id: z.uuidv7('please provide a valid uuid'),

    wanderlistId: z.uuidv7('please provide a valid uuid'),

    content: z.string( 'please provide valid content')
        .max(1000, 'please provide valid content(max 1000 characters)')
        .trim()
        .nullable(),

    datetimeCreated:z.coerce.date('please provide a valid datetime created')
        .nullable(),

    datetimeModified:z.coerce.date('please provide a valid date time modified')
        .nullable(),

    title: z.string('please provide a valid title')
        .max(64, 'please provide a valid title (max 64 characters)'),

    visibility: z.string('please provide a valid visibility')
        .max(32, 'please provide a valid visibility (max 32 characters)')
}).omit({datetimeCreated:true, datetimeModified : true})

export type Post = z.infer<typeof PostSchema>
