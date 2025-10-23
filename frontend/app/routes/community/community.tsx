import { Button } from "flowbite-react";

export default function Community () {
    return(
        <>
            <h1 className="text-5xl font-extrabold text-center mb-4 mt-4 text-bright-light-blue">Community
                Creates Change</h1>
            <section className=" border-2 border-b-gray-500 bg-burnt-orange rounded-xl my-16 mx-2">
                <div
                    className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:max-w-5xl md:mx-auto md:gap-8 rounded-xl">
                    <img className="mt-4 mb-4 border-2 w-[450px]" src='img.png' alt="placeholder image"/>
                    <div className="flex flex-col bg-pale-tan rounded-lg mt-4">
                        <p className="md:container md:mx-auto mt-4 mb-2">Someday, I'm going to Hawaii, or I'm going to ride in a Hot Air Balloon.  With your community, you can collectively go on that Hawaii trip, or as a group take a Hot Air Balloon ride. <strong>It's much more possible if you write down your goals and make a plan to accomplish them</strong>. Communities can enjoy these accomplishments and even make changes for their own community.</p>
                        <p className="mb-4"> For each of us, we find our community everywhere. Within social networks, our circle of friends, and with our family are such places. <strong>Wander List app</strong> can help you develop/connect with your community and we can start moving forward with our goals.</p>
                    </div>
                </div>
            </section>
            <div className='w-full relative flex flex-col md:flex md:flex-col-3 mt-4 mb-4'>
                <h2 className='font-extrabold text-5xl text-center text-bright-light-blue'>Inspiration</h2>
            </div>

            <section className="bg-burnt-orange">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-md mb-8 lg:mb-10 bg-pale-tan rounded-lg p-4">
                        <p className="text-black sm:text-xl "> What motivates you to start checking things off your own bucket list? What motivates you to get out of bed each day, or to continue learning a new topic? Being inspired happens every moment; to do or create something. Finding the ideas for motivation can help by listing them. Connecting with like-minded people leads to shared goals, shared advice on accomplishing your goals. Do list out what motivates you.</p>
                    </div>
                    <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                        <div className='bg-pale-tan rounded-lg p-2'>
                            <h3 className="mb-2 text-xl font-bold text-black">Friends/Family</h3>
                            <p className="text-black">Friends & Family can be your audience; your motivation; your community to share accomplishments with. They can also be your cheerleaders,for completing your goals.</p>
                        </div>
                        <div className='bg-pale-tan rounded-lg p-2'>
                            <h3 className="mb-2 text-xl font-bold text-black">Sharing Accomplishments</h3>
                            <p className="text-black">Having space to share your accomplishments, virtually and physically motivates to continue with more goals,
                            more experiences.</p>
                        </div>
                        <div className='bg-pale-tan rounded-lg p-2'>
                            <h3 className="mb-2 text-xl font-bold text-black">Did that happen?</h3>
                            <p className="text-black">If there's no picture or video, did you complete your goals?
                            Wander List provides space to store all your pictures of your accomplishments.</p>
                        </div>
                        <div className='bg-pale-tan rounded-lg p-2'>
                            <h3 className="mb-2 text-xl font-bold text-black">Vision Board</h3>
                            <p className="text-black">Take post-its, or index cards to create
                            a visual board containing your goals. Categorize them as you want. Travel Goals, low-costs goals, etc.</p>
                        </div>
                        <div className='bg-pale-tan rounded-lg p-2'>
                            <h3 className="mb-2 text-xl font-bold text-black">Group Goals</h3>
                            <p className="text-black">Wander List allows the sharing of your goals, where other users of the
                                app can share in completing the goal. Group Goals can lead to growing your community.</p>
                        </div>
                        <div className='bg-pale-tan rounded-lg p-2'>
                            <h3 className="mb-2 text-xl font-bold text-black">Role Model, Mentor</h3>
                            <p className="text-black">Keep your people that inspire you in mind when planning out your
                            goals. Role models have behaviors/successes that you want to emulate and are a good example to
                            follow. Mentors guide you and inspire you, at times with direct advice and teaching.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="w-full flex flex-col md:flex-row justify-between items-start gap-6 mt-4 bg-burnt-orange p-4">
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