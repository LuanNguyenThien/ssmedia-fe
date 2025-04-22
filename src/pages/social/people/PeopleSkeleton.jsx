import UserCardSkeleton from "./components/UserCardSkeleton";

const PeopleSkeleton = () => {
    return (
        <div className="h-screen w-full rounded-t-3xl bg-background-blur max-h-[88vh] col-span-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-scroll p-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <UserCardSkeleton key={index} />
            ))}
        </div>
    );
};

export default PeopleSkeleton;
