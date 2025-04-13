const FilterNotifications = ({ isChosenFilter, setIsChosenFilter }) => {
    return (
        <div className="flex items-center justify-center gap-1">
            <span
                onClick={() => {
                    setIsChosenFilter("All");
                }}
                className={`text-xs cursor-pointer text-primary-white px-3 py-1 rounded-xl ${
                    isChosenFilter === "All" ? "bg-primary/80" : "bg-primary/30"
                }`}
            >
                All
            </span>
            <span
                onClick={() => {
                    setIsChosenFilter("Unread");
                }}
                className={`text-xs cursor-pointer text-primary-white px-3 py-1 rounded-xl ${
                    isChosenFilter === "Unread"
                        ? "bg-primary/80"
                        : "bg-primary/30"
                }`}
            >
                Unread
            </span>
        </div>
    );
};

export default FilterNotifications;
