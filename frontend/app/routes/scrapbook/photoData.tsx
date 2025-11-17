

export type PhotoData = {
    title: string;
    description: string;
    imageSrc: string;
    altText?: string;
};

export const travelPhotos: PhotoData[] = [
    { title: "Balloon Fiesta", description: "hot air balloon view.", imageSrc: "/scrapbook/img_4.png" },
    { title: "Sandia Mountain hike", description: "Hiking open trails up the mountain.", imageSrc: "/scrapbook/img_5.png" },
    { title: "Road trip on route 66", description: "Driving west for 10 days on route 66.", imageSrc: "/scrapbook/img_6.png" },
    { title: "Backpacking Europe", description: "much more scenery while hiking.", imageSrc: "/scrapbook/img_16.png" },
    { title: "Hawaii Beaches", description: "Relaxing on the sandy shores.", imageSrc: "/scrapbook/img_17.png" },
    { title: "San Francisco", description: "hilltop views of Alcatraz", imageSrc: "/scrapbook/img_18.png" },
    { title: "South Lake Tahoe", description: "snow mountains and lake views", imageSrc: "/scrapbook/img_19.png" },
];

export const healthPhotos: PhotoData[] = [
    { title: "Morning Yoga", description: "Sunrise stretching session.", imageSrc: "/scrapbook/img_7.png" },
    { title: "Trail Run", description: "Running through foothills.", imageSrc: "/scrapbook/img_8.png" },
    { title: "Healthy Meals", description: "Colorful plant-based dishes.", imageSrc: "/scrapbook/img_9.png" },
    { title: "Massage Healing", description: "soothing massage for recovery", imageSrc: "/scrapbook/img_20.png" },
    { title: "Nature Hot Spring", description: "Relaxing in natural hot springs.", imageSrc: "/scrapbook/img_21.png" },
    { title: "Grilling more", description: "cook your own food, less grease", imageSrc: "/scrapbook/img_22.png" },
];

export const learningPhotos: PhotoData[] = [
    { title: "CNM Campus", description: "Learning hub in Albuquerque.", imageSrc: "/scrapbook/img_10.png" },
    { title: "Coding Bootcamp", description: "Hands-on JavaScript workshop.", imageSrc: "/scrapbook/img_11.png" },
    { title: "Library Study", description: "Quiet reading space.", imageSrc: "/scrapbook/img_12.png" },
    { title: "Learning guitar", description: "practicing chords and strumming", imageSrc: "/scrapbook/img_23.png" },
    { title: "How to Paint", description: "exploring colors on canvas", imageSrc: "/scrapbook/img_24.png" },
    { title: "Photography Class", description: "capturing moments through lens", imageSrc: "/scrapbook/img_25.png" },
];

export const groupGoalPhotos: PhotoData[] = [
    { title: "Community Garden", description: "Planting together.", imageSrc: "/scrapbook/img_13.png" },
    { title: "Scrapbook Planning", description: "Team layout session.", imageSrc: "/scrapbook/img_14.png" },
    { title: "Group Hike", description: "Exploring Sandia together.", imageSrc: "/scrapbook/img_15.png" },
    { title: "Volunteering", description: "group volunteering at animal shelter", imageSrc: "/scrapbook/img_26.png" },
    { title: "Team Sports", description: "playing soccer on weekends", imageSrc: "/scrapbook/img_27.png" },
    { title: "Book Club", description: "discussing novels monthly", imageSrc: "/scrapbook/img_28.png" },
];
