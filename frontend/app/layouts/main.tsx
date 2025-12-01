import {Navigation} from "~/components/navigation";
import {Outlet} from "react-router";
import {WanderListFooter} from "~/components/wander-list-footer";
import {LoadingIndicator} from "~/components/LoadingIndicator";
import {getSession} from "../utils/session.server";
import type {Profile} from "~/utils/models/profile.model";

export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const session = await getSession(request.headers.get('Cookie'))

    const profile = session?.get('profile') ?? null ;
    //console.log('main profile', profile)
   // profileProps ={ profile}
return {profile}

}

export default function MainLayout({loaderData}:Route.ComponentProps) {

    const profile = loaderData?.profile
   // console.log('main layout profile', profile)

    return (
        <div className="flex flex-col min-h-screen">
            <LoadingIndicator />
            <Navigation profile={profile} />
            <main className="flex-1">
                <Outlet/>
            </main>
            <WanderListFooter/>
        </div>
    )
}