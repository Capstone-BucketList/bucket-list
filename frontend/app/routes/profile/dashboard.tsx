import {ListItems} from "~/routes/profile/list-items";
import {ProgressBars} from "~/routes/profile/progress-bars";
import {Timeline} from "~/routes/profile/timeline";

export default function Dashboard() {
    return (
        < >
            {/*/!*Sub-Header*!/*/}
            {/*<nav className="bg-white border-gray-200">*/}
            {/*    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">*/}
            {/*        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">*/}
            {/*            <h1*/}
            {/*                className="self-center text-xl font-semibold whitespace-nowrap">Welcome back, Name!</h1>*/}
            {/*        </a>*/}
            {/*        <button data-collapse-toggle="navbar-dropdown" type="button"*/}
            {/*                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"*/}
            {/*                aria-controls="navbar-dropdown" aria-expanded="false">*/}
            {/*            <span className="sr-only">Open main menu</span>*/}
            {/*            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"*/}
            {/*                 viewBox="0 0 17 14">*/}
            {/*                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"*/}
            {/*                      d="M1 1h15M1 7h15M1 13h15"/>*/}
            {/*            </svg>*/}
            {/*        </button>*/}
            {/*        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">*/}
            {/*            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">*/}
            {/*                <li>*/}
            {/*                    <a href="#"*/}
            {/*                       className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0"*/}
            {/*                       aria-current="page">Home</a>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar"*/}
            {/*                            className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto">Dropdown <svg*/}
            {/*                        className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"*/}
            {/*                        fill="none" viewBox="0 0 10 6">*/}
            {/*                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"*/}
            {/*                              stroke-width="2" d="m1 1 4 4 4-4"/>*/}
            {/*                    </svg></button>*/}
            {/*                    /!*Dropdown menu*!/*/}
            {/*                    <div id="dropdownNavbar"*/}
            {/*                         className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44">*/}
            {/*                        <ul className="py-2 text-sm text-gray-700"*/}
            {/*                            aria-labelledby="dropdownLargeButton">*/}
            {/*                            <li>*/}
            {/*                                <a href="#"*/}
            {/*                                   className="block px-4 py-2 hover:bg-gray-100">Dashboard</a>*/}
            {/*                            </li>*/}
            {/*                            <li>*/}
            {/*                                <a href="#"*/}
            {/*                                   className="block px-4 py-2 hover:bg-gray-100">Settings</a>*/}
            {/*                            </li>*/}
            {/*                            <li>*/}
            {/*                                <a href="#"*/}
            {/*                                   className="block px-4 py-2 hover:bg-gray-100">Earnings</a>*/}
            {/*                            </li>*/}
            {/*                        </ul>*/}
            {/*                        <div className="py-1">*/}
            {/*                            <a href="#"*/}
            {/*                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign*/}
            {/*                                out</a>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <a href="#"*/}
            {/*                       className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Services</a>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <a href="#"*/}
            {/*                       className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Pricing</a>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <a href="#"*/}
            {/*                       className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Contact</a>*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</nav>*/}


                {/* Bucket List Section */}
            {/*<section>*/}
            {/*    @todo: add logic to only show if no items in bucket list*/}
                    {/*    <section className="bg-burnt-orange rounded-xl shadow-md mx-20 my-4"> /!* start empty bucket list*/}
                    {/*     section*!/*/}
                    {/*        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">*/}
                    {/*            <div className="mx-auto max-w-screen-sm text-center">*/}
                    {/*                <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-200 drop-shadow-lg">It looks like you haven't added any tasks to your bucket!</h2>*/}
                    {/*                <p className="mb-6 font-light text-black md:text-lgg">Add your first wish or event by clicking below.</p>*/}
                    {/*                <a href="#"*/}
                    {/*                   className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Start my bucket list!</a>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        */}
                    {/*    </section> /!* end empty bucket list section *!/*/}
                    {/*</section> /!* end bucket list section*!/*/}
                {/*</section>*/}

            <section>
                <section className="bg-seafoam">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">My Bucket
                                List</h2>
                            <p className="font-light text-black lg:mb-16 sm:text-xl">Explore the
                                whole collection of open-source web components and elements built with the utility
                                classes from Tailwind</p>
                        </div>
                        <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                            <ListItems/>
                            <ListItems/>
                            <ListItems/>
                            <ListItems/>
                            <ListItems/>
                            <ListItems/>
                            <ListItems/>
                        </div>
                    </div>
                </section>

                {/*Progress Section*/}
                {/*Progress Bars*/}
                <section className="w-3/4 mx-auto p-8 m-8">
                    <div
                        className="w-full p-8 text-center sm:p-8">
                        <h5 className="mb-2 text-3xl font-bold text-cyan-700">Work fast from anywhere</h5>
                        <p className="mb-5 text-base text-gray-500 sm:text-lg">Stay up to date and move
                            work forward with Flowbite on iOS & Android. Download the app today.</p>
                        <ProgressBars />
                        <ProgressBars />
                        <ProgressBars />
                        <ProgressBars />
                    </div>
                </section>



                {/*Timeline*/}
                <section className="w-3/4 mx-auto m-8">

                    <ol className="items-center grid grid-cols-3 gap-8">
                        <li><Timeline /></li>
                        <li><Timeline /></li>
                        <li><Timeline /></li>
                        <li><Timeline /></li>
                        <li><Timeline /></li>
                        <li><Timeline /></li>
                    </ol>
                </section>

            </section>
        </>
    )
}