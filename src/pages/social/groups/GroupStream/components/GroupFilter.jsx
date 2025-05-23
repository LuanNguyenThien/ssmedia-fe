import PropTypes from "prop-types";

const GroupFilter = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { key: "all", label: "All Groups", count: null },
        { key: "joined", label: "Joined", count: null },
        { key: "explore", label: "Explore", count: null },
    ];

    const handleFilterClick = (filterKey) => {
        onFilterChange(filterKey);
    };

    const handleKeyDown = (event, filterKey) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleFilterClick(filterKey);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {filters.map((filter) => (
                    <button
                        key={filter.key}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeFilter === filter.key
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                        onClick={() => handleFilterClick(filter.key)}
                        onKeyDown={(e) => handleKeyDown(e, filter.key)}
                        tabIndex="0"
                        aria-label={`Filter by ${filter.label}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

GroupFilter.propTypes = {
    activeFilter: PropTypes.oneOf(["all", "joined", "explore"]).isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

export default GroupFilter; 