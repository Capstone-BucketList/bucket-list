import { Button } from "flowbite-react";

export default function Community () {
    return(
        <>
            <h1 className="text-5xl font-extrabold text-center mb-4 text-shadow-white text-shadow-lg text-blue-600">Community Creates Change</h1>
            <section className=" border-2 border-b-gray-500 bg-blue-500 my-16 mx-2">
                <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:max-w-5xl md:mx-auto md:gap-8">
                    <img className="mt-4 mb-4 border-2 w-[450px]" src='img.png' alt="placeholder image"/>
                    <div className="flex flex-col">
                        <p className="md:container md:mx-auto mt-4">'Someday, I'm going on that Hawaii trip, or
                        when I get time off, I'm going to that Hot Air Balloon fiesta.' It's much more possible if you write down
                        your goals and make a plan to accomplish them. Bucket List App is such a place to record your goals,
                        set dates for completion, and have a visual record of your accomplishments. .</p>
                        <p className="mb-4"> What motivates you to start checking things off your own bucket list? What motivates you
                            to get out of bed each day, or to continue learning a new topic? These questions have many answers for each
                            of us. We find our motivations everywhere, anytime and with this app, we can start moving forward with our
                            goals.</p>
                    </div>
                </div>
            </section>
            <section className='w-full relative flex flex-col md:flex md:flex-col-3 mt-4'>
                <h2 className='font-extrabold text-3xl text-center mt-2 text-blue-600'>Inspiration</h2>
                <p className="md:container md:mx-auto mt-4">Being inspire happens every moment. Find the ideas for motivation
                can help by listing them; Friends & Family, accomplishing tasks, visual memories to share and see. Connecting
                with like-minded people leads to shared goals, shared advice on accomplishing your goals. Do list out what
                motivates you.</p>
            </section>

            <section className="w-full flex flex-col md:flex-row justify-between items-start gap-6 mt-4 bg-gray-200 p-4">
                <div className='flex flex-col items-center gap-4'>
                    <img className="w-[250px] h-[250px] border-2 m-2" src='img_1.png' alt='Categories in red button'/>
                     <p className='text-xl'>Categories</p>
                    <Button>Go to Categories</Button>
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <img className="w-[250px] h-[250px] border-2 m-2" src='img_2.png' alt='social network logos collection'/>
                    <p className='text-xl whitespace-nowrap' >Social Network</p>
                    <Button>Connect your Bucket List</Button>
                </div>
                <div className='flex flex-col items-center gap-4'>
                     <img className="w-[250px] h-[250px] border-2 m-2" src='img_3.png' alt='people figures surrounding goal'/>
                    <p className='text-xl whitespace-nowrap'>Group Goal(s)</p>
                    <Button>Group Goal Experiences</Button>
                </div>
            </section>

            <section className='w-full relative flex flex-col justify-start md:flex md:flex-col-3 mt-4'>
                <div className='gap-4 mt-2 ml-10'>
                <p className= 'font-extrabold text-xl'>Your City</p>
                <Button className='mt-2'>Click Me</Button>
                </div>
                <div className='gap-4 mt-2 ml-10'>
                <p className= 'font-extrabold text-xl'>Your Network</p>
                <Button className='mt-2'>Click Me</Button>
                </div>
                <div className='gap-4 mt-2 ml-10'>
                <p className= 'font-extrabold text-xl'>Shared Goals</p>
                <Button className='mt-2 mb-20'>Click Me</Button>
                </div>
            </section>
        </>
    )
}