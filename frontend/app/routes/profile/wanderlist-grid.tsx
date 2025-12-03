import React from "react";
import { type WanderList } from "~/utils/models/wanderlist.model";
import { Card } from "flowbite-react";
import { FaTrash } from "react-icons/fa";
import { Form } from "react-router";

type Props = {
    wonderlistItems: WanderList[];
    openEditModal: (item: WanderList) => void;
};

export default function WanderListGrid({ wonderlistItems, openEditModal }: Props) {

    if (!wonderlistItems || wonderlistItems.length === 0) {
        return (
            <div className="rounded-md py-10 px-8 text-center bg-amber-50 border border-amber-200">
                <p className="text-xl font-semibold text-amber-700 mb-2">
                    Your wanderlist is empty
                </p>
                <p className="text-gray-600 mb-6">
                    Add places, experiences, and ideas to start building your bucketlist.
                </p>
            </div>
        );
    }

    return (
        <div className="h-120 overflow-y-auto pr-2 md:pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {wonderlistItems.map((item, i) => (
                    <div key={i}>
                        <Card className="h-full text-center hover:shadow-lg transition duration-200 p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-4">{item.description}</p>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-5 justify-end items-center mt-auto">
                                <Form method="POST">
                                    <input type="hidden" name="id" value={item.id} />
                                    <input type="hidden" name="mode" value="delete" />
                                    <button
                                        id="deleteButton"
                                        type="submit"
                                        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 text-center"
                                    >
                                        <FaTrash />
                                    </button>
                                </Form>

                                <button
                                    id={item.id}
                                    onClick={() => openEditModal(item)}
                                    className="px-3 sm:px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition text-xs sm:text-sm whitespace-nowrap"
                                >
                                    Edit
                                </button>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
