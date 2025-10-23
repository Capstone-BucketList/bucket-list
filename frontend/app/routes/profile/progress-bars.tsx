export function ProgressBars() {
    return (
        <>
            <div
                className="space-y-4">
                <div className="mb-1 text-base font-semibold text-gray-800">Completed</div>
                <div className="w-2/4 bg-white rounded-full h-2.5 mb-4 mx-auto">
                    <div className="bg-green-600 h-2.5 rounded-full w-1/5"></div>
                </div>
            </div>
        </>
    )
}