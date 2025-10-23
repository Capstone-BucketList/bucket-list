import {useRef} from 'react';
import {Button, Card} from 'flowbite-react';
import type {WhyWanderList} from "~/routes/home/home";

type WanderListProp = {
    wanderListProp: WhyWanderList[]
}

export function DivSlider(props:WanderListProp ) {
    const bList = props.wanderListProp
    const containerRef = useRef<HTMLDivElement | null>(null);
    const divRefs = useRef<Array<HTMLDivElement | null>>([]); // To store refs for each individual div
    const divsPerPage = 1; // Number of divs to show at a time

    const scrollContainer = (direction: 'left' | 'right') => {
        const container = containerRef.current;
        const firstDiv = divRefs.current[0];

        if (!container || !firstDiv) return;

        const divWidth = firstDiv.offsetWidth; // Assuming all divs have same width
        const scrollAmount = divWidth * divsPerPage;

        if (direction === 'left') {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth',
            });
        } else {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="flex overflow-x-hidden scrollbar-hide" // Hide default scrollbar
                style={{scrollSnapType: 'x mandatory'}} // Optional: for smoother snapping
                 >
                {bList.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => { divRefs.current[i] = el; }}
                        className="flex-shrink-0 w-1/4 p-4 h-70" // Adjust width based on divsPerPage
                        style={{ scrollSnapAlign: 'start' }} // Optional: for smoother snapping
                    >
                    <Card className="h-full text-center hover:shadow-lg transition duration-200" key={i}>
                        {item.icon}
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm"> {item.description} </p>
                    </Card>
                    </div>
                ))}
            </div>

            <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <Button onClick={() => scrollContainer('left')}>&lt;</Button>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2">
                <Button onClick={() => scrollContainer('right')}>&gt;</Button>
            </div>
        </div>
    );
};
