
import type {FC} from "react";
import type {WanderList} from "~/utils/models/wanderlist.model";



interface ProgressBarsProps {
    items: WanderList[];
}

const statusProgressMap: Record<string, number> = {
    "Not Started": 0,
    "In Progress": 50,
    "On Hold": 20,
    "Completed": 100,
};

const statusColorMap: Record<string, string> = {
    "Not Started": "bg-gray-300",
    "In Progress": "bg-blue-500",
    "On Hold": "bg-yellow-500",
    "Completed": "bg-green-600",
};

export const ProgressBars: FC<ProgressBarsProps> = ({ items }) => {
    return (
        <div className="space-y-6 w-full">
            {items.map((item, index)=>
                {
                    const progress = statusProgressMap[item.wanderlistStatus] ?? 0;
                const barColor = statusColorMap[item.wanderlistStatus] ?? "bg-gray-300";

                return (
                <div key={index} className="p-4 rounded-xl bg-white shadow border">
                    {/* Title + Target Date */}
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>

                        {item.targetDate && (
                            <span className="text-sm text-gray-500">
                🎯 {item.targetDate.toDateString()}
              </span>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <p className="text-gray-500 text-sm mb-3">{item.description}</p>
                    )}


            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-3 ${barColor} transition-all duration-700`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Percentage */}
            <div className="mt-2 text-right text-sm font-medium text-gray-700">
                {progress}% Complete
            </div>
            </div>
                    );
                    })}
                </div>
                );
                }