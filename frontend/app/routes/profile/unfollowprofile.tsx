import {getSession} from "~/utils/session.server";
import {redirect} from "react-router";
import {deleteFollowedProfileId, postFollow} from "~/utils/models/follow.model";


export async function action({ request }: Route.ActionArgs) {


    const formData = await request.formData();
    const followedProfileId = formData.get("followedProfileId");

    if(!followedProfileId){
        return "select profile"
    }
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const profile = session.get("profile");
    const authorization = session.get("authorization");

    if (!profile || !authorization) return redirect("/login");

    const response = await deleteFollowedProfileId(followedProfileId,authorization,cookie)
    return redirect("/dashboard");

}