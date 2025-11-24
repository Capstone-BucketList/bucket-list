import {ListItems} from "~/routes/profile/list-items";
import {ProgressBars} from "~/routes/profile/progress-bars";
import {Timeline} from "~/routes/profile/timeline";
import {getSession} from "~/utils/session.server";
import type { Route } from "./+types/dashboard";
import {getWanderListByProfileId, WanderListSchema} from "~/utils/models/wanderlist.model";
import {redirect} from "react-router";
import {getFollwersByProfileId} from "~/utils/models/profile.model";
import {FaPencil} from "react-icons/fa6";
import WanderList from "~/routes/profile/wanderlist";

export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie)

    const profile = session.get("profile");
    const authorization = session.get("authorization");


    if (!profile || !authorization || !cookie) {
        return redirect("/sign-in");
    }
    //  get wonderlist items by profileId
    const wanderList  =await getWanderListByProfileId(profile.id, authorization, cookie) //profile.id)
    // followers profiles
    const followingProfiles = await getFollwersByProfileId(profile.id, authorization, cookie)


     return {profile, wanderList,followingProfiles}

}


export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { profile, wanderList,followingProfiles } = loaderData ?? {};

    if (!profile) {
        redirect("/");
    }

    const { userName, email, bio, profilePicture } = profile ?? {};



    return (
        <>
            <div
                className="min-h-screen bg-gray-100 relative overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 py-12 w-full"
                // style={{
                //     backgroundImage:
                //         `url('https://www.transparenttextures.com/patterns/asfalt-light.png'), linear-gradient(to top right, #e0e7ff, #fef3c7)`,
                //     backgroundRepeat: "repeat, no-repeat",
                //     backgroundSize: "auto, cover",
                //     backgroundPosition: "center",
                // }}
            >
                {/* Profile header */}
                <header className="mb-12 flex flex-col sm:flex-row items-center gap-6 w-full">
                    <img
                        src={profilePicture || "/images/avatar-placeholder.png"}
                        alt={`${userName ?? "User"} avatar`}
                        className="w-28 h-28 rounded-full object-cover ring-2 ring-offset-1 ring-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-4xl font-extrabold text-gray-900">{userName || "Anonymous"}</h1>
                        <p className="text-sm text-gray-600 italic">{email}</p>
                        <p className="mt-3 text-gray-700 max-w-prose">{bio || "No bio yet — tell people about your journey!"}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                           {/* <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow transition"
                            >
                                <FaPencil/>

                                Add Wander
                            </button>*/}
                        </div>
                    </div>
                </header>

                {/* Main grid - FULL WIDTH */}
                <section
                    className="w-full grid grid-cols-1 lg:grid-cols-4 gap-10"
                    style={{ minHeight: "70vh" }}
                >
                    {/* LEFT + MIDDLE - Wanderlist + Posts */}
                 <WanderList wanderList ={wanderList}/>

                    {/* RIGHT Sidebar - Friends + Progress + Timeline */}
                    <aside className="space-y-10">
                        {/* Friends */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Friends</h3>
                                <a href="#" className="text-gray-500 hover:underline">
                                    See all
                                </a>
                            </div>

                            <div className="flex flex-wrap justify-start lg:grid lg:grid-cols-2 gap-4 p-2">
                                {/* Example friend cards */}
                                {followingProfiles.map(profile => (
                                    <FriendCard name={profile.userName} img={profilePicture} />
                                ))
                                }

                            </div>
                        </section>

                        {/* Progress Bars */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">My Journey</h3>
                            <p className="text-gray-500 mb-6">
                                Progress on your wanderlists and milestones.
                            </p>
                            <div className="space-y-5">
                                <ProgressBars />
                                <ProgressBars />
                                <ProgressBars />
                            </div>
                        </section>

                        {/* Timeline */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <ol className="space-y-4">
                                {[1, 2, 3].map((num) => (
                                    <li key={num} className="flex items-start gap-4">
                    <span className="mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-semibold">
                      {num}
                    </span>
                                        <div className="text-gray-700">
                                            <Timeline />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </aside>
                </section>

            </div>
        </>
    );


function FriendCard({
                        name,
                        img,
                    }: {
    name: string;
    img: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={img}
                alt={`${name} avatar`}
            />
            <div>
                <p className="font-semibold text-gray-900">{name}</p>

            </div>
        </div>
    );
} }