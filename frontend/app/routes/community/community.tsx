import { Button } from "flowbite-react";

export default function Community () {
    return(
        <>
            <h1 className="text-5xl font-extrabold text-center mb-4 text-black">Community
                Creates Change</h1>
            <section className=" border-2 border-b-gray-500 bg-blue-500 my-16 mx-2">
                <div
                    className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:max-w-5xl md:mx-auto md:gap-8">
                    <img className="mt-4 mb-4 border-2 w-[450px]" src='img.png' alt="placeholder image"/>
                    <div className="flex flex-col">
                        <p className="md:container md:mx-auto mt-4">'Someday, I'm going on that Hawaii trip, or
                            when I get time off, I'm going to that Hot Air Balloon fiesta.' It's much more possible if
                            you write down
                            your goals and make a plan to accomplish them. Bucket List App is such a place to record
                            your goals,
                            set dates for completion, and have a visual record of your accomplishments. .</p>
                        <p className="mb-4"> What motivates you to start checking things off your own bucket list? What
                            motivates you
                            to get out of bed each day, or to continue learning a new topic? These questions have many
                            answers for each
                            of us. We find our motivations everywhere, anytime and with this app, we can start moving
                            forward with our
                            goals.</p>
                    </div>
                </div>
            </section>
            <section className='w-full relative flex flex-col md:flex md:flex-col-3 mt-4'>
                <h2 className='font-extrabold text-3xl text-center mt-2 text-black'>Inspiration</h2>
                <p className="md:container md:mx-auto mt-4">.</p>
            </section>

            <section className="bg-blue-600">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-md mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-black">Inspiration</h2>
                        <p className="text-black sm:text-xl ">Being inspire happens every moment. Find the ideas for motivation can help by listing them; Friends & Family, accomplishing tasks, visual memories to share and see. Connecting with like-minded people leads to shared goals, shared advice on accomplishing your goals. Do list out what motivates you</p>
                    </div>
                    <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Marketing</h3>
                            <p className="text-gray-500 dark:text-gray-400">Plan it, create it, launch it. Collaborate
                                seamlessly with all the organization and hit your marketing goals every month with our
                                marketing plan.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Legal</h3>
                            <p className="text-gray-500 dark:text-gray-400">Protect your organization, devices and stay
                                compliant with our structured workflows and custom permissions made for you.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                          clip-rule="evenodd"></path>
                                    <path
                                        d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Business Automation</h3>
                            <p className="text-gray-500 dark:text-gray-400">Auto-assign tasks, send Slack messages, and
                                much more. Now power up with hundreds of new templates to help you get started.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                                    <path fill-rule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Finance</h3>
                            <p className="text-gray-500 dark:text-gray-400">Audit-proof software built for critical
                                financial operations like month-end close and quarterly budgeting.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Enterprise Design</h3>
                            <p className="text-gray-500 dark:text-gray-400">Craft beautiful, delightful experiences for
                                both marketing and product with real cross-company collaboration.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Operations</h3>
                            <p className="text-gray-500 dark:text-gray-400">Keep your company’s lights on with
                                customizable, iterative, and structured workflows built for all efficient teams and
                                individual.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="w-full flex flex-col md:flex-row justify-between items-start gap-6 mt-4 bg-gray-200 p-4">
                <div className='flex flex-col items-center gap-4'>
                    <img className="w-[250px] h-[250px] border-2 m-2" src='img_1.png' alt='Categories in red button'/>
                    <p className='text-xl'>Categories</p>
                    <Button>Go to Categories</Button>
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <img className="w-[250px] h-[250px] border-2 m-2" src='img_2.png'
                         alt='social network logos collection'/>
                    <p className='text-xl whitespace-nowrap'>Social Network</p>
                    <Button>Connect your Bucket List</Button>
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <img className="w-[250px] h-[250px] border-2 m-2" src='img_3.png'
                         alt='people figures surrounding goal'/>
                    <p className='text-xl whitespace-nowrap'>Group Goal(s)</p>
                    <Button>Group Goal Experiences</Button>
                </div>
            </section>

            <section className='w-full relative flex flex-col justify-start md:flex md:flex-col-3 mt-4'>
                <div className='gap-4 mt-2 ml-10'>
                    <p className='font-extrabold text-xl'>Your City</p>
                    <Button className='mt-2'>Click Me</Button>
                </div>
                <div className='gap-4 mt-2 ml-10'>
                    <p className='font-extrabold text-xl'>Your Network</p>
                    <Button className='mt-2'>Click Me</Button>
                </div>
                <div className='gap-4 mt-2 ml-10'>
                    <p className='font-extrabold text-xl'>Shared Goals</p>
                    <Button className='mt-2 mb-20'>Click Me</Button>
                </div>
            </section>
        </>
    )
}