// SearchSkeleton.tsx
export default function SearchSkeleton() {
    return (
        <div className=" p-1 sm:p-6 size-full max-w-full mx-auto space-y-8">
            {/* Users Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">People</h2>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="animate-skeleton-animation flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm"
                        >
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Posts Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="animate-skeleton-animation flex flex-col gap-2 p-4 border rounded-xl bg-white shadow-sm"
                        >
                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            <div className="h-3 w-full bg-gray-200 rounded"></div>
                            <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
