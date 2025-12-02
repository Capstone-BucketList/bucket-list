import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import {
    FaMountain,
    FaPlane,
    FaBook,
    FaDumbbell,
    FaPalette,
    FaTrophy,
    FaFire,
    FaStar,
    FaUsers,
    FaImages,
    FaArrowRight,
    FaGlobe,
} from "react-icons/fa";

// ============================================================================
// 1. STATISTICS SECTION
// ============================================================================
export function StatisticsSection() {
    const [stats, setStats] = useState({
        totalWanderlists: 0,
        completedGoals: 0,
        activeMembers: 0,
        countriesCovered: 0,
    });

    const [displayStats, setDisplayStats] = useState({
        totalWanderlists: 0,
        completedGoals: 0,
        activeMembers: 0,
        countriesCovered: 0,
    });

    useEffect(() => {
        // Animate counter effect
        const targetStats = {
            totalWanderlists: 5420,
            completedGoals: 12850,
            activeMembers: 8750,
            countriesCovered: 145,
        };
        setStats(targetStats);

        const intervals: ReturnType<typeof setInterval>[] = [];
        const duration = 2000; // 2 seconds
        const steps = 60;

        Object.keys(targetStats).forEach((key) => {
            const target = targetStats[key as keyof typeof targetStats];
            const start = 0;
            const increment = target / steps;
            let current = 0;

            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                setDisplayStats((prev) => ({
                    ...prev,
                    [key]: Math.floor(current),
                }));
            }, duration / steps);

            intervals.push(interval);
        });

        return () => intervals.forEach((interval) => clearInterval(interval));
    }, []);

    return (
        <section className="py-16 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-white text-center mb-12">
                    Our Community Impact
                </h2>

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Wanderlists Stat */}
                    <div className="text-center p-8 bg-white/10 backdrop-blur rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                        <div className="text-5xl font-black text-white mb-2">
                            {displayStats.totalWanderlists.toLocaleString()}
                        </div>
                        <p className="text-white text-lg font-semibold">
                            Wanderlists Created
                        </p>
                        <p className="text-white/70 text-sm mt-2">
                            Dreams turned into lists
                        </p>
                    </div>

                    {/* Completed Goals Stat */}
                    <div className="text-center p-8 bg-white/10 backdrop-blur rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                        <div className="text-5xl font-black text-white mb-2">
                            {displayStats.completedGoals.toLocaleString()}
                        </div>
                        <p className="text-white text-lg font-semibold">
                            Goals Completed
                        </p>
                        <p className="text-white/70 text-sm mt-2">
                            Dreams achieved together
                        </p>
                    </div>

                    {/* Active Members Stat */}
                    <div className="text-center p-8 bg-white/10 backdrop-blur rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                        <div className="text-5xl font-black text-white mb-2">
                            {displayStats.activeMembers.toLocaleString()}
                        </div>
                        <p className="text-white text-lg font-semibold">
                            Active Members
                        </p>
                        <p className="text-white/70 text-sm mt-2">
                            Dreamers worldwide
                        </p>
                    </div>

                    {/* Countries Stat */}
                    <div className="text-center p-8 bg-white/10 backdrop-blur rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                        <div className="text-5xl font-black text-white mb-2">
                            {displayStats.countriesCovered}
                        </div>
                        <p className="text-white text-lg font-semibold">
                            Countries Covered
                        </p>
                        <p className="text-white/70 text-sm mt-2">
                            Global exploration
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// 2. GOAL CATEGORY SHOWCASE
// ============================================================================
export function GoalCategoryShowcase() {
    const categories = [
        {
            icon: <FaMountain className="text-6xl mb-4" />,
            title: "Adventure Goals",
            description: "Mountain climbing, trekking, extreme sports",
            gradient: "from-orange-400 to-red-500",
            textColor: "text-white",
            count: "2,145 goals",
        },
        {
            icon: <FaPlane className="text-6xl mb-4" />,
            title: "Travel Goals",
            description: "World exploration, city visits, bucket list trips",
            gradient: "from-blue-400 to-cyan-500",
            textColor: "text-white",
            count: "3,892 goals",
        },
        {
            icon: <FaBook className="text-6xl mb-4" />,
            title: "Learning Goals",
            description: "Education, languages, skills development",
            gradient: "from-purple-400 to-indigo-500",
            textColor: "text-white",
            count: "1,654 goals",
        },
        {
            icon: <FaDumbbell className="text-6xl mb-4" />,
            title: "Fitness Goals",
            description: "Health, wellness, sports achievements",
            gradient: "from-green-400 to-emerald-500",
            textColor: "text-white",
            count: "2,123 goals",
        },
        {
            icon: <FaPalette className="text-6xl mb-4" />,
            title: "Creative Goals",
            description: "Art, music, culture, creative expression",
            gradient: "from-pink-400 to-rose-500",
            textColor: "text-white",
            count: "1,306 goals",
        },
        {
            icon: <FaTrophy className="text-6xl mb-4" />,
            title: "Achievement Goals",
            description: "Milestones, personal bests, records",
            gradient: "from-yellow-400 to-amber-500",
            textColor: "text-white",
            count: "1,300 goals",
        },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4">
                    Popular Goal Categories
                </h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Explore thousands of goals across different life categories
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {categories.map((category, idx) => (
                        <div
                            key={idx}
                            className={`bg-gradient-to-br ${category.gradient} rounded-3xl p-8 text-center ${category.textColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                        >
                            <div className="flex justify-center mb-4">
                                {category.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {category.title}
                            </h3>
                            <p className="opacity-90 mb-4 text-sm">
                                {category.description}
                            </p>
                            <div className="text-sm font-semibold opacity-75">
                                {category.count}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// 3. TRENDING BUCKET LISTS
// ============================================================================
export function TrendingBucketLists() {
    const trendingGoals = [
        {
            title: "Climb Mount Everest",
            category: "Adventure",
            saves: 2145,
            gradient: "from-orange-100 to-red-100",
            borderColor: "border-orange-300",
            icon: "🏔️",
        },
        {
            title: "Visit 50 Countries",
            category: "Travel",
            saves: 3421,
            gradient: "from-blue-100 to-cyan-100",
            borderColor: "border-blue-300",
            icon: "✈️",
        },
        {
            title: "Learn 3 Languages",
            category: "Learning",
            saves: 1892,
            gradient: "from-purple-100 to-indigo-100",
            borderColor: "border-purple-300",
            icon: "📚",
        },
        {
            title: "Run a Marathon",
            category: "Fitness",
            saves: 2456,
            gradient: "from-green-100 to-emerald-100",
            borderColor: "border-green-300",
            icon: "💪",
        },
        {
            title: "Create a Masterpiece",
            category: "Creative",
            saves: 1234,
            gradient: "from-pink-100 to-rose-100",
            borderColor: "border-pink-300",
            icon: "🎨",
        },
        {
            title: "Write a Book",
            category: "Creative",
            saves: 2789,
            gradient: "from-indigo-100 to-purple-100",
            borderColor: "border-indigo-300",
            icon: "📖",
        },
    ];

    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const scrollAmount = 400;
            containerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4">
                    🔥 Trending Goals This Month
                </h2>
                <p className="text-center text-gray-600 mb-12">
                    Most saved and popular goals from our community
                </p>

                <div className="relative">
                    <div
                        ref={containerRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {trendingGoals.map((goal, idx) => (
                            <div
                                key={idx}
                                className={`flex-shrink-0 w-80 bg-gradient-to-br ${goal.gradient} border-2 ${goal.borderColor} rounded-3xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer`}
                            >
                                <div className="text-5xl mb-4">{goal.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {goal.title}
                                </h3>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-white/50 rounded-full text-sm font-semibold text-gray-700">
                                        {goal.category}
                                    </span>
                                    <span className="text-sm font-bold text-gray-700">
                                        ❤️ {goal.saves}
                                    </span>
                                </div>
                                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-xl hover:shadow-lg transition-all">
                                    Add to My List
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Scroll Buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 z-10"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 z-10"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// 4. USER SUCCESS STORIES
// ============================================================================
export function UserSuccessStories() {
    const stories = [
        {
            name: "Sarah Chen",
            avatar: "SC",
            avatarColor: "from-pink-400 to-rose-500",
            story: "Completed 25 travel goals and visited 15 countries in 2 years!",
            goalsCompleted: 42,
            testimonial: "WanderList changed my life",
        },
        {
            name: "Marcus Johnson",
            avatar: "MJ",
            avatarColor: "from-blue-400 to-cyan-500",
            story: "Climbed Mount Kilimanjaro after tracking it for 6 months.",
            goalsCompleted: 18,
            testimonial: "Dreams become reality",
        },
        {
            name: "Priya Sharma",
            avatar: "PS",
            avatarColor: "from-purple-400 to-indigo-500",
            story: "Learned 3 languages while traveling across Europe with friends.",
            goalsCompleted: 31,
            testimonial: "Community support is amazing",
        },
        {
            name: "Alex Rodriguez",
            avatar: "AR",
            avatarColor: "from-green-400 to-emerald-500",
            story: "Ran a sub-4-minute mile after 8 months of dedicated training.",
            goalsCompleted: 28,
            testimonial: "Achieved the impossible",
        },
        {
            name: "Emma Wilson",
            avatar: "EW",
            avatarColor: "from-yellow-400 to-amber-500",
            story: "Published my first novel and won a local writing award!",
            goalsCompleted: 24,
            testimonial: "Dreams do come true",
        },
        {
            name: "Raj Patel",
            avatar: "RP",
            avatarColor: "from-orange-400 to-red-500",
            story: "Started and sold a successful adventure tourism company.",
            goalsCompleted: 36,
            testimonial: "WanderList inspired my career",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const scrollAmount = 400;
            containerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-white text-center mb-4">
                    ⭐ Success Stories
                </h2>
                <p className="text-white/80 text-center mb-12 max-w-2xl mx-auto">
                    Real people achieving real dreams with WanderList
                </p>

                <div className="relative">
                    <div
                        ref={containerRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                    >
                        {stories.map((story, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-96 bg-white/95 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Avatar */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${story.avatarColor} flex items-center justify-center text-white font-bold text-xl`}
                                    >
                                        {story.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {story.name}
                                        </h3>
                                        <div className="flex gap-1 text-yellow-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Story */}
                                <p className="text-gray-700 mb-4 italic">
                                    "{story.story}"
                                </p>

                                {/* Testimonial */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border-l-4 border-blue-500">
                                    <p className="text-sm font-semibold text-gray-800">
                                        "{story.testimonial}"
                                    </p>
                                </div>

                                {/* Goals Completed Badge */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Goals Completed
                                    </span>
                                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full text-sm">
                                        {story.goalsCompleted}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Scroll Buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 z-10"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 z-10"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// 5. FEATURED COLLECTIONS
// ============================================================================
export function FeaturedCollections() {
    const collections = [
        {
            icon: "⭐",
            title: "Most Liked",
            subtitle: "This Month",
            description: "The most loved wanderlists from our community",
            gradient: "from-yellow-400 to-orange-500",
            count: "2,451 likes",
        },
        {
            icon: "🔥",
            title: "Trending Now",
            subtitle: "Popular",
            description: "Goals everyone is talking about right now",
            gradient: "from-red-400 to-pink-500",
            count: "1,892 saves",
        },
        {
            icon: "👥",
            title: "Community Challenges",
            subtitle: "Join Together",
            description: "Shared goals you can complete with friends",
            gradient: "from-blue-400 to-purple-500",
            count: "562 participants",
        },
        {
            icon: "📸",
            title: "Photo Stories",
            subtitle: "Memories",
            description: "Beautiful completed goals with amazing photos",
            gradient: "from-green-400 to-teal-500",
            count: "3,124 photos",
        },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12">
                    Featured Collections
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {collections.map((collection, idx) => (
                        <div
                            key={idx}
                            className={`bg-gradient-to-br ${collection.gradient} rounded-3xl p-10 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group`}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="text-5xl mb-4">
                                        {collection.icon}
                                    </div>
                                    <h3 className="text-3xl font-bold">
                                        {collection.title}
                                    </h3>
                                    <p className="text-white/70 font-semibold">
                                        {collection.subtitle}
                                    </p>
                                </div>
                                <FaArrowRight className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <p className="text-white/90 mb-6">
                                {collection.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/30">
                                <span className="font-semibold">
                                    {collection.count}
                                </span>
                                <button className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-all">
                                    Explore
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// 6. ANIMATED STEPS - HOW IT WORKS
// ============================================================================
export function HowItWorks() {
    const steps = [
        {
            number: "1",
            title: "Create Your Dream",
            description: "Add a goal to your wanderlist with target date and details",
            icon: "✏️",
            gradient: "from-blue-400 to-blue-600",
        },
        {
            number: "2",
            title: "Track Progress",
            description: "Update status and monitor your journey to completion",
            icon: "📊",
            gradient: "from-purple-400 to-purple-600",
        },
        {
            number: "3",
            title: "Share & Connect",
            description: "Share achievements with friends and find accountability partners",
            icon: "🤝",
            gradient: "from-pink-400 to-pink-600",
        },
        {
            number: "4",
            title: "Celebrate Success",
            description: "Celebrate completing goals and collect achievement badges",
            icon: "🏆",
            gradient: "from-yellow-400 to-yellow-600",
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4">
                    How It Works
                </h2>
                <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                    Four simple steps to start achieving your dreams
                </p>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {steps.map((step, idx) => (
                        <React.Fragment key={idx}>
                            <div
                                className={`flex-1 bg-gradient-to-br ${step.gradient} rounded-2xl p-8 text-white text-center hover:shadow-xl transition-all transform hover:scale-105`}
                            >
                                <div className="text-6xl mb-4">{step.icon}</div>
                                <div className="text-4xl font-black mb-3">
                                    {step.number}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-white/90 text-sm">
                                    {step.description}
                                </p>
                            </div>

                            {/* Arrow between steps */}
                            {idx < steps.length - 1 && (
                                <div className="hidden md:flex justify-center">
                                    <FaArrowRight className="text-4xl text-gray-400" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// 7. GOAL STATS INFOGRAPHIC
// ============================================================================
export function GoalStatsInfographic() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = React.useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const stats = [
        {
            label: "Completed Goals",
            percentage: 45,
            color: "from-green-400 to-emerald-500",
            emoji: "✅",
        },
        {
            label: "In Progress",
            percentage: 35,
            color: "from-blue-400 to-cyan-500",
            emoji: "⏳",
        },
        {
            label: "On Hold",
            percentage: 15,
            color: "from-yellow-400 to-orange-500",
            emoji: "⏸️",
        },
        {
            label: "Not Started",
            percentage: 5,
            color: "from-gray-400 to-gray-500",
            emoji: "📌",
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="py-16 bg-gradient-to-r from-slate-900 to-slate-800"
        >
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-white text-center mb-4">
                    Goal Status Overview
                </h2>
                <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
                    See how our community progresses toward their dreams
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left side - Progress Bars */}
                    <div className="space-y-8">
                        {stats.map((stat, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-semibold flex items-center gap-2">
                                        <span className="text-2xl">{stat.emoji}</span>
                                        {stat.label}
                                    </span>
                                    <span className="text-white font-bold text-lg">
                                        {stat.percentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                                        style={{
                                            width: isVisible ? `${stat.percentage}%` : "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right side - Stats */}
                    <div className="bg-white/10 backdrop-blur rounded-3xl p-10 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            Progress Insights
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">📈</div>
                                <div>
                                    <p className="text-white font-semibold">
                                        45% Completion Rate
                                    </p>
                                    <p className="text-white/70 text-sm">
                                        Nearly half of all goals are completed
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">⚡</div>
                                <div>
                                    <p className="text-white font-semibold">
                                        35% Active Goals
                                    </p>
                                    <p className="text-white/70 text-sm">
                                        Majority are actively pursuing dreams
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">🎯</div>
                                <div>
                                    <p className="text-white font-semibold">
                                        Avg. 2.3 years to complete
                                    </p>
                                    <p className="text-white/70 text-sm">
                                        Time to transform dreams into reality
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// 8. CTA CARDS
// ============================================================================
export function CTACards() {
    const ctaCards = [
        {
            title: "Create Your First Goal",
            description: "Start your journey today",
            gradient: "from-cyan-400 to-blue-500",
            icon: "🎯",
            action: "Get Started",
        },
        {
            title: "Explore Community Goals",
            description: "Find inspiration from others",
            gradient: "from-purple-400 to-pink-500",
            icon: "🌟",
            action: "Explore",
        },
        {
            title: "Share Your Story",
            description: "Inspire others with your journey",
            gradient: "from-orange-400 to-red-500",
            icon: "📖",
            action: "Share",
        },
        {
            title: "Join a Challenge",
            description: "Complete goals with friends",
            gradient: "from-green-400 to-teal-500",
            icon: "🏆",
            action: "Join",
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-6">
                    {ctaCards.map((card, idx) => (
                        <div
                            key={idx}
                            className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-8 text-white text-center hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer group`}
                        >
                            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {card.title}
                            </h3>
                            <p className="text-white/90 text-sm mb-6">
                                {card.description}
                            </p>
                            <button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-full transition-all backdrop-blur">
                                {card.action}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// 9. ENHANCED HERO SECTION
// ============================================================================
export function EnhancedHeroSection() {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex items-center">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 text-center">
                <div className="mb-8 inline-block">
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-6 py-2 rounded-full text-sm font-bold">
                        ✨ Turn Dreams Into Adventures
                    </span>
                </div>

                <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
                    Your Journey
                    <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Starts Here
                    </span>
                </h1>

                <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Create your bucket list, share with friends, and start checking
                    off your dreams. Join thousands of adventurers making every moment
                    count.
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                    <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-10 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all text-lg">
                        Start Your Journey
                    </button>
                    <button className="border-2 border-white text-white font-bold px-10 py-4 rounded-full hover:bg-white/10 transition-all text-lg">
                        Learn More
                    </button>
                </div>

                {/* Floating stats */}
                <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl font-black text-cyan-400">5.4K+</div>
                        <p className="text-white/70 mt-2">Wanderlists Created</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl font-black text-purple-400">8.7K+</div>
                        <p className="text-white/70 mt-2">Active Members</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl font-black text-pink-400">145</div>
                        <p className="text-white/70 mt-2">Countries</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
