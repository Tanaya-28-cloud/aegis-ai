export default function LoadingSkeleton() {
    return (
        <div className="max-w-2xl mt-6 rounded-xl p-6 border border-gray-800 bg-gray-900 animate-pulse">
            <div className="flex items-center justify-between mb-6">
                <div className="h-7 w-48 bg-gray-700 rounded-lg" />
                <div className="h-4 w-20 bg-gray-700 rounded-lg" />
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full mb-6" />
            <div className="mb-2 h-4 w-32 bg-gray-700 rounded" />
            <div className="space-y-2 mb-6">
                <div className="h-3 w-full bg-gray-800 rounded" />
                <div className="h-3 w-4/5 bg-gray-800 rounded" />
                <div className="h-3 w-3/5 bg-gray-800 rounded" />
            </div>
            <div className="mb-2 h-4 w-24 bg-gray-700 rounded" />
            <div className="space-y-2">
                <div className="h-3 w-full bg-gray-800 rounded" />
                <div className="h-3 w-3/4 bg-gray-800 rounded" />
            </div>
        </div>
    )
}