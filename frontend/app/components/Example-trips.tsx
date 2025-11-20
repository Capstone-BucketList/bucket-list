import React from "react";



const exampleTrips = [
    {
        title: "Climb Mount ",
        description: "Experience the highest peak in Africa. 12 Invites x 8 days x 1 Awesome Roadtrip" +
            " February 20 - March 1, 2024",
        image: "/trips/img.png",
    },
    {
        title: "Explore the Great Barrier Reef",
        description: "Dive into the world's largest coral reef system. 10 Invites x 7 days x 1 Unforgettable Journey",
        image: "/trips/img_1.png",
    },
    {
        title: "Visit Machu Picchu",
        description: "Discover the ancient Incan city in Peru. 8 Invites x 6 days x 1 Historic Adventure",
        image: "/trips/img_2.png",
    },
    {
        title: "Swimming in Hawaii",
        description: "See the islands and experience Hawaii. 5 Invites x 5 days x 1 Tropical Escape",
        image: "https://res.cloudinary.com/dgkckqptm/image/upload/v1763674511/img_3_t7lktv.png",
    },
];

// Card component
export function TripCard({ title, description, image }: { title: string; description: string; image: string }) {
    return (
        <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg mb-1">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
}

// Section component
export function BucketListExamplesSection() {
    return (
        <section className="py-16 bg-indigo-50 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-10">Cross Things Off Your Bucket List</h2>
            <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12">
                Get inspired by some amazing trips and adventures others are ticking off their lists.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {exampleTrips.map((trip, idx) => (
                    <TripCard key={idx} {...trip} />
                ))}
            </div>
        </section>
    );
}
