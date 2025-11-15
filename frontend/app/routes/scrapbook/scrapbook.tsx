import {Button, Carousel} from "flowbite-react";
import PhotoCard from "../../components/photo-card";
import React, { useState, useState } from 'react';
import {DivSlider} from "~/components/div_slider";


const travelPhotos: PhotoData[] = [
    { title: 'Balloon Fiesta', description: 'hot air balloon view.', imageSrc: '/img_4.png' },
    { title: 'Sandia Mountain hike', description: 'Hiking open trails up the mountain.', imageSrc: '/img_5.png' },
    { title: 'Road trip on route 66', description: 'Driving west for 10 days on route 66.', imageSrc: '/img_6.png' },
];

const healthPhotos: PhotoData[] = [
    { title: 'Morning Yoga', description: 'Sunrise stretching session.', imageSrc: '/img_7.png' },
    { title: 'Trail Run', description: 'Running through foothills.', imageSrc: '/img_8.png' },
    { title: 'Healthy Meals', description: 'Colorful plant-based dishes.', imageSrc: '/img_9.png' },
];

const learningPhotos: PhotoData[] = [
    { title: 'CNM Campus', description: 'Learning hub in Albuquerque.', imageSrc: '/img_10.png' },
    { title: 'Coding Bootcamp', description: 'Hands-on JavaScript workshop.', imageSrc: '/img_11.png' },
    { title: 'Library Study', description: 'Quiet reading space.', imageSrc: '/img_12.png' },
];

const groupGoalPhotos: PhotoData[] = [
    { title: 'Community Garden', description: 'Planting together.', imageSrc: '/img_13.png' },
    { title: 'Scrapbook Planning', description: 'Team layout session.', imageSrc: '/img_14.png' },
    { title: 'Group Hike', description: 'Exploring Sandia together.', imageSrc: '/img_15.png' },
];
    // add more photo objects here

export type PhotoData = {
    title: string;
    description: string;
    imageSrc: string;
    altText?: string;
};

export function useModal(initial = false) {
    const [isOpen, setIsOpen] = useState(initial);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    return { isOpen, open, close };
}

