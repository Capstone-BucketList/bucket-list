

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