const UserCardSkeleton = () => {
    return (
        <div className="w-full py-10 max-w-sm h-[50vh] bg-white rounded-xl flex flex-col justify-between animate-pulse">
            <div className="flex justify-center mt-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full" />
            </div>
            <div className="flex flex-col items-center mt-4">
                <div className="w-32 h-6 bg-gray-300 rounded mb-2" />
                <div className="w-24 h-4 bg-gray-300 rounded mb-2" />
                <div className="w-20 h-4 bg-gray-300 rounded mb-2" />
            </div>
        </div>
    );
};
export default UserCardSkeleton;
