const DiscussionTabSkeleton = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-skeleton-animation"></div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton-animation"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 mt-2 animate-skeleton-animation"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-animation"></div>
                        <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-animation"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-skeleton-animation"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default DiscussionTabSkeleton;
