export interface PhotoData {
    id: string;
    src: string;
    alt: string;
    caption?: string;
    date?: string;
}

export interface ScrapbookSection {
    id: string;
    title: string;
    description?: string;
    photos: PhotoData[];
}

export interface InspirationItem {
    id: string;
    quote: string;
    author: string;
    mood?: "warm" | "calm" | "playful" | "moody" | "bright";
}



export const scrapbookPhotos: PhotoData[] = [
    {
        id: "p1",
        src: "/images/trip1.jpg",
        alt: "Mountain view",
        caption: "A peaceful morning hike with misty mountains.",
        date: "2025-01-03",
    },
    {
        id: "p2",
        src: "/images/friends1.jpg",
        alt: "Friends laughing",
        caption: "A silly moment with the crew.",
        date: "2025-01-07",
    },
    {
        id: "p3",
        src: "/images/beach.jpg",
        alt: "Sunset beach",
        caption: "Golden hour at the beach — warm & calm.",
        date: "2025-01-12",
    },
    {
        id: "p4",
        src: "/images/cafe.jpg",
        alt: "Cozy cafe table",
        caption: "Latte + journal = perfect afternoon.",
        date: "2025-01-19",
    }
];

export const scrapbookSections: ScrapbookSection[] = [
    {
        id: "sec1",
        title: "Travel Memories",
        description: "Capturing my favorite places and adventures",
        photos: [scrapbookPhotos[0], scrapbookPhotos[2]],
    },
    {
        id: "sec2",
        title: "Friends & Moments",
        description: "The people who make everything better",
        photos: [scrapbookPhotos[1]],
    },
    {
        id: "sec3",
        title: "Everyday Cozy",
        description: "Small simple joys",
        photos: [scrapbookPhotos[3]],
    }
];

export const inspirationItems: InspirationItem[] = [
    {
        id: "insp1",
        quote: "Collect moments, not things.",
        author: "Unknown",
        mood: "warm",
    },
    {
        id: "insp2",
        quote: "The little things? The little moments? They aren't little.",
        author: "Jon Kabat-Zinn",
        mood: "calm",
    },
    {
        id: "insp3",
        quote: "Life is better when you're laughing.",
        author: "Unknown",
        mood: "playful",
    }
];
