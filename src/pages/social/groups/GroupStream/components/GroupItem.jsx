import PropTypes from "prop-types";
import { IoMdPeople } from "react-icons/io";
import { HiCheckCircle } from "react-icons/hi";
import { HiPlusCircle } from "react-icons/hi";

const GroupItem = ({ group, onGroupToggle }) => {
    const handleClick = () => {
        onGroupToggle(group.id);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            className={`p-3 mb-2 rounded-xl cursor-pointer transition-all duration-200 ${
                group.isJoined
                    ? "hover:bg-green-50 border border-green-100"
                    : "hover:bg-blue-50 border border-transparent hover:border-blue-100"
            }`}
            tabIndex="0"
            aria-label={`${group.name} group with ${group.members} members`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-grow">
                    <div
                        className={`p-2 rounded-lg mr-3 ${
                            group.isJoined ? "bg-green-100" : "bg-gray-200"
                        }`}
                    >
                        <IoMdPeople
                            className={
                                group.isJoined
                                    ? "text-green-600"
                                    : "text-blue-500"
                            }
                            size={20}
                        />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-medium text-gray-800">
                            {group.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {group.members} members
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {group.isJoined && (
                        <>
                            <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors">
                                Join
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

GroupItem.propTypes = {
    group: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        members: PropTypes.number.isRequired,
        isJoined: PropTypes.bool.isRequired,
    }).isRequired,
    onGroupToggle: PropTypes.func.isRequired,
};

export default GroupItem;
