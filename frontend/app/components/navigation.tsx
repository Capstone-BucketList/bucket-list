


export function Navigation() {
    return (
        <>
            {/*Navbar*/}

            <nav className="bg-blue-950 border-b-4 border-bright-light-blue shadow-xl">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"/>
                        <span
                            className="self-center text-2xl font-semibold whitespace-nowrap text-orange-100">WanderList</span>
                    </a>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button"
                                className="flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
                                id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
                                data-dropdown-placement="bottom">
                            <span className="sr-only">Open user menu</span>
                            <img className="w-10 h-10 rounded-full" src="https://placehold.co/300x300"
                                 alt="user photo"/>
                        </button>
                        {/*Dropdown menu*/}
                        <div
                            className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm"
                            id="user-dropdown">
                            <div className="px-4 py-3">
                                <span className="block text-sm text-gray-900">Bonnie Green</span>
                                <span
                                    className="block text-sm  text-gray-500 truncate">name@flowbite.com</span>
                            </div>
                            <ul className="py-2" aria-labelledby="user-menu-button">
                                <li>
                                    <a href="#"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Earnings</a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign
                                        out</a>
                                </li>
                            </ul>
                        </div>
                        <button data-collapse-toggle="navbar-user" type="button"
                                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                aria-controls="navbar-user" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden md:flex md:w-auto md:order-1"
                         id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-blue-950">
                            <li>
                                <a href="/"
                                   className="block py-2 px-3 text-pale-tan rounded-sm hover:bg-gray-100 hover:text-blue-600"
                                   aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="/dashboard"
                                   className="block py-2 px-3 text-pale-tan rounded-sm hover:bg-gray-100 hover:text-blue-600">Dashboard</a>
                            </li>
                            <li>
                                <a href="/community"
                                   className="block py-2 px-3 text-pale-tan rounded-sm hover:bg-gray-100 hover:text-blue-600">Community</a>
                            </li>
                            <li>
                                <a href="/scrapbook"
                                   className="block py-2 px-3 text-pale-tan rounded-sm hover:bg-gray-100 hover:text-blue-600">Scrapbook</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}