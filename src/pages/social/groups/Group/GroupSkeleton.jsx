const GroupSkeleton = () => {
    return (
        <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl p-6 lg:px-[10%]">
            <div className="animate-skeleton-animation space-y-4">
                {/* Cover Image Skeleton */}
                <div className="h-72 bg-gray-300 rounded-lg"></div>
                
                {/* Header Section Skeleton */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            {/* Group Name */}
                            <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                            {/* Group Info */}
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <div className="h-10 bg-gray-300 rounded w-20"></div>
                            <div className="h-10 bg-gray-300 rounded w-20"></div>
                            <div className="h-10 bg-gray-300 rounded w-24"></div>
                        </div>
                    </div>
                    
                    {/* Tabs Skeleton */}
                    <div className="flex gap-6 border-b">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="h-10 bg-gray-300 rounded w-20 mb-4"></div>
                        ))}
                    </div>
                </div>
                
                {/* Content Area Skeleton */}
                <div className="grid grid-cols-10 gap-6">
                    {/* Main Content */}
                    <div className="col-span-7 space-y-4">
                        {/* Post Form Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-20 bg-gray-300 rounded-lg mb-3"></div>
                                    <div className="flex justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                        </div>
                                        <div className="h-8 bg-gray-300 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Posts Skeleton */}
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                    <div>
                                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                </div>
                                {item === 2 && (
                                    <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                                )}
                                <div className="flex gap-6 pt-3 border-t">
                                    <div className="h-6 bg-gray-300 rounded w-12"></div>
                                    <div className="h-6 bg-gray-300 rounded w-12"></div>
                                    <div className="h-6 bg-gray-300 rounded w-12"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Sidebar */}
                    <div className="col-span-3 space-y-6">
                        {/* About Section Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                            <div className="space-y-2 mb-4">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Rules Section Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                            <div className="space-y-2">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex gap-2">
                                        <div className="w-4 h-4 bg-gray-300 rounded mt-1"></div>
                                        <div className="h-4 bg-gray-300 rounded flex-1"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Admins Section Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                            <div className="mb-4">
                                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2].map((item) => (
                                        <div key={item} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupSkeleton;
