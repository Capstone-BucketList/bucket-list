export default function Community () {
    return(
        <>
            <h1 className="text-4xl font-bold text-center mb-4 text-amber-500">Community Creates Change</h1>
            <section className=" border-2 border-b-gray-500 bg-green-400 my-16 mx-2">
                <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:max-w-5xl md:mx-auto md:gap-8">
                    <img className="mt-4 mb-4 border-2" src='https://placehold.co/300x200' alt="placeholder image"/>
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

            <section className='w-full relative flex flex-col-3 justify-start md:flex md:flex-col-3 mt-4'>
                <img className="w-full" src='https://placehold.co/100x100' alt='placeholder image'/>
                <p className='text-xl'>Categories</p>
                <img className="w-full" src='https://placehold.co/100x100' alt='placeholder image'/>
                <p className='text-xl' >Social Network</p>
                <img className="w-full" src='https://placehold.co/100x100' alt='placeholder image'/>
                <p className='text-xl'>Looking for Group Goal(s)</p>
            </section>

            <section className='w-full relative flex flex-col-3 justify-start md:flex md:flex-col-3 mt-4'>

                <p>Your City</p>
                <button className='bg-blue-400 rounded'>Click Me</button>
                <p>Your Network</p>
                <button className='bg-blue-400 rounded'>Click Me</button>
                <p>Shared Goals</p>
                <button className='bg-blue-400 rounded mb-10'>Click Me</button>

            </section>
        </>
    )
}