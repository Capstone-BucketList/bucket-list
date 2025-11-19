import type {WanderList} from "~/utils/models/wanderlist.model";

type wanderListProps={
    wanderList : WanderList
}

export function ListItems(props:wanderListProps) {

    const {wanderList} = props;
    console.log("listitem", wanderList);
    return (
        <>
            <div
                className="items-center bg-gray-50 rounded-lg shadow sm:flex" id={wanderList.id}>
                <div className="p-5">
                    <h3 className="text-xl tracking-tight text-gray-900 font-baga">
                        {wanderList.title}
                    </h3>
                    <p className="mt-3 mb-4 font-light text-gray-500 font-eaves"> {wanderList.description}</p>
                    {/*<ul className="flex space-x-4 sm:mt-0">*/}
                    {/*    <li>*/}
                    {/*        /!*<a href=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">*!/*/}
                    {/*        /!*    <path fill-rule="evenodd" d="M8.586 2.575A2.004 2.004 0 0 1 10 1.99h4a2.001 2.001 0 0 1 2 1.992v1.991h3c.552 0 1 .446 1 .996s-.448.995-1 .995v11.948c0 .528-.21 1.035-.586 1.408a2.004 2.004 0 0 1-1.414.584H7c-.53 0-1.04-.21-1.414-.584A1.987 1.987 0 0 1 5 19.913V7.965c-.552 0-1-.445-1-.995s.448-.996 1-.996h3V3.983c0-.528.21-1.035.586-1.408ZM10 5.974h4V3.983h-4v1.991Zm1 3.983a.998.998 0 0 0-1-.996c-.552 0-1 .446-1 .996v7.965c0 .55.448.996 1 .996s1-.446 1-.996V9.957Zm4 0a.998.998 0 0 0-1-.996c-.552 0-1 .446-1 .996v7.965c0 .55.448.996 1 .996s1-.446 1-.996V9.957Z" clip-rule="evenodd"/>*!/*/}
                    {/*        /!*</svg>*!/*/}
                    {/*        /!*</a>*!/*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <a href="">*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <a href="">*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <a href="">*/}
                    {/*        </a>*/}

                    {/*    </li>*/}
                    {/*</ul>*/}
                     {/* Modal toggle */}
                    <div className="flex justify-center m-5">
                        <button id="deleteButton" data-modal-target="deleteModal" data-modal-toggle="deleteModal" className="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8.586 2.575A2.004 2.004 0 0 1 10 1.99h4a2.001 2.001 0 0 1 2 1.992v1.991h3c.552 0 1 .446 1 .996s-.448.995-1 .995v11.948c0 .528-.21 1.035-.586 1.408a2.004 2.004 0 0 1-1.414.584H7c-.53 0-1.04-.21-1.414-.584A1.987 1.987 0 0 1 5 19.913V7.965c-.552 0-1-.445-1-.995s.448-.996 1-.996h3V3.983c0-.528.21-1.035.586-1.408ZM10 5.974h4V3.983h-4v1.991Zm1 3.983a.998.998 0 0 0-1-.996c-.552 0-1 .446-1 .996v7.965c0 .55.448.996 1 .996s1-.446 1-.996V9.957Zm4 0a.998.998 0 0 0-1-.996c-.552 0-1 .446-1 .996v7.965c0 .55.448.996 1 .996s1-.446 1-.996V9.957Z" clip-rule="evenodd"/></svg>
                        </button>
                    </div>

                    {/* Main modal */}
                    <div id="deleteModal" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                        <div className="relative p-4 w-full max-w-md h-full md:h-auto">

                            {/* Modal content */}
                            <div className="relative p-4 text-center bg-white rounded-lg shadow  sm:p-5">
                                <button type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="deleteModal">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <svg className="text-gray-400  w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                                <p className="mb-4 text-gray-500">Are you sure you want to delete this item?</p>
                                <div className="flex justify-center items-center space-x-4">
                                    <button data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10">
                                        No, cancel
                                    </button>
                                    <button type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300">
                                        Yes, I'm sure
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}