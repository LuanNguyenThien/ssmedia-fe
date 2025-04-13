import UserCardSkeleton from "./components/UserCardSkeleton";

const PeopleSkeleton = () => {
    return (
        <div className="h-screen bg-background-blur max-h-[88vh] col-span-4 grid grid-cols-4 gap-5 overflow-y-scroll p-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <UserCardSkeleton key={index} />
            ))}
        </div>
    );
};

export default PeopleSkeleton;
