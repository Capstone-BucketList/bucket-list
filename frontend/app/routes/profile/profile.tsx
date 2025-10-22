import {Avatar} from "flowbite-react";
import {HR} from "flowbite-react";
import {ListItems} from ""

export default function Profile() {
    return (
        <>
            <section className="bg-mainbg">
                @todo: add code to fetch user data and display it here
                <h1>Welcome back, [NAME]!</h1>
                <Avatar img="/images/people/profile-picture-5.jpg" rounded bordered className="size-xl">
                    <div className="space-y-1 font-medium">
                        <div>Jesse Leos</div>
                        <div className="text-sm text-gray-500">Joined in August 2014</div>
                    </div>
                </Avatar>
                <HR />
                <section> {/* start bucket list section */}
                    <h2>My Bucket List</h2>

                    @todo: add logic to only show if no items in bucket list
                    <section className="bg-containerbg rounded-xl shadow-md mx-20 my-4"> {/* start empty bucket list
                     section */}
                        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                            <div className="mx-auto max-w-screen-sm text-center">
                                <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-200">It looks like you haven't added any tasks to your bucket!</h2>
                                <p className="mb-6 font-light text-gray-500 md:text-lg">Add your first wish or event by clicking below.</p>
                                <a href="#"
                                   className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Start my bucket list!</a>
                            </div>
                        </div>
                        <ListItems />
                    </section> {/* end empty bucket list section */}
                </section> {/* end bucket list section*/}

            </section>
        </>
    )
}


