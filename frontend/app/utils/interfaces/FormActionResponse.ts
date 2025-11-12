import type {Status} from "~/utils/interfaces/Status";

/*
*FormAction Response
* Represents the possible return types from form actions:
* -Validation errors with form values for re-display
* -Success/Failure response with status information
 */

export type FormActionResponse =
    | {errors: Record<string, any>; defaultValues: unknown }
    | {success: boolean; status: Status }