export default function Scrapbook () {
    const [activeCard, setActiveCard] = useState<PhotoData | null>(null);
    return(
        <>
            <div className="flex w-full justify-between border-gray-200 bg-pale-tan p-4">
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
                    <Carousel>
                        {travelPhotos.map((photo, index) => (
                            <PhotoCard
                                key={index}
                                title={photo.title}
                                description={photo.description}
                                imageSrc={photo.imageSrc}
                                altText={photo.title}
                                onClick={() => setActiveCard(photo)}
                            />
                        ))}
                    </Carousel>
                    </div>
            </section>
            <section  className="w-full bg-turquoise py-6">
                <h1>slider</h1>
                <DivSlider photo ={travelPhotos} wanderListProp={[]}/>
            </section>
            <section className="w-full bg-turquoise py-6">
                <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                        <h2 className='text-3xl font-extrabold text-center mb-6'>Health & Fitness</h2>
                        <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 mt-2'>Call-to-Action</Button>
                        </div>
                        <div className='w-full max-w-4xl mx-auto relative h-[500px]'>
                            <Carousel>
                                {healthPhotos.map((photo, index) => (
                                    <PhotoCard
                                        key={index}
                                        title={photo.title}
                                        description={photo.description}
                                        imageSrc={photo.imageSrc}
                                        altText={photo.title}
                                        onClick={() => setActiveCard(photo)}
                                    />
                                ))}
                            </Carousel>
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
                            <Carousel>
                                {learningPhotos.map((photo, index) => (
                                    <PhotoCard
                                        key={index}
                                        title={photo.title}
                                        description={photo.description}
                                        imageSrc={photo.imageSrc}
                                        altText={photo.title}
                                        onClick={() => setActiveCard(photo)}
                                    />
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-turquoise py-6 mb-12">
                <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
                    <div className="flex-1">
                        <div className='flex flex-col items-center mb-6'>
                            <h2 className='text-3xl font-extrabold text-center mb-6'>Group Goals</h2>
                            <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 mt-2'>Call-to-Action</Button>
                        </div>
                        <div className='w-full max-w-4xl mx-auto relative h-[500px]'>
                            <Carousel>
                                {groupGoalPhotos.map((photo, index) => (
                                    <PhotoCard
                                        key={index}
                                        title={photo.title}
                                        description={photo.description}
                                        imageSrc={photo.imageSrc}
                                        altText={photo.title}
                                        onClick={() => setActiveCard(photo)}
                                    />
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </section>
            {activeCard && (
                <div className="fixed inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
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
                            className="w-full h-auto rounded mb-4"
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

// File: components/div_slider.tsx
// import React from "react";
// import type { ReactNode } from "react";
//
// export type PhotoData = {
//     title: string;
//     description: string;
//     imageSrc: string;
//     altText?: string;
// };
//
// export type WhyWanderList = {
//     icon: ReactNode;
//     title: string;
//     description: string;
// };
//
// type DivSliderProps = {
//     photo?: PhotoData[];
//     wanderListProp?: WhyWanderList[];
//     onItemClick?: (item: PhotoData | WhyWanderList) => void;
//     className?: string;
// };
//
// export const DivSlider: React.FC<DivSliderProps> = ({
//                                                         photo,
//                                                         wanderListProp,
//                                                         onItemClick,
//                                                         className = "",
//                                                     }) => {
//     const items = photo ?? wanderListProp ?? [];
//
//     return (
//         <div className={`overflow-x-auto whitespace-nowrap py-4 ${className}`}>
//             {items.map((item, idx) => {
//                 const isPhoto = Boolean((item as PhotoData).imageSrc);
//                 return (
//                     <div
//                         key={idx}
//                         onClick={() => onItemClick && onItemClick(item)}
//                         role="button"
//                         tabIndex={0}
//                         onKeyDown={() => onItemClick && onItemClick(item)}
//                         className="inline-block mr-4 w-64 rounded-lg shadow-md bg-white cursor-pointer"
//                     >
//                         {isPhoto ? (
//                             <div className="h-40 overflow-hidden rounded-t-lg">
//                                 <img
//                                     src={(item as PhotoData).imageSrc}
//                                     alt={(item as PhotoData).altText ?? (item as PhotoData).title}
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>
//                         ) : (
//                             <div className="p-6 text-center">
//                                 <div className="mb-3">{(item as WhyWanderList).icon}</div>
//                             </div>
//                         )}
//                         <div className="p-4">
//                             <h3 className="font-semibold text-lg">
//                                 {("title" in item && item.title) ?? ""}
//                             </h3>
//                             <p className="text-sm text-gray-600 mt-2">
//                                 {("description" in item && item.description) ?? ""}
//                             </p>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };
//
// export default DivSlider;

// File: frontend/app/routes/scrapbook/scrapbook.tsx
// import React, { useState } from "react";
// import { Button } from "flowbite-react";
// import DivSlider, { PhotoData as SliderPhoto } from "~/components/div_slider";
// import PhotoCard from "~/components/photo_card"; // if you still use PhotoCard anywhere
//
// // Example photo arrays (keep yours)
// const travelPhotos: SliderPhoto[] = [
//     { title: "Beach", description: "Sunny beach", imageSrc: "/img_1.png", altText: "beach" },
//     { title: "Mountain", description: "Snowy peak", imageSrc: "/img_2.png", altText: "mountain" },
// ];
//
// const healthPhotos: SliderPhoto[] = [
//     { title: "Run", description: "Morning run", imageSrc: "/img_3.png" },
// ];
//
// export default function Scrapbook() {
//     const [activeCard, setActiveCard] = useState<SliderPhoto | null>(null);
//
//     function handleSubmitEdits() {
//         alert("Changes submitted!");
//         setActiveCard(null);
//     }
//
//     async function handleShare(card: SliderPhoto) {
//         if (navigator.share) {
//             try {
//                 await navigator.share({
//                     title: card.title,
//                     text: card.description,
//                     url: window.location.href,
//                 });
//             } catch (_) {}
//         } else {
//             alert("Share not supported on this browser");
//         }
//     }
//
//     return (
//         <>
//             <section className="max-w-6xl mx-auto py-8">
//                 <h2 className="text-2xl font-bold mb-4">Travel</h2>
//
//                 {/* Replace Carousel with DivSlider and wire clicks to open modal */}
//                 <DivSlider photo={travelPhotos} onItemClick={(item) => setActiveCard(item as SliderPhoto)} />
//
//                 <h2 className="text-2xl font-bold mt-10 mb-4">Health & Fitness</h2>
//                 <DivSlider photo={healthPhotos} onItemClick={(item) => setActiveCard(item as SliderPhoto)} />
//
//                 {/* add other sections similarly */}
//             </section>
//
//             {/* Modal - unchanged behavior, opens when activeCard is set */}
//             {activeCard && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center">
//                     <div className="absolute inset-0 bg-black/50" onClick={() => setActiveCard(null)} />
//                     <div className="relative bg-white rounded-lg max-w-3xl w-full p-6 z-60">
//                         <button
//                             className="absolute top-3 right-3 text-gray-600"
//                             onClick={() => setActiveCard(null)}
//                         >
//                             Close
//                         </button>
//
//                         <div className="grid md:grid-cols-2 gap-6">
//                             <img
//                                 src={activeCard.imageSrc}
//                                 alt={activeCard.altText ?? activeCard.title}
//                                 className="w-full h-64 object-cover rounded"
//                             />
//
//                             <div>
//                                 <input
//                                     defaultValue={activeCard.title}
//                                     className="w-full border rounded px-3 py-2 mb-3"
//                                 />
//                                 <textarea
//                                     defaultValue={activeCard.description}
//                                     className="w-full border rounded px-3 py-2 mb-3"
//                                 />
//                                 <div className="flex gap-3">
//                                     <Button onClick={handleSubmitEdits}>Submit</Button>
//                                     <Button color="light" onClick={() => handleShare(activeCard)}>
//                                         Share
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
