"use client";

import { Card } from "flowbite-react";

type PhotoCardProps = {
    title: string;
    description: string;
    imageSrc: string;
    altText?: string;
};

export default function PhotoCard({title, description, imageSrc, altText = "photo"}: PhotoCardProps) {
    return (
        <Card className="max-w-sm">
            <div className='w-full aspect-[4/3] overflow-hidden rounded=lg'>
            <img src={imageSrc} alt={altText} className="w-full h-[300px] object-cover rounded-lg"/>
            </div>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {title}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                {description}
            </p>
        </Card>
    );
}