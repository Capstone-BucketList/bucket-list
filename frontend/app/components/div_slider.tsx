import React, { useEffect, useRef } from "react";
import { Button, Card } from "flowbite-react";
import type { WhyWanderList } from "~/routes/home/home";
import type { PhotoData } from "~/routes/scrapbook/photoData";

export type DivSliderProps = {
    photo?: PhotoData[];
    wanderListProp?: WhyWanderList[];
    onPhotoClick?: (photo: PhotoData) => void;
    slideWidthClass?: string;
    imageHeightClass?: string;
    showOverlay?: boolean;
    variant?: "compact" | "large";
    autoScroll?: boolean;
    autoScrollInterval?: number;
};

export function DivSlider(props: DivSliderProps) {
    const {
        photo = [],
        wanderListProp = [],
        onPhotoClick,
        slideWidthClass,
        imageHeightClass,
        showOverlay = true,
        variant = "compact",
        autoScroll = false,
        autoScrollInterval = 4000,
    } = props;

    // sensible defaults for compact (Home) and large (Scrapbook)
    const defaults = {
        compact: {
            slideWidthClass: "w-74 sm:w-82 md:w-90",
            imageHeightClass: "h-60 md:h-76",
        },
        large: {
            slideWidthClass: "w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2",
            imageHeightClass: "h-[360px] md:h-[460px]",
        },
    };

    const finalSlideWidthClass = slideWidthClass ?? defaults[variant].slideWidthClass;
    const finalImageHeightClass = imageHeightClass ?? defaults[variant].imageHeightClass;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const divRefs = useRef<Array<HTMLDivElement | null>>([]);
    const divsPerPage = 1;

    const scrollContainer = (direction: "left" | "right") => {
        const container = containerRef.current;
        const firstDiv = divRefs.current[0];
        if (!container || !firstDiv) return;
        const divWidth = firstDiv.offsetWidth;
        const scrollAmount = divWidth * divsPerPage;
        container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    };

    useEffect(() => {
        if (!autoScroll) return;
        const id = setInterval(() => scrollContainer("right"), autoScrollInterval);
        return () => clearInterval(id);
    }, [autoScroll, autoScrollInterval]);

    const items = (wanderListProp && wanderListProp.length > 0) ? wanderListProp : photo;

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-hidden scrollbar-width:none px-4 py-2"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {items.map((item, i) => {
                    const isPhoto = "imageSrc" in item;
                    return (
                        <div
                            key={i}
                            ref={(el) => (divRefs.current[i] = el)}
                            className={`${finalSlideWidthClass} flex-shrink-0 snap-start`}
                            style={{ scrollSnapAlign: "start" }}
                        >
                            <Card
                                className="p-0 overflow-hidden rounded-lg cursor-pointer"
                                onClick={() => { if (isPhoto) onPhotoClick?.(item as PhotoData); }}
                            >
                                {isPhoto ? (
                                    <div className="relative">
                                        <img
                                            src={(item as PhotoData).imageSrc}
                                            alt={(item as PhotoData).altText || (item as PhotoData).title}
                                            className={`w-full ${finalImageHeightClass} object-cover block`}
                                            loading="lazy"
                                        />
                                        {showOverlay && (
                                            <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                                                <h3 className="text-sm md:text-lg font-semibold">{(item as PhotoData).title}</h3>
                                                <p className="text-xs md:text-sm opacity-90">{(item as PhotoData).description}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        {item.icon}
                                        <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    );
                })}
            </div>

            <div className="absolute top-1/2 -left-5 -translate-y-1/2">
                <Button onClick={() => scrollContainer("left")}>&lt;</Button>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2">
                <Button onClick={() => scrollContainer("right")}>&gt;</Button>
            </div>
        </div>
    );
}