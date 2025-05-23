import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa";
import GroupSearchInput from "./GroupSearchInput";
import GroupList from "./GroupList";
import GroupFilter from "./GroupFilter";

const GroupSidebar = ({ 
    searchTerm, 
    onSearchChange, 
    filteredGroups, 
    onGroupToggle,
    onCreateGroup,
    activeFilter,
    onFilterChange
}) => {
    const handleCreateGroup = () => {
        onCreateGroup();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCreateGroup();
        }
    };

    return (
        <div className="col-span-3 bg-white/80 rounded-2xl shadow-sm p-4 h-full max-h-full overflow-y-scroll">
            <div className="flex flex-col h-full">
                {/* Your Groups Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-extrabold text-gray-800">
                        Your Groups
                    </h2>
                    <button
                        className="flex items-center gap-2 text-blue-500 p-1.5 rounded-full hover:underline transition-colors"
                        aria-label="Create new group"
                        tabIndex="0"
                        onClick={handleCreateGroup}
                        onKeyDown={handleKeyDown}
                    >
                        <FaPlus size={12} />
                        Create your group
                    </button>
                </div>

                {/* Filter Tabs */}
                <GroupFilter
                    activeFilter={activeFilter}
                    onFilterChange={onFilterChange}
                />

                {/* Search Box */}
                <GroupSearchInput
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                />

                {/* Group List */}
                <GroupList
                    groups={filteredGroups}
                    onGroupToggle={onGroupToggle}
                    activeFilter={activeFilter}
                />
            </div>
        </div>
    );
};

GroupSidebar.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    filteredGroups: PropTypes.array.isRequired,
    onGroupToggle: PropTypes.func.isRequired,
    onCreateGroup: PropTypes.func.isRequired,
    activeFilter: PropTypes.oneOf(["all", "joined", "explore"]).isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

export default GroupSidebar; 