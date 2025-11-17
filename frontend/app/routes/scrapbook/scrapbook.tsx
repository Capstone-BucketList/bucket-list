import {Button, Carousel} from "flowbite-react";
import PhotoCard from "../../components/photo-card";
import React, { useState } from 'react';
import {DivSlider} from "~/components/div_slider";


const travelPhotos: PhotoData[] = [
    { title: 'Balloon Fiesta', description: 'hot air balloon view.', imageSrc: '/scrapbook/img_4.png' },
    { title: 'Sandia Mountain hike', description: 'Hiking open trails up the mountain.', imageSrc: '/scrapbook/img_5.png' },
    { title: 'Road trip on route 66', description: 'Driving west for 10 days on route 66.', imageSrc: '/scrapbook/img_6.png' },
    {title: 'Backpacking Europe', description: 'much more scenery while hiking.', imageSrc: '/scrapbook/img_16.png' },
    {title: 'Hawaii Beaches', description: 'Relaxing on the sandy shores.', imageSrc: '/scrapbook/img_17.png' },
    {title: 'San Fransisco', description: 'hilltop views of Alcatraz', imageSrc:'/scrapbook/img_18.png' },
    {title: 'South Lake Tahoe', description: 'snow mountains and lake views', imageSrc: '/scrapbook/img_19.png' },
];

const healthPhotos: PhotoData[] = [
    { title: 'Morning Yoga', description: 'Sunrise stretching session.', imageSrc: '/scrapbook/img_7.png' },
    { title: 'Trail Run', description: 'Running through foothills.', imageSrc: '/scrapbook/img_8.png' },
    { title: 'Healthy Meals', description: 'Colorful plant-based dishes.', imageSrc: '/scrapbook/img_9.png' },
    {title:'Massage Healing', description: 'soothing massage for recovery', imageSrc: '/scrapbook/img_20.png' },
    {title: 'Nature Hot Spring', description: 'Relaxing in natural hot springs.', imageSrc: '/scrapbook/img_21.png' },
    {title:'Grilling more', description: 'cook your own food, less grease', imageSrc: '/scrapbook/img_22.png' },
];

const learningPhotos: PhotoData[] = [
    { title: 'CNM Campus', description: 'Learning hub in Albuquerque.', imageSrc: '/scrapbook/img_10.png' },
    { title: 'Coding Bootcamp', description: 'Hands-on JavaScript workshop.', imageSrc: '/scrapbook/img_11.png' },
    { title: 'Library Study', description: 'Quiet reading space.', imageSrc: '/scrapbook/img_12.png' },
    {title: 'Learning guitar', description: 'practicing chords and strumming', imageSrc: '/scrapbook/img_23.png' },
    {title: 'How to Paint', description: 'exploring colors on canvas', imageSrc: '/scrapbook/img_24.png' },
    {title: 'Photography Class', description: 'capturing moments through lens', imageSrc: '/scrapbook/img_25.png' },
];

const groupGoalPhotos: PhotoData[] = [
    { title: 'Community Garden', description: 'Planting together.', imageSrc: '/scrapbook/img_13.png' },
    { title: 'Scrapbook Planning', description: 'Team layout session.', imageSrc: '/scrapbook/img_14.png' },
    { title: 'Group Hike', description: 'Exploring Sandia together.', imageSrc: '/scrapbook/img_15.png' },
    { title: 'Volunteering', description: 'group volunteering at animal shelter', imageSrc:'/scrapbook/img_26.png' },
    { title: 'Team Sports', description: 'playing soccer on weekends', imageSrc:'/scrapbook/img_27.png' },
    { title: 'Book Club', description: 'discussing novels monthly', imageSrc:'/scrapbook/img_28.png' },
];
    // add more photo objects here

export type PhotoData = {
    title: string;
    description: string;
    imageSrc: string;
    altText?: string;
};

export default function Scrapbook () {
    const [activeCard, setActiveCard] = useState<PhotoData | null>(null);
    return(
        <>
            <div className="flex w-full justify-between border-gray-200 bg-gradient-to-r from-amber-600 to-golden p-4">
                <div className="mx-auto flex items-center">
                    <h1 className="font-extrabold whitespace-nowrap text-4xl">
                        Your Collection of Memories
                    </h1>
                </div>
            </div>
            <section className='w-full bg-gray-200 px-2 pt-5 pb-5' >
                <div className='flex flex-col items-center mb-6'>
                    <h2 className='text-3xl font-extrabold text-center mb-4 ' >Travel</h2>
                    <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 mt-2'>Call-to-action</Button>
                </div>
                    <div className='w-full max-w-4xl mx-auto relative h-[500px]'>
                        <DivSlider
                        photo={travelPhotos}
                        wanderListProp={[]}
                        onPhotoClick={(photo) => setActiveCard(photo)}/>
                    </div>
            </section>
            <section className="w-full bg-violet-600 py-6">
                <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                        <h2 className='text-3xl font-extrabold text-center mb-6'>Health & Fitness</h2>
                        <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 mt-2'>Call-to-Action</Button>
                        </div>
                        <div className='w-full max-w-4xl mx-auto relative h-[500px]'>
                            <DivSlider
                                photo={healthPhotos}
                                wanderListProp={[]}
                                onPhotoClick={(photo) => setActiveCard(photo)}/>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-gray-200 py-6">
                <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                        <h2 className='text-3xl font-extrabold text-center mb-6'>Learning</h2>
                        <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 mt-2'>Call-to-Action</Button>
                        </div>
                        <div className='w-full max-w-4xl mx-auto relative h-[500px]'>
                            <div className='w-full max-w-4xl mx-auto relative h-[500px]'>
                                <DivSlider
                                    photo={learningPhotos}
                                    wanderListProp={[]}
                                    onPhotoClick={(photo) => setActiveCard(photo)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-violet-600 py-6 mb-12">
                <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                            <h2 className='text-3xl font-extrabold text-center mb-6'>Group Goals</h2>
                            <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 mt-2'>Call-to-Action</Button>
                        </div>
                        <div className='w-full max-w-4xl mx-auto relative h-[500px]'>
                            <div className='w-full max-w-4xl mx-auto relative h-[500px]'>
                                <DivSlider
                                    photo={groupGoalPhotos}
                                    wanderListProp={[]}
                                    onPhotoClick={(photo) => setActiveCard(photo)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {activeCard && (
                <div className="fixed inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setActiveCard(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                        >
                            ✕
                        </button>

                        {/* Image Preview */}
                        <img
                            src={activeCard.imageSrc}
                            alt={activeCard.altText || activeCard.title}
                            className="w-full h-auto rounded mb-4 max-h-[85vh] object-contain"
                        />

                        {/* Editable Fields */}
                        <input
                            type="text"
                            defaultValue={activeCard.title}
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Edit title"
                        />
                        <textarea
                            defaultValue={activeCard.description}
                            className="w-full mb-4 p-2 border rounded"
                            placeholder="Edit description"
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => alert("Changes submitted!")}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: activeCard.title,
                                            text: activeCard.description,
                                            url: window.location.href,
                                        });
                                    } else {
                                        alert("Sharing not supported on this browser.");
                                    }
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
