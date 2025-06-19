import { FaSearch, FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";

const GroupFilters = ({ 
    searchTerm, 
    onSearchChange, 
    filterCategory, 
    onCategoryChange, 
    categories 
}) => {
    return (
        <div className="space-y-3 mb-4">
            {/* Search */}
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
            </div>

            {/* Category Filter */}
            <div className="relative">
                <select
                    value={filterCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category === "all" 
                                ? "All Categories" 
                                : category.charAt(0).toUpperCase() + category.slice(1)
                            }
                        </option>
                    ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
            </div>
        </div>
    );
};

GroupFilters.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    filterCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default GroupFilters; 