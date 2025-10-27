"use client";

import { Card } from "flowbite-react";
import React from 'react';


type PhotoCardProps = {
    title: string;
    description: string;
    imageSrc: string;
    altText?: string;
    onClick?: () => void;
};

export default function PhotoCard({title, description, imageSrc, altText = "photo", onClick}: PhotoCardProps) {
    console.log("Rendering PhotoCard:", { title, imageSrc });

    return (
        <Card className="max-w-sm cursor-pointer" onClick={onClick}>
            <div className='w-full aspect-[4/3] overflow-hidden rounded-lg'>
            <img src={imageSrc} alt={altText} className="w-full h-[300px] object-cover rounded-lg"/>
            </div>
            <h4 className="text-xl font-bold tracking-tight text-gray-900 text-center">
                {title}
            </h4>
            <p className="font-normal">
                {description}
            </p>
        </Card>
    );
}