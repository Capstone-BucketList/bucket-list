import {Carousel} from "flowbite-react";
import { Banner, BannerCollapseButton } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import { Card } from "flowbite-react";



export default function Scrapbook () {
    return(
        <>
            <div className="flex w-full justify-between border-b border-gray-200 bg-blue-500 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mx-auto flex items-center">
                    <p className="flex items-center font-normal dark:text-gray-400 text-3xl text-white whitespace-nowrap">
                        Space for your collection of memories
                    </p>
                </div>
            </div>

            <section className='w-full bg-amber-300 flex flex-cols-3 gap-5 md:' >
                <h2 className='text-3xl' >Travel</h2>

                <Card className="max-w-sm mt-2"
                imgAlt="placeholder photo"
                imgSrc='https://placehold.co/100x100'
                >
                <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                Albuquerque Balloon Fiesta 2024
                </h5>
                <p className="font-normal text-gray-300 dark:text-gray-400">
                Finally completed my bucket item of a Hot Air Balloon experience.
                </p>
                </Card>

                <Card className="max-w-sm mt-2"
                      imgAlt="placeholder photo"
                      imgSrc='https://placehold.co/100x100'>
                    <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                        Sandia Mountains Hiking Trail 2025
                    </h5>
                    <p className="font-normal text-gray-300 dark:text-gray-400">
                        Completed 12,000 steps in a single day hike!
                    </p>
                </Card>
                <Card className="max-w-sm mt-2"
                      imgAlt="placeholder photo"
                      imgSrc='https://placehold.co/100x100'>
                    <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                        Route 66 2025
                    </h5>
                    <p className="font-normal text-gray-300 dark:text-gray-400">
                        10 days traveling on route 66
                    </p>
                </Card>
                <Card className="max-w-sm mt-2"
                      imgAlt="placeholder photo"
                      imgSrc='https://placehold.co/100x100'
                >
                    <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                        Albuquerque Balloon Fiesta 2024
                    </h5>
                    <p className="font-normal text-gray-300 dark:text-gray-400">
                        Finally completed my bucket item of a Hot Air Balloon experience.
                    </p>
                </Card>

                <Card className="max-w-sm mt-2"
                      imgAlt="placeholder photo"
                      imgSrc='https://placehold.co/100x100'>
                    <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                        Sandia Mountains Hiking Trail 2025
                    </h5>
                    <p className="font-normal text-gray-300 dark:text-gray-400">
                        Completed 12,000 steps in a single day hike!
                    </p>
                </Card>
                <Card className="max-w-sm mt-2"
                      imgAlt="placeholder photo"
                      imgSrc='https://placehold.co/100x100'>
                    <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                        Route 66 2025
                    </h5>
                    <p className="font-normal text-gray-300 dark:text-gray-400">
                        10 days traveling on route 66
                    </p>
                </Card>
            </section>


{/*<div className="w-full h-[500px] sm:h-64 xl:h-80 2xl:h-96">*/}
            {/*<Carousel>*/}
            {/*<img src="" alt="..." />*/}
            {/*<img src="https://placehold.co/600x400" alt="placeholder image" />*/}
            {/*<img src="https://placehold.co/600x400" alt="placeholder image" />*/}
            {/*<img src="https://placehold.co/600x400" alt="placeholder image" />*/}
            {/*<img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />*/}
            {/*</Carousel>*/}
            {/*</div>*/}
        </>


    )

}