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
    //  get wonderlist items by profileId
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

                {/*Container*/}
                <div
                    className="w-full bg-white border border-gray-200 rounded-lg shadow-sm ">
                    <div className="sm:hidden">
                        <label htmlFor="tabs" className="sr-only">Select tab</label>
                        <select id="tabs"
                                className="bg-gray-50 border-0 border-b border-gray-200 text-gray-900 text-sm rounded-t-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option>Post</option>
                            <option>My Posts</option>
                            <option>Friends</option>
                        </select>
                    </div>
                    <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex rtl:divide-x-reverse"
                        id="fullWidthTab" data-tabs-toggle="#fullWidthTabContent" role="tablist">
                        <li className="w-full">
                            <button id="stats-tab" data-tabs-target="#stats" type="button" role="tab"
                                    aria-controls="stats" aria-selected="true"
                                    className="inline-block w-full p-4 rounded-ss-lg bg-gray-50 hover:bg-gray-100 focus:outline-none font-baga">Post
                            </button>
                        </li>
                        <li className="w-full">
                            <button id="about-tab" data-tabs-target="#about" type="button" role="tab"
                                    aria-controls="about" aria-selected="false"
                                    className="inline-block w-full p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none">Services
                            </button>
                        </li>
                        <li className="w-full">
                            <button id="faq-tab" data-tabs-target="#faq" type="button" role="tab" aria-controls="faq"
                                    aria-selected="false"
                                    className="inline-block w-full p-4 rounded-se-lg bg-gray-50 hover:bg-gray-100 focus:outline-none">FAQ
                            </button>
                        </li>
                    </ul>
                    <div id="fullWidthTabContent" className="border-t border-gray-200 ">
                        <div className="hidden p-4 bg-white rounded-lg md:p-8 " id="stats"
                             role="tabpanel" aria-labelledby="stats-tab">
                            <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6  sm:p-8">
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">73M+</dt>
                                    <dd className="text-gray-500 ">Developers</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">100M+</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">Public repositories</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">1000s</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">Open source projects</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">1B+</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">Contributors</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">90+</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">Top Forbes companies</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">4M+</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">Organizations</dd>
                                </div>
                            </dl>
                        </div>
                        <div className="hidden p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="about"
                             role="tabpanel" aria-labelledby="about-tab">
                            <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">We
                                invest in the world’s potential</h2>
                            {/*List*/}
                            <ul role="list" className="space-y-4 text-gray-500 dark:text-gray-400">
                                <li className="flex space-x-2 rtl:space-x-reverse items-center">
                                    <svg className="shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500"
                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path
                                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                    <span className="leading-tight">Dynamic reports and dashboards</span>
                                </li>
                                <li className="flex space-x-2 rtl:space-x-reverse items-center">
                                    <svg className="shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500"
                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path
                                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                    <span className="leading-tight">Templates for everyone</span>
                                </li>
                                <li className="flex space-x-2 rtl:space-x-reverse items-center">
                                    <svg className="shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500"
                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path
                                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                    <span className="leading-tight">Development workflow</span>
                                </li>
                                <li className="flex space-x-2 rtl:space-x-reverse items-center">
                                    <svg className="shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500"
                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path
                                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                    <span className="leading-tight">Limitless business automation</span>
                                </li>
                            </ul>
                        </div>
                        <div className="hidden p-4 bg-white rounded-lg dark:bg-gray-800" id="faq" role="tabpanel"
                             aria-labelledby="faq-tab">
                            <div id="accordion-flush" data-accordion="collapse"
                                 data-active-classes="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                 data-inactive-classes="text-gray-500 dark:text-gray-400">
                                <h2 id="accordion-flush-heading-1">
                                    <button type="button"
                                            className="flex items-center justify-between w-full py-5 font-medium text-left rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
                                            data-accordion-target="#accordion-flush-body-1" aria-expanded="true"
                                            aria-controls="accordion-flush-body-1">
                                        <span>What is Flowbite?</span>
                                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0"
                                             aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2" d="M9 5 5 1 1 5"/>
                                        </svg>
                                    </button>
                                </h2>
                                <div id="accordion-flush-body-1" className="hidden"
                                     aria-labelledby="accordion-flush-heading-1">
                                    <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-500 dark:text-gray-400">Flowbite is an open-source
                                            library of interactive components built on top of Tailwind CSS including
                                            buttons, dropdowns, modals, navbars, and more.</p>
                                        <p className="text-gray-500 dark:text-gray-400">Check out this guide to learn
                                            how to <a href="/docs/getting-started/introduction/"
                                                      className="text-blue-600 dark:text-blue-500 hover:underline">get
                                                started</a> and start developing websites even faster with components on
                                            top of Tailwind CSS.</p>
                                    </div>
                                </div>
                                <h2 id="accordion-flush-heading-2">
                                    <button type="button"
                                            className="flex items-center justify-between w-full py-5 font-medium text-left rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
                                            data-accordion-target="#accordion-flush-body-2" aria-expanded="false"
                                            aria-controls="accordion-flush-body-2">
                                        <span>Is there a Figma file available?</span>
                                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0"
                                             aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2" d="M9 5 5 1 1 5"/>
                                        </svg>
                                    </button>
                                </h2>
                                <div id="accordion-flush-body-2" className="hidden"
                                     aria-labelledby="accordion-flush-heading-2">
                                    <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-500 dark:text-gray-400">Flowbite is first
                                            conceptualized and designed using the Figma software so everything you see
                                            in the library has a design equivalent in our Figma file.</p>
                                        <p className="text-gray-500 dark:text-gray-400">Check out the <a
                                            href="https://flowbite.com/figma/"
                                            className="text-blue-600 dark:text-blue-500 hover:underline">Figma design
                                            system</a> based on the utility classes from Tailwind CSS and components
                                            from Flowbite.</p>
                                    </div>
                                </div>
                                <h2 id="accordion-flush-heading-3">
                                    <button type="button"
                                            className="flex items-center justify-between w-full py-5 font-medium text-left rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
                                            data-accordion-target="#accordion-flush-body-3" aria-expanded="false"
                                            aria-controls="accordion-flush-body-3">
                                        <span>What are the differences between Flowbite and Tailwind UI?</span>
                                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0"
                                             aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2" d="M9 5 5 1 1 5"/>
                                        </svg>
                                    </button>
                                </h2>
                                <div id="accordion-flush-body-3" className="hidden"
                                     aria-labelledby="accordion-flush-heading-3">
                                    <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-500 dark:text-gray-400">The main difference is that
                                            the core components from Flowbite are open source under the MIT license,
                                            whereas Tailwind UI is a paid product. Another difference is that Flowbite
                                            relies on smaller and standalone components, whereas Tailwind UI offers
                                            sections of pages.</p>
                                        <p className="mb-2 text-gray-500 dark:text-gray-400">However, we actually
                                            recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there
                                            is no technical reason stopping you from using the best of two worlds.</p>
                                        <p className="mb-2 text-gray-500 dark:text-gray-400">Learn more about these
                                            technologies:</p>
                                        <ul className="ps-5 text-gray-500 list-disc dark:text-gray-400">
                                            <li><a href="https://flowbite.com/pro/"
                                                   className="text-blue-600 dark:text-blue-500 hover:underline">Flowbite
                                                Pro</a></li>
                                            <li><a href="https://tailwindui.com/" rel="nofollow"
                                                   className="text-blue-600 dark:text-blue-500 hover:underline">Tailwind
                                                UI</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*New Post*/}


                {/*My Posts*/}
                <section>
                    <section className="bg-white ">
                        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                            <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                                <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold font-baga text-gray-900">My Posts</h2>
                                <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile
                                    approach to test assumptions and connect with the needs of your audience early and
                                    often.</p>
                            </div>
                            <div className="grid gap-8 lg:grid-cols-2">
                                <article
                                    className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-5 text-gray-500">
                  <span
                      className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                      <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"><path
                          d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                      Tutorial
                  </span>
                                        <span className="text-sm">14 days ago</span>
                                    </div>
                                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        <a href="#">How to quickly deploy a static website</a></h2>
                                    <p className="mb-5 font-light text-gray-500 dark:text-gray-400">Static websites are
                                        now used to bootstrap lots of websites and are becoming the basis for a variety
                                        of tools that even influence both web designers and developers influence both
                                        web designers and developers.</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <img className="w-7 h-7 rounded-full"
                                                 src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                                                 alt="Jese Leos avatar"/>
                                            <span className="font-medium dark:text-white">
                          Jese Leos
                      </span>
                                        </div>
                                        <a href="#"
                                           className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
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
                                <article
                                    className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-5 text-gray-500">
                  <span
                      className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                      <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd"
                                                                    d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                                                                    clip-rule="evenodd"></path><path
                          d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path></svg>
                      Article
                  </span>
                                        <span className="text-sm">14 days ago</span>
                                    </div>
                                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        <a href="#">Our first project with React</a></h2>
                                    <p className="mb-5 font-light text-gray-500 dark:text-gray-400">Static websites are
                                        now used to bootstrap lots of websites and are becoming the basis for a variety
                                        of tools that even influence both web designers and developers influence both
                                        web designers and developers.</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <img className="w-7 h-7 rounded-full"
                                                 src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                                                 alt="Bonnie Green avatar"/>
                                            <span className="font-medium dark:text-white">
                          Bonnie Green
                      </span>
                                        </div>
                                        <a href="#"
                                           className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
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
                            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our
                                team</h2>
                            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">Explore the whole
                                collection of open-source web components and elements built with the utility classes
                                from Tailwind</p>
                        </div>
                        <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                                     alt="Bonnie Avatar"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">Bonnie Green</a>
                                </h3>
                                <p>CEO/Co-founder</p>
                                <ul className="flex justify-center mt-4 space-x-4">
                                    <li>
                                        <a href="#"
                                           className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path
                                                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-gray-900 hover:text-gray-900 dark:hover:text-white dark:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png"
                                     alt="Helene Avatar"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">Helene Engels</a>
                                </h3>
                                <p>CTO/Co-founder</p>
                                <ul className="flex justify-center mt-4 space-x-4">
                                    <li>
                                        <a href="#"
                                           className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path
                                                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-gray-900 hover:text-gray-900 dark:hover:text-white dark:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                                     alt="Jese Avatar"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">Jese Leos</a>
                                </h3>
                                <p>SEO & Marketing</p>
                                <ul className="flex justify-center mt-4 space-x-4">
                                    <li>
                                        <a href="#"
                                           className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path
                                                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-gray-900 hover:text-gray-900 dark:hover:text-white dark:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
                                     alt="Joseph Avatar"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">Joseph Mcfall</a>
                                </h3>
                                <p>Sales</p>
                                <ul className="flex justify-center mt-4 space-x-4">
                                    <li>
                                        <a href="#"
                                           className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path
                                                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-gray-900 hover:text-gray-900 dark:hover:text-white dark:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png"
                                     alt="Sofia Avatar"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">Lana Byrd</a>
                                </h3>
                                <p>Web Designer</p>
                                <ul className="flex justify-center mt-4 space-x-4">
                                    <li>
                                        <a href="#"
                                           className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path
                                                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-gray-900 hover:text-gray-900 dark:hover:text-white dark:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/thomas-lean.png"
                                     alt="Leslie Avatar"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">Leslie Livingston</a>
                                </h3>
                                <p>Graphic Designer</p>
                                <ul className="flex justify-center mt-4 space-x-4">
                                    <li>
                                        <a href="#"
                                           className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path
                                                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-gray-900 hover:text-gray-900 dark:hover:text-white dark:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png"
                                     alt="Michael Avatar"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">Michael Gough</a>
                                </h3>
                                <p>React Developer</p>
                                <ul className="flex justify-center mt-4 space-x-4">
                                    <li>
                                        <a href="#"
                                           className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path
                                                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-gray-900 hover:text-gray-900 dark:hover:text-white dark:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                                     src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png"
                                     alt="Neil Avatar"/>
                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">Neil Sims</a>
                                </h3>
                                <p>Vue.js Developer</p>
                                <ul className="flex justify-center mt-4 space-x-4">
                                    <li>
                                        <a href="#"
                                           className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path
                                                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-gray-900 hover:text-gray-900 dark:hover:text-white dark:text-gray-300">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd"
                                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
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
                        <p className="mb-5 text-base text-gray-500 sm:text-lg">Stay up to date and move
                            work forward with Flowbite on iOS & Android. Download the app today.</p>
                        <ProgressBars/>
                        <ProgressBars/>
                        <ProgressBars/>
                        <ProgressBars/>
                    </div>
                </section>

                {/*Timeline*/}
                <section className="w-3/4 mx-auto m-8">

                    <ol className="items-center grid grid-cols-3 gap-8">
                        <li><Timeline/></li>
                        <li><Timeline/></li>
                        <li><Timeline/></li>
                        <li><Timeline/></li>
                        <li><Timeline/></li>
                        <li><Timeline/></li>
                    </ol>
                </section>

            </section>
        </>
    )
}