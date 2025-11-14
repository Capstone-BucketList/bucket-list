import {redirect} from "react-router";
import {destroySession, getSession} from "~/utils/session.server";

/**
 * Action for logout route.
 * Clears the user session and redirects to home.
 *
 * @param request Action request object
 */
export async function loader ({request} :{request: Request}) {

    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/", {
        headers: {
            "Set-Cookie" : await destroySession(session)
        }
    })
}
