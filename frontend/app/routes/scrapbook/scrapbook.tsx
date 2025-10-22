import {Button, Carousel} from "flowbite-react";
import { Banner, BannerCollapseButton } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import { Card } from "flowbite-react";
import PhotoCard from "../../components/photo-card";


export default function Scrapbook () {
    return(
        <>
            <div className="flex w-full justify-between border-gray-200 bg-blue-500 p-4">
                <div className="mx-auto flex items-center">
                    <h1 className="font-bold whitespace-nowrap text-3xl text-white ">
                        Your Collection of Memories
                    </h1>
                </div>
            </div>
            <section className='w-full bg-gray-200 px-4 pt-5' >
                <div className='flex flex-col items-center mb-6'>
                    <h2 className='text-3xl font-extrabold text-center mb-6' >Travel</h2>
                    <Button>See Gallery</Button>
                </div>
                <div className='flex flex-wrap justify-center gap-6' >
                    <Card className="max-w-sm mt-2" imgAlt="hot air balloons at sunset" imgSrc='img_4.png'>
                <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                    Albuquerque Balloon Fiesta 2024
                </h5>
                 <p className="font-normal text-gray-300 dark:text-gray-400">
                 Finally completed my bucket item of a Hot Air Balloon experience.
                </p>
                    <Button>Submit</Button>
                </Card>
                <Card className="max-w-sm mt-2"
                      imgAlt="person on hiking trail"
                      imgSrc='img_5.png'>
                    <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                        Sandia Mountains Hiking Trail 2025
                    </h5>
                    <p className="font-normal text-gray-300 dark:text-gray-400">
                        Completed 12,000 steps in a single day hike!
                    </p>
                    <Button>Submit</Button>
                </Card>
                <Card className="max-w-sm mt-2"
                      imgAlt="highway sunset view"
                      imgSrc='img_6.png'>
                    <h5 className="text-xl font-bold whitespace-nowrap tracking-tight text-gray-900 dark:text-white">
                        Route 66 2025
                    </h5>
                    <p className="font-normal text-gray-300 dark:text-gray-400">
                        10 days traveling on route 66
                    </p>
                    <Button>Submit</Button>
                </Card>
                </div>
            </section>
                <hr/>
            <section className="w-full bg-gray-400 py-6">
                <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                        <h2 className='text-3xl font-extrabold text-center mb-6'>Health & Fitness</h2>
                        <Button>See Gallery</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-4">
                            <div className='flex flex-col items-center '>
                                <PhotoCard title='Route 66 2025' description='10 days of cruising this highway' imageSrc='img_6.png'
                                           altText='highway leading into sunset'/>
                                <Button>Default</Button>
                            </div>
                            <div className='flex flex-col items-center '>
                                <PhotoCard title='Route 66 2025' description='10 days of cruising this highway' imageSrc='img_6.png'
                                           altText='highway leading into sunset'/>
                                <Button>Default</Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                        <h2 className='text-3xl font-extrabold text-center mb-6'>Learning</h2>
                        <Button>See Gallery</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-4">
                            <div className='flex flex-col items-center '>
                                <PhotoCard title='Route 66 2025' description='10 days of cruising this highway' imageSrc='img_6.png'
                                           altText='highway leading into sunset'/>
                                <Button>Default</Button>
                            </div>
                            <div className='flex flex-col items-center '>
                                <PhotoCard title='Route 66 2025' description='10 days of cruising this highway' imageSrc='img_6.png'
                                           altText='highway leading into sunset'/>
                                <Button>Default</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-white py-6">
                <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                            <h2 className='text-3xl font-extrabold text-center mb-6'>Food</h2>
                            <Button>See Gallery</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-4">
                            <div className='flex flex-col items-center '>
                                <PhotoCard title='Route 66 2025' description='10 days of cruising this highway' imageSrc='img_6.png'
                                           altText='highway leading into sunset'/>
                                <Button>Default</Button>
                            </div>
                            <div className='flex flex-col items-center '>
                                <PhotoCard title='Route 66 2025' description='10 days of cruising this highway' imageSrc='img_6.png'
                                           altText='highway leading into sunset'/>
                                <Button>Default</Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                            <h2 className='text-3xl font-extrabold text-center mb-6'>Group Goals???</h2>
                            <Button>See Gallery</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-4 pb-10">
                            <div className='flex flex-col items-center'>
                            <PhotoCard title='Route 66 2025' description='10 days of cruising this highway' imageSrc='img_6.png'
                                       altText='highway leading into sunset'/>
                                <Button>Default</Button>
                            </div>
                            <div className='flex flex-col items-center '>
                            <PhotoCard title='Route 66 2025' description='10 days of cruising this highway' imageSrc='img_6.png'
                                       altText='highway leading into sunset'/>
                                <Button>Default</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}