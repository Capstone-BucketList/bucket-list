import React, {useRef} from "react";
import { type WanderList } from "~/utils/models/wanderlist.model";
import {FaPlus} from "react-icons/fa";
import {Button, Card} from "flowbite-react";
import {FaTrash} from "react-icons/fa";
import {Form} from "react-router";

type Props = {
    wanderList: WanderList[];
    openEditModal: (item: WanderList) => void;
};

export default function WanderList({ wanderList, openEditModal }: Props) {
    console.log(wanderList, openEditModal);
    if (!wanderList || wanderList.length === 0) {
        return (<div className="rounded-md py-10 px-8 text-center bg-amber-50 border border-amber-200">
            <p className="text-xl font-semibold text-amber-700 mb-2">
                Your wanderlist is empty
            </p>
            <p className="text-gray-600 mb-6">
                Add places, experiences, and ideas to start building your bucketlist.
            </p>
            <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-amber-500 text-white text-lg font-semibold hover:bg-amber-600 transition"
            >
                <FaPlus/>
                Add first item
            </button>
        </div>)
    }
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

    if (wanderList?.length > 0) {
        return (
            <div className="relative">
                <div
                    ref={containerRef}
                    className="flex overflow-x-hidden scrollbar-hide px-4"
                    style={{scrollSnapType: 'x mandatory'}}
                >
                    {wanderList.map((item, i) => (
                        <div
                            key={i}
                            ref={(el) => {
                                divRefs.current[i] = el;
                            }}
                            className="flex-shrink-0 snap-start p-4 w-1/2 " // Adjust width based on divsPerPage
                            style={{scrollSnapAlign: 'start'}}
                        >
                            <Card className="h-full text-center hover:shadow-lg transition duration-200" key={i}>

                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm"> {item.description} </p>
                                <div className="flex gap-5 justify-end items-center">
                                    <Form method="POST">
                                        <input type="hidden" name="id" value={item?.id} />
                                        <input type="hidden" name="mode" value="delete" />
                                        <button
                                            id="deleteButton"
                                            type="submit"
                                            className="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            <FaTrash />
                                        </button>
                                    </Form>

                                    <button
                                        id={item.id}
                                        onClick={() => openEditModal(item)}
                                        className="px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition"
                                    >
                                        Edit
                                    </button>
                                </div>

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

    }
}
/*
    return (
      /!*  <div className="grid gap-4 md:grid-cols-2">
            {wanderList.map((item) => (
                <div key={item.id} className="p-4 border rounded bg-white shadow">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <button onClick={() => openEditModal(item)} className="mt-2 px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600">
                        Edit
                    </button>
                </div>
            ))}
        </div>*!/
<>
        <div className="grid gap-8 md:grid-cols-2">
            {wanderList?.map((item:WanderListForm) => (
                <div
                    id = {item.id}
                    className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col"
                >
                    <ListItems wanderList={item} />

                    {/!* Controls - Edit button *!/}
                    <div className="mt-4 flex justify-end">
                        <button id = {item.id}
                                onClick={() => openEditModal(item)}
                                className="px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )}
</>*/

