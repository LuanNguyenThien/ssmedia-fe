import PropTypes from "prop-types";
import Input from "@components/input/Input";
import { FaSearch } from "react-icons/fa";

const GroupSearchInput = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
            <Input
                type="text"
                name="group-search"
                placeholder="Search for groups"
                value={searchTerm}
                handleChange={onSearchChange}
                className="pl-10 rounded-xl bg-gray-100 border-none"
            />
        </div>
    );
};

GroupSearchInput.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
};

export default GroupSearchInput; 