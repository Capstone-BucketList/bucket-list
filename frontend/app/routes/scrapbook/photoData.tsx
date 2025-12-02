

export type PhotoData = {
    title: string;
    description: string;
    imageSrc: string;
    altText?: string;
    id?: string;
    wanderlistId?: string;
    visibility?: "public" | "private" | "friends";
};

export const travelPhotos: PhotoData[] = [
    { id: "550e8400-e29b-41d4-a716-446655440001", wanderlistId: "550e8400-e29b-41d4-a716-446655440000", visibility: "public", title: "Balloon Fiesta", description: "hot air balloon view.", imageSrc: "/scrapbook/img_4.png" },
    { id: "550e8400-e29b-41d4-a716-446655440002", wanderlistId: "550e8400-e29b-41d4-a716-446655440000", visibility: "public", title: "Sandia Mountain hike", description: "Hiking open trails up the mountain.", imageSrc: "/scrapbook/img_5.png" },
    { id: "550e8400-e29b-41d4-a716-446655440003", wanderlistId: "550e8400-e29b-41d4-a716-446655440000", visibility: "public", title: "Road trip on route 66", description: "Driving west for 10 days on route 66.", imageSrc: "/scrapbook/img_6.png" },
    { id: "550e8400-e29b-41d4-a716-446655440004", wanderlistId: "550e8400-e29b-41d4-a716-446655440000", visibility: "public", title: "Backpacking Europe", description: "much more scenery while hiking.", imageSrc: "/scrapbook/img_16.png" },
    { id: "550e8400-e29b-41d4-a716-446655440005", wanderlistId: "550e8400-e29b-41d4-a716-446655440000", visibility: "public", title: "Hawaii Beaches", description: "Relaxing on the sandy shores.", imageSrc: "/scrapbook/img_17.png" },
    { id: "550e8400-e29b-41d4-a716-446655440006", wanderlistId: "550e8400-e29b-41d4-a716-446655440000", visibility: "public", title: "San Francisco", description: "hilltop views of Alcatraz", imageSrc: "/scrapbook/img_18.png" },
    { id: "550e8400-e29b-41d4-a716-446655440007", wanderlistId: "550e8400-e29b-41d4-a716-446655440000", visibility: "public", title: "South Lake Tahoe", description: "snow mountains and lake views", imageSrc: "/scrapbook/img_19.png" },
];

export const healthPhotos: PhotoData[] = [
    { id: "550e8400-e29b-41d4-a716-446655441001", wanderlistId: "550e8400-e29b-41d4-a716-446655441000", visibility: "public", title: "Morning Yoga", description: "Sunrise stretching session.", imageSrc: "/scrapbook/img_7.png" },
    { id: "550e8400-e29b-41d4-a716-446655441002", wanderlistId: "550e8400-e29b-41d4-a716-446655441000", visibility: "public", title: "Trail Run", description: "Running through foothills.", imageSrc: "/scrapbook/img_8.png" },
    { id: "550e8400-e29b-41d4-a716-446655441003", wanderlistId: "550e8400-e29b-41d4-a716-446655441000", visibility: "public", title: "Healthy Meals", description: "Colorful plant-based dishes.", imageSrc: "/scrapbook/img_9.png" },
    { id: "550e8400-e29b-41d4-a716-446655441004", wanderlistId: "550e8400-e29b-41d4-a716-446655441000", visibility: "public", title: "Massage Healing", description: "soothing massage for recovery", imageSrc: "/scrapbook/img_20.png" },
    { id: "550e8400-e29b-41d4-a716-446655441005", wanderlistId: "550e8400-e29b-41d4-a716-446655441000", visibility: "public", title: "Nature Hot Spring", description: "Relaxing in natural hot springs.", imageSrc: "/scrapbook/img_21.png" },
    { id: "550e8400-e29b-41d4-a716-446655441006", wanderlistId: "550e8400-e29b-41d4-a716-446655441000", visibility: "public", title: "Grilling more", description: "cook your own food, less grease", imageSrc: "/scrapbook/img_22.png" },
];

export const learningPhotos: PhotoData[] = [
    { id: "550e8400-e29b-41d4-a716-446655442001", wanderlistId: "550e8400-e29b-41d4-a716-446655442000", visibility: "public", title: "CNM Campus", description: "Learning hub in Albuquerque.", imageSrc: "/scrapbook/img_10.png" },
    { id: "550e8400-e29b-41d4-a716-446655442002", wanderlistId: "550e8400-e29b-41d4-a716-446655442000", visibility: "public", title: "Coding Bootcamp", description: "Hands-on JavaScript workshop.", imageSrc: "/scrapbook/img_11.png" },
    { id: "550e8400-e29b-41d4-a716-446655442003", wanderlistId: "550e8400-e29b-41d4-a716-446655442000", visibility: "public", title: "Library Study", description: "Quiet reading space.", imageSrc: "/scrapbook/img_12.png" },
    { id: "550e8400-e29b-41d4-a716-446655442004", wanderlistId: "550e8400-e29b-41d4-a716-446655442000", visibility: "public", title: "Learning guitar", description: "practicing chords and strumming", imageSrc: "/scrapbook/img_23.png" },
    { id: "550e8400-e29b-41d4-a716-446655442005", wanderlistId: "550e8400-e29b-41d4-a716-446655442000", visibility: "public", title: "How to Paint", description: "exploring colors on canvas", imageSrc: "/scrapbook/img_24.png" },
    { id: "550e8400-e29b-41d4-a716-446655442006", wanderlistId: "550e8400-e29b-41d4-a716-446655442000", visibility: "public", title: "Photography Class", description: "capturing moments through lens", imageSrc: "/scrapbook/img_25.png" },
];

export const groupGoalPhotos: PhotoData[] = [
    { id: "550e8400-e29b-41d4-a716-446655443001", wanderlistId: "550e8400-e29b-41d4-a716-446655443000", visibility: "public", title: "Community Garden", description: "Planting together.", imageSrc: "/scrapbook/img_13.png" },
    { id: "550e8400-e29b-41d4-a716-446655443002", wanderlistId: "550e8400-e29b-41d4-a716-446655443000", visibility: "public", title: "Scrapbook Planning", description: "Team layout session.", imageSrc: "/scrapbook/img_14.png" },
    { id: "550e8400-e29b-41d4-a716-446655443003", wanderlistId: "550e8400-e29b-41d4-a716-446655443000", visibility: "public", title: "Group Hike", description: "Exploring Sandia together.", imageSrc: "/scrapbook/img_15.png" },
    { id: "550e8400-e29b-41d4-a716-446655443004", wanderlistId: "550e8400-e29b-41d4-a716-446655443000", visibility: "public", title: "Volunteering", description: "group volunteering at animal shelter", imageSrc: "/scrapbook/img_26.png" },
    { id: "550e8400-e29b-41d4-a716-446655443005", wanderlistId: "550e8400-e29b-41d4-a716-446655443000", visibility: "public", title: "Team Sports", description: "playing soccer on weekends", imageSrc: "/scrapbook/img_27.png" },
    { id: "550e8400-e29b-41d4-a716-446655443006", wanderlistId: "550e8400-e29b-41d4-a716-446655443000", visibility: "public", title: "Book Club", description: "discussing novels monthly", imageSrc: "/scrapbook/img_28.png" },
];
