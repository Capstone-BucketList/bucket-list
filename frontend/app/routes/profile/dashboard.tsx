import {ListItems} from "~/routes/profile/list-items";
import {ProgressBars} from "~/routes/profile/progress-bars";
import {Timeline} from "~/routes/profile/timeline";
import {getSession} from "~/utils/session.server";
import type { Route } from "./+types/dashboard";
import {getWanderListByProfileId, WanderListSchema} from "~/utils/models/wanderlist.model";
import {redirect} from "react-router";

export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const session = await getSession(request.headers.get('Cookie'))

    const profile = session?.get('profile') ?? null ;

    if(! profile) {
        return {profile:null, wanderList: []};
    }
    //  get wanderlist items by profileId
    //  const wanderList  =await getWanderListByProfileId("019a3191-a7f4-735d-af0a-1042ea19a399") //profile.id)


    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }

    const response = await fetch(`${process.env.REST_API_URL}/wanderlist/profile/019a3191-a7f4-735d-af0a-1042ea19a399`,{
        method: 'GET',
        headers: requestHeaders,
    }) .then(res => {
        if (!res.ok) {
            throw new Error('failed to fetch unread messages')
        }
        return res.json()
    })

    const wanderList = WanderListSchema.array().parse(response.data)
    console.log("wanderList",wanderList)


    return {profile, wanderList}

}

export default function Dashboard({loaderData} :Route.ComponentProps) {

    const {profile, wanderList} = loaderData

    if(!profile){
        redirect('/')
    }

    const {userName, email, bio, profilePicture} = profile
    return (
        < >
            {/*USER DETAILS*/}

            {/*Bio Changes*/}
            <section>

            </section>

            {/*Bio*/}
            <div className="flex justify-center-safe items-center mx-auto my-22 max-w-2/3 gap-10">
                <img className="rounded-full w-50 h-50 float-right" src={profilePicture}
                     alt="image description"/>
                <div>
                    <h2 className="text-lg font-extrabold leading-none tracking-tight text-gray-900 font-baga">{userName}</h2>
                    <h3 className="italic font-baga">{email}</h3>
                    <p className="text-lg font-normal font-eaves text-gray-500 lg:text-xl">{bio}</p>

                </div>

            </div>

            {/* BUCKET LIST */}
            {/*<section>*/}
            {/*    @todo: add logic to only show if no items in bucket list*/}
            {/*    <section className="bg-burnt-orange rounded-xl shadow-md mx-20 my-4"> /!* start empty bucket list*/}
            {/*     section*!/*/}
            {/*        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">*/}
            {/*            <div className="mx-auto max-w-screen-sm text-center">*/}
            {/*                <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-200 drop-shadow-lg">It looks like you haven't added any tasks to your bucket!</h2>*/}
            {/*                <p className="mb-6 font-light text-black md:text-lgg">Add your first wish or event by clicking below.</p>*/}
            {/*                <a href="#"*/}
            {/*                   className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Start my bucket list!</a>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        */}
            {/*    </section> /!* end empty bucket list section *!/*/}
            {/*</section> /!* end bucket list section*!/*/}
            {/*</section>*/}

            <section>
                <section className="bg-seafoam">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                            <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold font-baga text-gray-900">My Wanderlist</h2>
                            <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                                {wanderList.map((wander) => (

                                    <ListItems  wanderList={wander}/>

                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/*POSTS/FRIENDS*/}

                {/*New Post*/}

                {/*My Posts*/}
                <section>
                    <section className="bg-white ">
                        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                            <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                                <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold font-baga text-gray-900">My Posts</h2>
                            </div>
                            <div className="grid gap-8 lg:grid-cols-2">
                                <article
                                    className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
                                    <div className="flex justify-between items-center mb-5 text-gray-500">

                                        <span className="text-sm">[backend: date]</span>
                                    </div>
                                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                                        <a href="#">[backend: title]</a></h2>
                                    <p className="mb-5 font-light text-gray-500">[backend: content]</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <img className="w-7 h-7 rounded-full"
                                                 src="[backend: user photo url]"
                                                 alt="[backend: user name 'photo']"/>
                                            <span className="font-medium dark:text-white">[backend: user name]</span>
                                        </div>
                                        <a href="#"
                                           className="inline-flex items-center font-medium text-primary-600 hover:underline">
                                            Read more
                                            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>
                </section>

                {/*My Friends*/}
                <section className="bg-white dark:bg-gray-900">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
                        <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
                            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Following</h2>
                        </div>
                        <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="[backend: following user photo url]"
                                     alt="[backend: following user name 'profile picture']"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="[backend: following user profile">[backend: following user name]</a>
                                </h3>

                            </div>
                        </div>
                    </div>
                </section>


                {/*PROGRESS*/}

                {/*Progress Bars*/}
                <section className="w-3/4 mx-auto p-8 m-8">
                    <div
                        className="w-full p-8 text-center sm:p-8">
                        <h5 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold font-baga text-gray-900">My Journey</h5>

                        @todo:
                        {/*-- adjust backend calls in progress bars component*/}
                        {/*-- add loop and if statements to check the status of total bucket list items*/}
                        <ProgressBars/>
                    </div>
                </section>

                {/*Timeline*/}
                <section className="w-3/4 mx-auto m-8">

                    <ol className="items-center grid grid-cols-3 gap-8">
                        @todo:
                        {/*-- adjust backend calls in timeline components*/}
                        <li><Timeline/></li>
                    </ol>
                </section>

            </section>
        </>
    )
}