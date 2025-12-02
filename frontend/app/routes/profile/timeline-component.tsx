import type { WanderList } from "~/utils/models/wanderlist.model";
import { Calendar, CheckCircle, Clock, Zap } from "lucide-react";

interface TimelineComponentProps {
    items: WanderList[];
}

export function TimelineComponent({ items }: TimelineComponentProps) {
    // Sort items by date (most recent first)
    const sortedItems = [...(items || [])].sort((a, b) => {
        const dateA = new Date(a.targetDate || 0).getTime();
        const dateB = new Date(b.targetDate || 0).getTime();
        return dateB - dateA;
    });

    // Get status color and icon
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", icon: "✅" };
            case "In Progress":
                return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", icon: "⏳" };
            case "On Hold":
                return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", icon: "⏸️" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300", icon: "📌" };
        }
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return "No date set";
        const d = new Date(date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getProgressPercentage = (status: string) => {
        switch (status) {
            case "Completed":
                return 100;
            case "In Progress":
                return 60;
            case "On Hold":
                return 30;
            default:
                return 10;
        }
    };

    return (
        <div className="space-y-6">
            {sortedItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No wanderlist items yet. Create one to get started! 🚀</p>
                </div>
            ) : (
                sortedItems.map((item, idx) => {
                    const statusColor = getStatusColor(item.wanderlistStatus);
                    const progress = getProgressPercentage(item.wanderlistStatus);
                    const isPinned = item.pinned;

                    return (
                        <div
                            key={item.id}
                            className={`relative flex gap-4 pb-6 ${idx !== sortedItems.length - 1 ? "border-b-2 border-violet-200" : ""}`}
                        >
                            {/* Timeline dot with animation */}
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${statusColor.bg} ${statusColor.text} ring-4 ring-white shadow-lg transform transition-transform hover:scale-110`}>
                                    {statusColor.icon}
                                    {isPinned && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            ⭐
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content card */}
                            <div className="flex-1 pt-1">
                                <div className={`${statusColor.bg} ${statusColor.border} border-2 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-300`}>
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className={`text-lg font-bold ${statusColor.text} truncate`}>
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(item.targetDate)}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text} whitespace-nowrap ml-2`}>
                                            {item.wanderlistStatus}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {item.description && (
                                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}

                                    {/* Progress bar */}
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-gray-600">Progress</span>
                                            <span className={`text-xs font-bold ${statusColor.text}`}>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${
                                                    item.wanderlistStatus === "Completed"
                                                        ? "bg-gradient-to-r from-green-400 to-green-600"
                                                        : item.wanderlistStatus === "In Progress"
                                                            ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                                            : item.wanderlistStatus === "On Hold"
                                                                ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                                                : "bg-gradient-to-r from-gray-400 to-gray-600"
                                                }`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                        {item.visibility && (
                                            <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full">
                                                🔒 {item.visibility.toUpperCase()}
                                            </span>
                                        )}
                                        {isPinned && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                                                📌 Pinned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
