

export function ListItems() {
    return (
        <>
            <div
                className="items-center bg-gray-50 rounded-lg shadow sm:flex">
                <a href="#">
                    <img className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                         src="https://placehold.co/200x200" alt="" />
                </a>
                <div className="p-5">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">
                        <a href="#">Backpack across Europe</a>
                    </h3>
                    {/*<span className="text-gray-500 dark:text-gray-400">CEO & Web Developer</span>*/}
                    <p className="mt-3 mb-4 font-light text-gray-500">Bonnie drives
                        the technical strategy of the flowbite platform and brand.</p>
                    <ul className="flex space-x-4 sm:mt-0">
                        <li>
                            <a href=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8.586 2.575A2.004 2.004 0 0 1 10 1.99h4a2.001 2.001 0 0 1 2 1.992v1.991h3c.552 0 1 .446 1 .996s-.448.995-1 .995v11.948c0 .528-.21 1.035-.586 1.408a2.004 2.004 0 0 1-1.414.584H7c-.53 0-1.04-.21-1.414-.584A1.987 1.987 0 0 1 5 19.913V7.965c-.552 0-1-.445-1-.995s.448-.996 1-.996h3V3.983c0-.528.21-1.035.586-1.408ZM10 5.974h4V3.983h-4v1.991Zm1 3.983a.998.998 0 0 0-1-.996c-.552 0-1 .446-1 .996v7.965c0 .55.448.996 1 .996s1-.446 1-.996V9.957Zm4 0a.998.998 0 0 0-1-.996c-.552 0-1 .446-1 .996v7.965c0 .55.448.996 1 .996s1-.446 1-.996V9.957Z" clip-rule="evenodd"/>
                            </svg>
                            </a>
                        </li>
                        <li>
                            <a href="">
                            </a>
                        </li>
                        <li>
                            <a href="">
                            </a>
                        </li>
                        <li>
                            <a href="">
                            </a>

                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}