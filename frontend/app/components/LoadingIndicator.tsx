import { Loader } from "lucide-react";
import { useNavigation } from "react-router";

export function LoadingIndicator() {
    const navigation = useNavigation();
    const isLoading = navigation.state !== "idle";

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
}
