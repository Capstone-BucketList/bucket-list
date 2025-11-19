import {ListItems} from "~/routes/profile/list-items";
import {ProgressBars} from "~/routes/profile/progress-bars";
import {Timeline} from "~/routes/profile/timeline";
import {getSession} from "~/utils/session.server";
import type { Route } from "./+types/dashboard";
import {getWanderListByProfileId, WanderListSchema} from "~/utils/models/wanderlist.model";
import {redirect} from "react-router";
import {useState, useEffect} from "react";

export async function loader({request}: Route.LoaderArgs) {
    //Get existing session from cookie
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie)

    const profile = session.get("profile");
    const authorization = session.get("authorization");


    if (!profile || !authorization || !cookie) {
        return redirect("/sign-in");
    }
    //  get wonderlist items by profileId
    const wanderList  =[]//await getWanderListByProfileId(profile.id, authorization, cookie) //profile.id)



    return {profile, wanderList}

}


export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { profile, wanderList: initialWanderList } = loaderData ?? {};

    if (!profile) {
        redirect("/");
    }

    const { userName, email, bio, profilePicture } = profile ?? {};

    const [wanderList, setWanderList] = useState(initialWanderList || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null as null | { id: string; name: string });
    const [modalInput, setModalInput] = useState("");
    const [modalInputTitle, setModalInputTitle] = useState("");
    const [modalInputDescription, setModalInputDescription] = useState("");
    const [modalInputDateCreated, setModalInputDateCreated] = useState(() => new Date().toISOString().slice(0,10)); // today
    const [modalInputTargetDate, setModalInputTargetDate] = useState("");
    const [modalInputPinned, setModalInputPinned] = useState(false);
    const [modalInputStatus, setModalInputStatus] = useState("Not Started");
    const [modalInputVisibility, setModalInputVisibility] = useState("public");

    // Lock scroll when modal open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isModalOpen]);

    // Open modal for adding new item
    const openAddModal = () => {
        setEditingItem(null);
        setModalInput("");
        setIsModalOpen(true);
    };

    // Open modal for editing existing item
    const openEditModal = (item: { id: string; name: string }) => {
        setEditingItem(item);
        setModalInput(item.name);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalInput("");
        setEditingItem(null);
    };

    const handleSave = () => {
        if (!modalInput.trim()) {
            alert("Please enter a name");
            return;
        }

        if (editingItem) {
            // Edit existing
            setWanderList((prev) =>
                prev.map((item) =>
                    item.id === editingItem.id ? { ...item, name: modalInput } : item
                )
            );
        } else {
            // Add new
            setWanderList((prev) => [
                ...prev,
                {
                    id: `new-${Date.now()}`,
                    name: modalInput,
                },
            ]);
        }
        closeModal();
    };

    const statusOptions = [
        "Not Started",
        "In Progress",
        "On Hold",
        "Completed",
    ];
    return (
        <>
            <div
                className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 relative overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 py-12 w-full"
                style={{
                    backgroundImage:
                        `url('https://www.transparenttextures.com/patterns/asfalt-light.png'), linear-gradient(to top right, #e0e7ff, #fef3c7)`,
                    backgroundRepeat: "repeat, no-repeat",
                    backgroundSize: "auto, cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Profile header */}
                <header className="mb-12 flex flex-col sm:flex-row items-center gap-6 w-full">
                    <img
                        src={profilePicture || "/images/avatar-placeholder.png"}
                        alt={`${userName ?? "User"} avatar`}
                        className="w-28 h-28 rounded-full object-cover ring-2 ring-offset-1 ring-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-4xl font-extrabold text-gray-900">{userName || "Anonymous"}</h1>
                        <p className="text-sm text-gray-600 italic">{email}</p>
                        <p className="mt-3 text-gray-700 max-w-prose">{bio || "No bio yet — tell people about your journey!"}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow transition"
                            >
                                {/* Pencil icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden
                                >
                                    <path d="M17.414 2.586a2 2 0 010 2.828L8.121 14.707a1 1 0 01-.464.263l-4 1a1 1 0 01-1.212-1.212l1-4a1 1 0 01.263-.464L14.586 2.586a2 2 0 012.828 0z" />
                                </svg>
                                Add Wander
                            </button>

                            <span className="ml-auto text-sm text-gray-500">Member since <strong>2025</strong></span>
                        </div>
                    </div>
                </header>

                {/* Main grid - FULL WIDTH */}
                <main
                    className="w-full grid grid-cols-1 lg:grid-cols-4 gap-10"
                    style={{ minHeight: "70vh" }}
                >
                    {/* LEFT + MIDDLE - Wanderlist + Posts */}
                    <section className="lg:col-span-3 space-y-10">
                        {/* Wanderlist */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">My Wanderlist</h2>
                                <div className="text-sm text-gray-500">{wanderList.length} items</div>
                            </div>

                            {wanderList.length === 0 ? (
                                <div className="rounded-md py-10 px-8 text-center bg-amber-50 border border-amber-200">
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                        </svg>
                                        Add first item
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-8 md:grid-cols-2">
                                    {wanderList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col"
                                        >
                                            <ListItems wanderList={item} />

                                            {/* Controls - Edit button */}
                                            <div className="mt-4 flex justify-end">
                                                <button
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
                        </section>

                        {/* My Posts */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">My Posts</h2>
                                <a
                                    href="#"
                                    className="text-amber-600 hover:underline font-semibold"
                                >
                                    View all
                                </a>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                {/* Example posts - replace with your real data */}
                                <article className="p-6 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-bold mb-2">How to quickly deploy a static website</h3>
                                    <p className="text-gray-700 mb-4">
                                        Static websites are now used to bootstrap lots of websites and are becoming the basis for many modern tools.
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>14 days ago</span>
                                        <a href="#" className="text-amber-600 hover:underline">Read more</a>
                                    </div>
                                </article>

                                <article className="p-6 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-bold mb-2">Our first project with React</h3>
                                    <p className="text-gray-700 mb-4">
                                        A short write-up about the lessons from our first React project and what we learned along the way.
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>14 days ago</span>
                                        <a href="#" className="text-amber-600 hover:underline">Read more</a>
                                    </div>
                                </article>
                            </div>
                        </section>
                    </section>

                    {/* RIGHT Sidebar - Friends + Progress + Timeline */}
                    <aside className="space-y-10">
                        {/* Friends */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Friends</h3>
                                <a href="#" className="text-gray-500 hover:underline">
                                    See all
                                </a>
                            </div>

                            <div className="flex flex-wrap justify-start">
                                {/* Example friend cards */}
                                <FriendCard name="Bonnie" role="CEO" img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png" />
                                <FriendCard name="Helene" role="CTO" img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" />
                                <FriendCard name="Jese" role="SEO" img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" />
                                <FriendCard name="Joseph" role="Sales" img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png" />
                            </div>
                        </section>

                        {/* Progress Bars */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">My Journey</h3>
                            <p className="text-gray-500 mb-6">
                                Progress on your wanderlists and milestones.
                            </p>
                            <div className="space-y-5">
                                <ProgressBars />
                                <ProgressBars />
                                <ProgressBars />
                            </div>
                        </section>

                        {/* Timeline */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <ol className="space-y-4">
                                {[1, 2, 3].map((num) => (
                                    <li key={num} className="flex items-start gap-4">
                    <span className="mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-semibold">
                      {num}
                    </span>
                                        <div className="text-gray-700">
                                            <Timeline />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </aside>
                </main>

                {/* MODAL */}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        onClick={closeModal}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") closeModal();
                        }}
                    >
                        <div
                            className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-lg relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3
                                id="modal-title"
                                className="text-2xl font-semibold text-gray-900 mb-6"
                            >
                                {editingItem ? "Edit Wander Item" : "Add New Wander Item"}
                            </h3>

                            {/* Title */}
                            <label className="block mb-4">
                                <span className="text-gray-700 font-medium">Title</span>
                                <input
                                    type="text"
                                    placeholder="Enter title"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    value={modalInputTitle}
                                    onChange={(e) => setModalInputTitle(e.target.value)}
                                    autoFocus
                                />
                            </label>

                            {/* Description */}
                            <label className="block mb-4">
                                <span className="text-gray-700 font-medium">Description</span>
                                <textarea
                                    placeholder="Enter description"
                                    rows={4}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                                    value={modalInputDescription}
                                    onChange={(e) => setModalInputDescription(e.target.value)}
                                />
                            </label>

                            {/* Date Created */}
                            <label className="block mb-4">
                                <span className="text-gray-700 font-medium">Date Created</span>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-100 cursor-not-allowed"
                                    value={modalInputDateCreated}
                                    readOnly
                                />
                            </label>

                            {/* Target Date */}
                            <label className="block mb-4">
                                <span className="text-gray-700 font-medium">Target Completion Date</span>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    value={modalInputTargetDate}
                                    onChange={(e) => setModalInputTargetDate(e.target.value)}
                                />
                            </label>

                            {/* Pinned */}
                            <label className="inline-flex items-center mb-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-amber-500"
                                    checked={modalInputPinned}
                                    onChange={(e) => setModalInputPinned(e.target.checked)}
                                />
                                <span className="ml-2 text-gray-700 font-medium">Pinned as Favorite</span>
                            </label>

                            {/* Wanderlist Status */}
                            <label className="block mb-4">
                                <span className="text-gray-700 font-medium">Wanderlist Status</span>
                                <select
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    value={modalInputStatus}
                                    onChange={(e) => setModalInputStatus(e.target.value)}
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </label>

                            {/* Visibility */}
                            <fieldset className="mb-6">
                                <legend className="text-gray-700 font-medium mb-2">Visibility</legend>
                                <label className="inline-flex items-center mr-6 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="public"
                                        checked={modalInputVisibility === "public"}
                                        onChange={() => setModalInputVisibility("public")}
                                        className="form-radio text-amber-500"
                                    />
                                    <span className="ml-2 text-gray-700">Public</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="private"
                                        checked={modalInputVisibility === "private"}
                                        onChange={() => setModalInputVisibility("private")}
                                        className="form-radio text-amber-500"
                                    />
                                    <span className="ml-2 text-gray-700">Private</span>
                                </label>
                            </fieldset>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={closeModal}
                                    className="rounded-lg px-5 py-3 bg-gray-300 hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="rounded-lg px-5 py-3 bg-amber-500 text-white hover:bg-amber-600 transition"
                                >
                                    {editingItem ? "Save" : "Add"}
                                </button>
                            </div>

                            {/* Close button */}
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={closeModal}
                                aria-label="Close modal"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );


    function FriendCard({
                            name,
                            role,
                            img,
                        }: {
        name: string;
        role: string;
        img: string;
    }) {
        return (
            <div className="flex items-center gap-4">
                <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={img}
                    alt={`${name} avatar`}
                />
                <div>
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">{role}</p>
                </div>
            </div>
        );
    } }