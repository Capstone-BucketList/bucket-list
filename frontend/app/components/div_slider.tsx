import {useRef} from 'react';
import {Button, Card} from 'flowbite-react';
import type {WhyWanderList} from "~/routes/home/home";
import type {PhotoData} from "~/routes/scrapbook/scrapbook";

type dataProp = {
    wanderListProp: WhyWanderList[],
    photo :PhotoData[],
}

export function DivSlider(props:dataProp ) {
    const bList = props?.wanderListProp
    const photoList = props?.photo
    const containerRef = useRef<HTMLDivElement | null>(null);
    const divRefs = useRef<Array<HTMLDivElement | null>>([]); // To store refs for each individual div
    const divsPerPage = 1; // Number of divs to show at a time

    const scrollContainer = (direction: 'left' | 'right') => {
        const container = containerRef.current;
        const firstDiv = divRefs.current[0];

        if (!container || !firstDiv) return;

        const divWidth = firstDiv.offsetWidth;
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

    if(bList?.length >0) {
    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="flex overflow-x-hidden scrollbar-hide px-4"
                style={{scrollSnapType: 'x mandatory'}}
                 >
                {bList.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => { divRefs.current[i] = el; }}
                        className="flex-shrink-0 snap-start p-4 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4" // Adjust width based on divsPerPage
                        style={{ scrollSnapAlign: 'start' }}
                    >
                    <Card className="h-full text-center hover:shadow-lg transition duration-200" key={i}>
                        {item.icon}
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm"> {item.description} </p>
                    </Card>
                    </div>
                ))}
            </div>

            <div className="absolute top-1/2 -left-5 -translate-y-1/2">
                <Button onClick={() => scrollContainer('left')}>&lt;</Button>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2">
                <Button onClick={() => scrollContainer('right')}>&gt;</Button>
            </div>
        </div>
    );
    }else{
        return(
            <div className="relative">
                <div
                    ref={containerRef}
                    className="flex overflow-x-hidden scrollbar-hide px-4"
                    style={{scrollSnapType: 'x mandatory'}}
                >
                    {photoList.map((item, i) => (
                        <div
                            key={i}
                            ref={(el) => { divRefs.current[i] = el; }}
                            className="flex-shrink-0 snap-start p-4 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4" // Adjust width based on divsPerPage
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <Card className="h-full text-center hover:shadow-lg transition duration-200" key={i}>
                                {item.imageSrc}
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm"> {item.description} </p>
                            </Card>
                        </div>
                    ))}
                </div>

                <div className="absolute top-1/2 -left-5 -translate-y-1/2">
                    <Button onClick={() => scrollContainer('left')}>&lt;</Button>
                </div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2">
                    <Button onClick={() => scrollContainer('right')}>&gt;</Button>
                </div>
            </div>
        )
    }
};
